var async = require('async');
var fs = require('fs');
var _ = require('underscore');
var request = require('request');

// TODO
var users = ['trek', 'endangeredmassa'];

var getOsrc = function(username, callback){
  request.get('http://osrc.dfm.io/'+username+'.json', function(error, response){
    if (error) {
      return callback(error);
    }
    var json = JSON.parse(response.body);
    callback(null, json);
  });
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

var aggregate = function(usersData) {
  var data = {
    connected_users: []
  };

  data.connected_users = presentConnectedUsers(usersData);

  return data;
};

async.map(users, getOsrc, function(error, results){
  if (error) {
    return console.log('Error when mapping OSRC: ' + error.stack);
  }

  var aggregateData = aggregate(results);
  fs.writeFileSync(__dirname + '/../data/data.json', JSON.stringify(aggregateData, null, 2));
});

