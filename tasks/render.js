var Handlebars = require('handlebars');
var fs = require('fs');
function helper(name){
 return require('./render/helpers/'+ name);
}


var template = fs.readFileSync(__dirname + '/../templates/index.hbs').toString();
var repoTemplate = fs.readFileSync(__dirname + '/../templates/github-repo-card.hbs').toString();
Handlebars.registerPartial('github-repo-card', repoTemplate);
Handlebars.registerHelper('languagesToSentence', helper('language-to-sentence'));
Handlebars.registerHelper('avatar', helper('avatar'));
Handlebars.registerHelper('ceilingPercent', helper('ceiling-percent'));
Handlebars.registerHelper('inflectCountable', helper('inflect-countable'));
Handlebars.registerHelper('sumProperty', helper('sum-property'));
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

function rsortByLength(propertyName){
  return function(a,b){
    if(a[propertyName].length > b[propertyName].length)
      return -1;
    if(a[propertyName].length < b[propertyName].length)
      return 1;
    return 0;
  }
}

function compact (argument) {
  // body...
}

data.usage.topLanguages = data.usage.topLanguages.sort(rsortBy('count'));
data.usage.allLanguages = data.usage.allLanguages.sort(rsortBy('count'));
data.usage.events = data.usage.events.sort(rsortBy('total'));
data.repositories = data.repositories.sort(rsortBy('stargazersCount'));
data.similar_users = data.similar_users.sort(rsortByLength('who'));

data.topRepositories = data.repositories.filter(function(repo) {
  org = repo.repo.split('/')[0];
  return ((org === 'groupon' && repo.stargazersCount > 0) || repo.stargazersCount >= 20);
});

data.topLanguage = data.usage.allLanguages[0].language;
data.mostUsedLanguages = data.usage.allLanguages.slice(0,4);
data.topActivity = EVENT_TYPE_TO_ACTION_PHRASE[data.usage.events[0].type];
data.secondTopActivity = EVENT_TYPE_TO_ACTION_PHRASE[data.usage.events[1].type];

data.topTags = data.answers.inTags.sort(rsortBy('scoreTotal')).slice(0,20);
data.tagCount = data.answers.inTags.length;
data.answerCount = data.answers.total;

data.badgeCount = data.badges.badgeCount;
data.topBadgesEarners = data.badges.profiles.sort(rsortBy('badgeCount')).slice(0, 12);

// remove lanyrders who didn't give talks, turn it into an array
var _talks = data.talks;
data.talks = [];
Object.keys(_talks).forEach(function(speakerName){
  if (_talks[speakerName]) {
    data.talks.push({username: speakerName, count: parseInt(_talks[speakerName], 10)});
  };
});
data.talks = data.talks.sort(rsortBy('count'));

var html = render(data);

// apply charts!
var jsdom = require('jsdom');

jsdom.env({
  features: { QuerySelector : true },
  html: html,
  done : function(errors, window) {
    var charts = require('./render/pie-chart');

    charts.language(window.document.querySelector('#d3-language-diagram-outlet'), data.usage.allLanguages);
    charts.activity(window.document.querySelector('#d3-activity-diagram-outlet'), data.usage.events);

    var html = window.document.innerHTML;

    // render the whole file
    fs.writeFileSync(__dirname + '/../public/index.html', html);
  }
});

