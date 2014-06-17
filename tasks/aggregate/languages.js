var _ = require('underscore');

module.exports = {
  all: function(usersData){
    var languages = [];

    _.each(usersData, function(userData){
      var userLanguages = userData.usage.languages;

      _.each(userLanguages, function(userLanguage){
        if (userLanguage.quantile > 25) {
          return;
        }

        var foundLanguage = _.find(languages, function(currentLanguage){
          return currentLanguage.language == userLanguage.language;
        });

        if (!foundLanguage) {
          foundLanguage = {
            count: userLanguage.count,
            language: userLanguage.language,
            top25percent: []
          }
          languages.push(foundLanguage);
        } else {
          foundLanguage.count += userLanguage.count;
        }

        foundLanguage.top25percent.push({
          username: userData.username,
          percent: userLanguage.quantile
        });
      });
    });

    return languages;
  }
}
