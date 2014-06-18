var empty = require('./empty.js');

var eventNames = [
  'CreateEvent',
  'CommentEvent',
  'IssuesEvent',
  'PullRequestEvent',
  'PushEvent',
]

var events = eventNames.map(function(eventName){
  return {type: eventName, total:0, day:empty.day(), week:empty.week()}
});

module.exports = events;
