var async = require('async');
var fs = require('fs');

var osrc = require('./osrc.js');
var users = require('./users.js');
var repositories = require('./repositories.js');
var languages = require('./languages.js');
var usage = require('./usage.js');
var utils = require('./utils.js');

var github = utils.read('data/users.json');
var organization = github.org;
var members = github.users.map(function(user) {
  return user.name;
});

async.map(members, osrc.fetch, function(error, results) {
  if (error) {
    return console.log('Error when mapping OSRC: ' + error.stack);
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

  fs.writeFileSync(__dirname + '/../data/data.json', JSON.stringify(data, null, 2));
  console.log('Wrote data/data.json!');
});
