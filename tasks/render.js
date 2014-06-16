var Handlebars = require('handlebars');
var fs = require('fs');

var template = fs.readFileSync(__dirname + '/../templates/index.hbs').toString();
var render = Handlebars.compile(template);


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
  return type.replace("Event", "");
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
debugger;
console.log(data.languages);
var html = render(data);

fs.writeFileSync(__dirname + '/../public/index.html', html);

