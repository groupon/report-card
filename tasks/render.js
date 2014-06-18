var Handlebars = require('handlebars');
var fs = require('fs');
function helper(name){
 return require('./render/helpers/'+ name);
}


var template = fs.readFileSync(__dirname + '/../templates/index.hbs').toString();
var repoTemplate = fs.readFileSync(__dirname + '/../templates/github-repo-card.hbs').toString();
Handlebars.registerPartial('github-repo-card', repoTemplate);
Handlebars.registerHelper('top5Languages', helper('top-languages'));
Handlebars.registerHelper('avatar', helper('avatar'));
Handlebars.registerHelper('ceilingPercent', helper('ceiling-percent'));
Handlebars.registerHelper('inflectCountable', helper('inflect-countable'));
Handlebars.registerHelper('sumEvents', helper('sum-events'));
Handlebars.registerHelper('languageToPerson', helper('language-to-person'));
Handlebars.registerHelper('userOrTeam', helper('user-or-repo'));
Handlebars.registerHelper('eventTypeToName', helper('event-to-name'));

var render = Handlebars.compile(template);

var EVENT_TYPE_TO_ACTION_PHRASE = {
  "PushEvent": "pushing code",
  "CommentEvent": "commenting on issues",
  "CreateEvent": "creating repos",
  "IssuesEvent": "responding to issues",
  "PullRequestEvent": "opening pull requests",
  "PullRequestReviewCommentEvent": "commenting on pull requests",
}


var data = JSON.parse(fs.readFileSync(__dirname + '/../data/data.json').toString());

function rsortBy(properyName){
  return  function(a,b){
    if (a[properyName] > b[properyName])
      return -1;
    if (a[properyName] < b[properyName])
      return 1;
    return 0;
  }
}

data.usage.topLanguages = data.usage.topLanguages.sort(rsortBy('count'));
data.usage.allLanguages = data.usage.allLanguages.sort(rsortBy('count'));
data.usage.events = data.usage.events.sort(rsortBy('total'));

data.topLanguage = data.usage.topLanguages[0].language;
data.topActivity = EVENT_TYPE_TO_ACTION_PHRASE[data.usage.events[0].type];
data.secondTopActivity = EVENT_TYPE_TO_ACTION_PHRASE[data.usage.events[1].type];

debugger;
var html = render(data);

// apply charts!
var d3 = require('d3'),
    jsdom = require('jsdom'),
    languageColors = require('./constants/language-colors');

jsdom.env({
  features: { QuerySelector : true },
  html: html,
  done : function(errors, window) {
    var languages = [],
        other = {language: "Other", count: 0},
        graphedPercent = 0,
        languageTotal = data.usage.allLanguages.map(function(l){
          return l.count;
        }).reduce(function(previousValue, currentValue){
          return previousValue + currentValue;
        }, 0);

    data.usage.allLanguages.forEach(function(language){
      if (graphedPercent > 75.0) {
        other.count+= language.count;
      } else {
        languages.push(language);
      }

      graphedPercent += (language.count / languageTotal * 100);

    });

    languages.push(other);

    var el = window.document.querySelector('#d3-language-diagram-outlet');

    // var color = d3.scale.ordinal()
    //     .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

    var width = 500,
        height = 300,
        radius = Math.min(width, height) / 2;

    var arc = d3.svg.arc()
        .outerRadius(radius - 10)
        .innerRadius(0);

    var pie = d3.layout.pie()
        .sort(null)
        .value(function(d) { return d.count; });

    var svg = d3.select(el).append("svg")
          .attr("width", width)
          .attr("height", height)
          .style("padding-bottom", 20)
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var g = svg.selectAll(".arc")
            .data(pie(languages))
            .enter().append("g")
            .attr("class", "arc");
    g.append("path")
          .attr("d", arc)
          .style("fill", function(d) { return languageColors[d.data.language] || '#fff'; });

    var labelRadius = radius + 10;

    g.append("text")
          .attr("transform", function(d) {
              var c = arc.centroid(d), x = c[0], y = c[1],
                  // pythagorean theorem for hypotenuse
                  h = Math.sqrt(x*x + y*y);
              return "translate(" + (x/h * labelRadius) +  ',' + (y/h * labelRadius) +  ")";
          })
          .attr("dy", ".35em")

          .attr("text-anchor", function(d) {
            // are we past the center?
            return (d.endAngle + d.startAngle)/2 > Math.PI ? "end" : "start";
          })
          .attr("fill", "#000")
          .style("font-size",".8em")
          .text(function(d) { return d.data.language + " (" + d.data.count + ")"; });



    var html = window.document.innerHTML;

    // render the whole file
    fs.writeFileSync(__dirname + '/../public/index.html', html);
  }
});

