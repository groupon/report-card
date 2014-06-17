var async = require('async');
var usage = require('./usage.js');
var repositories = require('./repositories.js');
var users = require('./users.js');
var osrc = require('./api.js');

module.exports = function(github, members, callback){
  var organization = github.org;

  async.map(members, osrc.fetch, function(error, results) {
    if (error) {
      return callback(error);
    }

    var data = {};

    data.connected_users = users.connectedUsers(results);
    data.similar_users = users.similarUsers(results);
    data.repositories = repositories.all(results);
    data.usage = usage.gather(results);
    data.name = organization.name;
    data.username = organization.username;
    data.avatar_url = organization.avatar_url;
    data.members = github.users;

    callback(null, data);
  });
};

