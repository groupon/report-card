var async = require('async');
var fs = require('fs');
var _ = require('underscore');
var github = require('octonode');
var client = github.client();
var org = client.org('groupon');

var getUsers = function(callback){
  org.members(function(error, members) {
    if (error) {
      return callback(error);
    }

    var users = [];

    _.each(members, function(member) {
      users.push(member["login"]);
    });

    callback(null, users);
  });
};

var getInfo = function(callback){
  org.info(function(error, info){
    if (error) {
      return callback(error);
    }

    var orgInfo = {
      name: info.name,
      username: info.login,
      avatar_url: info.avatar_url
    };

    callback(null, orgInfo);
  });
};

var writeData = function(data){
  fs.writeFile(__dirname + "/../data/users.json", JSON.stringify(data, null, 2), function(error) {
    if (error) {
      console.log("Error writing users: " + err);
    } else {
      console.log("Saved users to users.json");
    }
  });
};

async.parallel([getUsers, getInfo], function(error, results){
  var users = results[0];
  var info = results[1];

  var data = {
    users: users,
    org: info
  };

  writeData(data);
});

