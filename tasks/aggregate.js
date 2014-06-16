var async = require('async');
var fs = require('fs');
var _ = require('underscore');
var request = require('request');

var events = require('./events.js');
var empty = require('./empty.js');
var osrc = require('./osrc.js');
var users = require('./users.js');

var read = function(projectRelativePath){
  var fullPath = __dirname + '/../' + projectRelativePath;
  return JSON.parse(fs.readFileSync(fullPath).toString());
};

var addArrays = function(source, add){
  for(var i=0; i<source.length; i++) {
    source[i] += add[i] || 0;
  }
};

var members = read('data/users.json').users.map(function(user) {
  return user.name;
});

var presentRepositories = function(usersData){
  var repositories = [];

  _.each(usersData, function(userData){
    _.each(userData.repositories, function(repo){
      var foundRepo = _.find(repositories, function(currentRepo){
        return currentRepo.repo == repo.repo;
      });

      if (!foundRepo) {
        repositories.push(repo);
      } else {
        foundRepo.count = foundRepo.count || 0;
        foundRepo.count += repo.count;
      }

      var targetRepo = foundRepo || repo;
      targetRepo.activeUsers = targetRepo.activeUsers || [];
      targetRepo.activeUsers.push(userData.username);
    });
  });

  return repositories;
};


var presentLanguages = function(usersData){
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
};

var presentUsage = function(usersData) {
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

  usage.languages = presentLanguages(usersData);

  return usage;
};

var aggregate = function(usersData) {
  var data = {
    connected_users: []
  };

  data.connected_users = users.connectedUsers(usersData);
  data.similar_users = users.similarUsers(usersData);
  data.repositories = presentRepositories(usersData);
  data.usage = presentUsage(usersData);

  return data;
};

var addOrgData = function(data){
  var usersData = read('data/users.json');
  data.name = usersData.org.name;
  data.username = usersData.org.username;
  data.avatar_url = usersData.org.avatar_url;
  data.members = usersData.users;
};

async.map(members, osrc.fetch, function(error, results){
  if (error) {
    return console.log('Error when mapping OSRC: ' + error.stack);
  }

  var aggregateData = aggregate(results);
  var finalData = addOrgData(aggregateData);
  fs.writeFileSync(__dirname + '/../data/data.json', JSON.stringify(aggregateData, null, 2));
  console.log('Wrote data/data.json!');
});
