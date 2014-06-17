var async = require('async');
var _ = require('underscore');

var fs = require('./fs-json.js');
var osrc = require('./osrc.js');
var users = require('./users.js');
var repositories = require('./repositories.js');
var languages = require('./languages.js');
var usage = require('./usage.js');

var github = fs.read('data/users.json');

var pollOsrc = function(members, callback){
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





var stack = require('./stack.js');
var mapUsersToStack = function(users){
  // can be semi-colon-delimited, up to 100 userIds
  return '106';
};

var pollStackExchange = function(members, callback){
  var userIds = mapUsersToStack(members);
  var answers = _.partial(stack.getAnswers, userIds)
  var badges = _.partial(stack.getBadges, userIds)
  async.parallel({answers: answers, badges: badges}, callback);
};




var members = github.users.map(function(user) {
  return user.name;
});

var tasks = {
  stackExchange: _.partial(pollStackExchange, members),
  osrc: _.partial(pollOsrc, members)
};

async.parallel(tasks, function(error, results){
  if(error) throw error;

  var data = results.osrc;
  data.answers = results.stackExchange.answers;
  data.badges = results.stackExchange.badges;

  fs.write('data/data.json', data);
  console.log('Wrote data/data.json!');
});

