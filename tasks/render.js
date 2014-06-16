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


data.usage.languages = data.usage.languages.sort(function(a, b) {
  if (a.count > b.count)
    return -1;
  if (a.count < b.count)
    return 1;
  return 0;
});

data.usage.events = data.usage.events.sort(function(a, b) {
  if (a.total > b.total)
    return -1;
  if (a.total < b.total)
    return 1;
  return 0;
});

data.topLanguage = data.usage.languages[0].language;
data.topActivity = EVENT_TYPE_TO_ACTION_PHRASE[data.usage.events[0].type];
data.secondTopActivity = EVENT_TYPE_TO_ACTION_PHRASE[data.usage.events[1].type];

var html = render(data);

fs.writeFileSync(__dirname + '/../public/index.html', html);

