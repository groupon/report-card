var async = require('async');
var _ = require('underscore');
var stack = require('./api.js');

module.exports = function(userIds, callback){
  var answers = _.partial(stack.getAnswers, userIds)
  var badges = _.partial(stack.getBadges, userIds)
  async.parallel({answers: answers, badges: badges}, callback);
};

