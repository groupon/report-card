var async = require('async');
var fs = require('fs');
var _ = require('underscore');
var request = require('request');

var read = function(projectRelativePath){
  var fullPath = __dirname + '/../' + projectRelativePath;
  return JSON.parse(fs.readFileSync(fullPath).toString());
};

// TODO
var users = ['trek', 'endangeredmassa'];

var getOsrc = function(username, callback){
  request.get('http://osrc.dfm.io/'+username+'.json', function(error, response){
    var body = null;

    if (error) {
      console.log('Error hitting osrc.dfm.io: ' + error.message);
      console.log('Defaulting to local stub for ' + username);
      body = read('data/stub/'+username+'.json');
    } else {
      body = response.body;
    }

    var json = JSON.parse(body);
    callback(null, json);
  });
};

var presentSimilarUsers = function(usersData){
  var similarUsers = [];

  _.each(usersData, function(userData){
    _.each(userData.similar_users, function(similarUser){
      var foundUser = _.find(similarUser, function(user){
        return user.name == similarUser.name;
      });

      if (!foundUser) {
        similarUsers.push(similarUser);
      }

      var targetUser = foundUser || similarUser;
      targetUser.who = targetUser.who || [];
      targetUser.who.push(userData.username);
    });
  });

  return similarUsers;
};

var presentConnectedUsers = function(usersData){
  var connected_users = [];

  _.each(usersData, function(userData){
    _.each(userData.connected_users, function(connectedUser){
      var foundConnectedUser = _.find(connected_users, function(user){
        return user.name == connectedUser.name;
      });

      if (!foundConnectedUser) {
        connected_users.push(connectedUser);
      }

      var targetConnectedUser = foundConnectedUser || connectedUser;
      targetConnectedUser.who = targetConnectedUser.who || [];
      targetConnectedUser.who.push(userData.username);
    });
  });

  return connected_users;
};

var presentRepositories = function(usersData){
  var repositories = [];

  _.each(usersData, function(userData){
    _.each(userData.repositories, function(repo){
      var foundRepo = _.find(repositories, function(currentRepo){
        return currentRepo.repo == repo.repo;
      });

      if (!foundRepo) {
        repositories.push(repo);
      }

      var targetRepo = foundRepo || repo;
      targetRepo.count = targetRepo.count || 0;
      targetRepo.count += repo.count;
      targetRepo.activeUsers = targetRepo.activeUsers || [];
      targetRepo.activeUsers.push(userData.username);
    });
  });

  return repositories;
};



var addArrays = function(source, add){
  for(var i=0; i<source.length; i++) {
    source[i] += add[i] || 0;
  }
};

var presentUsage = function(usersData) {
  var emptyDay = function(){
    return [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
  };
  var emptyWeek = function(){
    return [0,0,0,0,0,0,0];
  };

  var usage = {
    day: emptyDay(),
    week: emptyWeek(),
    events: [
      {type: "PushEvent", total:0, day:emptyDay(), week:emptyWeek()},
      {type: "IssueCommentEvent", total:0, day:emptyDay(), week:emptyWeek()},
      {type: "IssuesEvent", total:0, day:emptyDay(), week:emptyWeek()},
      {type: "PullRequestEvent", total:0, day:emptyDay(), week:emptyWeek()},
      {type: "CreateEvent", total:0, day:emptyDay(), week:emptyWeek()},
      {type: "DeleteEvent", total:0, day:emptyDay(), week:emptyWeek()},
    ],
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

      foundEvent.total += event.total;
      addArrays(foundEvent.day, event.day)
      addArrays(foundEvent.week, event.week)
    });
  });

  return usage;
};

var aggregate = function(usersData) {
  var data = {
    connected_users: []
  };

  data.connected_users = presentConnectedUsers(usersData);
  data.similar_users = presentSimilarUsers(usersData);
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

async.map(users, getOsrc, function(error, results){
  if (error) {
    return console.log('Error when mapping OSRC: ' + error.stack);
  }

  var aggregateData = aggregate(results);
  var finalData = addOrgData(aggregateData);
  fs.writeFileSync(__dirname + '/../data/data.json', JSON.stringify(aggregateData, null, 2));
  console.log('Wrote data/data.json!');
});

