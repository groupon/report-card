module.exports = function(language, number) {
  var languageToPersonMapping = {
    'JavaScript': 'JavaScripter',
    'CoffeeScript': 'CoffeeScripter',
    'Ruby': 'Rubyist',
    'Python': 'Pythonista',
    'C': 'C hacker',
    'CSS': 'CSS author',
  }

  person = languageToPersonMapping[language] || language + " Developer";

  if (number > 1) {
    person += 's';
  }

  return person;
};
