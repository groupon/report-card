var _ = require('underscore');
var events = require('./events.js');
var empty = require('./empty.js');
var languages = require('./languages.js');

var addArrays = function(source, add){
  for(var i=0; i<source.length; i++) {
    source[i] += add[i] || 0;
  }
};

module.exports = {
  gather: function(usersData) {
    var usage = {
      day: empty.day(),
      week: empty.week(),
      events: events,
      languages: [],
      total: 0
    };

    _.each(usersData, function(userData){
      var userUsage = userData.usage;
      usage.total += userUsage.total;
      addArrays(usage.day, userUsage.day);
      addArrays(usage.week, userUsage.week);

      _.each(userData.usage.events, function(event){
        var foundEvent = _.find(usage.events, function(currentEvent){
          return currentEvent.type == event.type;
        });

        if(!foundEvent) {
          throw new Error('Could not find event: ' + event.type);
        }

        foundEvent.total += event.total;
        addArrays(foundEvent.day, event.day)
        addArrays(foundEvent.week, event.week)
      });
    });

    var langaugeStatistics = languages.all(usersData);
    usage.allLanguages = langaugeStatistics.allLanguages;
    usage.topLanguages = langaugeStatistics.topLanguages

    return usage;
  }
}
