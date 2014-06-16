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

