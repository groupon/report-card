var async = require('async');
var _ = require('underscore');
var stack = require('./api.js');

var mapUsersToStack = function(users){
  // can be semi-colon-delimited, up to 100 userIds
  return '106';
};

module.exports = function(members, callback){
  var userIds = mapUsersToStack(members);
  var answers = _.partial(stack.getAnswers, userIds)
  var badges = _.partial(stack.getBadges, userIds)
  async.parallel({answers: answers, badges: badges}, callback);
};

