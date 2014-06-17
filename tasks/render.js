var Handlebars = require('handlebars');
var fs = require('fs');

var template = fs.readFileSync(__dirname + '/../templates/index.hbs').toString();
var render = Handlebars.compile(template);

var EVENT_TYPE_TO_ACTION_PHRASE = {
  "PushEvent": "pushing code",
  "CommitCommentEvent": "commenting on pull requests",
  "CreateEvent": "creating repos",
  "DeleteEvent": "removing repos",
  "FollowEvent": "following others",
  "ForkEvent": "forking repos",
  "GistEvent": "creating/updating gists",
  "GollumEvent": "creating/updating wiki docs",
  "IssueCommentEvent": "commenting on issues",
  "IssuesEvent": "responding to issues",
  "PageBuildEvent": "building github pages",
  "PullRequestEvent": "opening pull requests",
  "PullRequestReviewCommentEvent": "commenting on pull requests",
  "ReleaseEvent": "making releases",
  "WatchEvent": "watching repos"
}

Handlebars.registerHelper('top5Languages', function(languages){
  return languages.slice(0,3).map(function(l){ return l.language}).join(", ") + ", and " + languages[4].language;
});

Handlebars.registerHelper('avatar', function(username, size){
  size = size || 30;
  return "https://avatars.githubusercontent.com/"+username+"?size="+size;
});

Handlebars.registerHelper('ceilingPercent', function(users){
  var percents = users.map(function(u){return u.percent});
  return Math.max.apply(Math, percents);
});

Handlebars.registerHelper('inflectCountable', function(n){
  return n > 1 ? "some" : "one";
});

Handlebars.registerHelper('sumEvents', function(events) {
  var totals = events.map(function(e) { return e.total; });

  return totals.reduce(function(previousValue, currentValue) {
    return previousValue + currentValue;
  }, 0);
});

Handlebars.registerHelper('eventTypeToName', function(type) {
  type = type.replace("Event", "");
  type = type.replace("IssueComment", "Issue Comment");
  type = type.replace("CommitComment", "Commit Comment");
  return type;
});

Handlebars.registerHelper('languageToPerson', function(language, number) {
  var languageToPersonMapping = {
    'JavaScript': 'JavaScripter',
    'CoffeeScript': 'CoffeeScripter',
    'Ruby': 'Rubyist',
    'Python': 'Pythonista',
    'C': 'C programmer',
    'CSS': 'CSS author'
  }

  person = languageToPersonMapping[language];

  if (number > 1) {
    person += 's';
  }

  return person;
});

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
    jsdom = require('jsdom');

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

    var color = d3.scale.ordinal()
        .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

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
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var g = svg.selectAll(".arc")
            .data(pie(languages))
            .enter().append("g")
            .attr("class", "arc");

    g.append("path")
          .attr("d", arc)
          .style("fill", function(d) { return color(d.data.count); });

    g.append("text")
          .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
          .attr("dy", ".35em")
          .style("text-anchor", "middle")
          .text(function(d) { return d.data.language + " " + d.data.count; });

    var html = window.document.innerHTML;

    // render the whole file
    fs.writeFileSync(__dirname + '/../public/index.html', html);
  }
});


