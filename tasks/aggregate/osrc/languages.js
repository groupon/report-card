var _ = require('underscore');

/*
  For a single object in usersData see ./data/stub/*.json
  usersData would be array of those [trekObj, seanObj];
*/
module.exports = {
  all: function(usersData){
    var allLanguages = {},
        topLanguages = {};

    _.each(usersData, function(userData){
      var userLanguages = userData.usage.languages;

      _.each(userLanguages, function(userLanguage){

        var userLanguageDatum = {
          username: userData.username,
          percent: userLanguage.quantile
        };

        // find or initialize a data structure
        allLanguages[userLanguage.language] = allLanguages[userLanguage.language] || {
          language: userLanguage.language,
          count: 0,
          who: []
        };

        // add this user's data to the aggregation
        allLanguages[userLanguage.language].count += userLanguage.count;
        allLanguages[userLanguage.language].who.push(userLanguageDatum);

        // we want to highlight our big players
        if (userLanguage.quantile < 25) {
          // find or initialize a data structure
          topLanguages[userLanguage.language] = topLanguages[userLanguage.language] || {
            language: userLanguage.language,
            count: 0,
            who: []
          };
          topLanguages[userLanguage.language].count += userLanguage.count;
          topLanguages[userLanguage.language].who.push(userLanguageDatum);
        }
      });
    });

    return {allLanguages: _.values(allLanguages), topLanguages: _.values(topLanguages)};
  }
}
