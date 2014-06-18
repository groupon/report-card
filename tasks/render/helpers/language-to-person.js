module.exports = function(language, number) {
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
};
