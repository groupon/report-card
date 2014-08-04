var async = require('async');
var config = require('config');
var organization = config.organization.name;
var github = require('octonode');
var client = github.client(config.github_token);
var org = client.org(organization);

var getUsers = function(callback){
  var currentPage = 1;
  var countPerPage = 300;

  org.members(currentPage, countPerPage, function(error, members) {
    if (error) {
      return callback(error);
    }

    var users = members.map(function(member) {
      return {
        name: member.login,
        avatar_url: member.avatar_url
      };
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


module.exports = function(callback){
  async.parallel([getUsers, getInfo], function(error, results){
    if(error) return callback(error);

    var users = results[0];
    var info = results[1];

    var data = {
      users: users,
      org: info
    };

    callback(null, data);
  });
};

