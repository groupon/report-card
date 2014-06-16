var Handlebars = require('handlebars');
var fs = require('fs');

var template = fs.readFileSync(__dirname + '/../templates/index.hbs').toString();
var render = Handlebars.compile(template);

Handlebars.registerHelper('languageToPerson', function(language, number) {
  var languageToPersonMapping = {
    'JavaScript': 'JavaScripter',
    'CoffeeScript': 'CoffeeScripter',
    'Ruby': 'Rubyist',
    'Python': 'Pythonista'
  }

  person = languageToPersonMapping[language]
  if(number > 1) {
    person += 's';
  }

  return person;
});

var data = JSON.parse(fs.readFileSync(__dirname + '/../data/stub/example-data.json').toString());
debugger;
console.log(data.languages);
var html = render(data);

fs.writeFileSync(__dirname + '/../public/index.html', html);

