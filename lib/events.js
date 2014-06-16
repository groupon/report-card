var empty = require('./empty.js');

var eventNames = [
  'CommitCommentEvent',
  'CreateEvent',
  'DeleteEvent',
  'DeploymentEvent',
  'DeploymentStatusEvent',
  'DownloadEvent',
  'FollowEvent',
  'ForkEvent',
  'ForkApplyEvent',
  'GistEvent',
  'GollumEvent',
  'IssueCommentEvent',
  'IssuesEvent',
  'MemberEvent',
  'PageBuildEvent',
  'PublicEvent',
  'PullRequestEvent',
  'PullRequestReviewCommentEvent',
  'PushEvent',
  'ReleaseEvent',
  'StatusEvent',
  'TeamAddEvent',
  'WatchEvent'
]

var events = eventNames.map(function(eventName){
  return {type: eventName, total:0, day:empty.day(), week:empty.week()}
});

module.exports = events;
