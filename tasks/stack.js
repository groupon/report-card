var request = require('request');
var zlib = require('zlib');
var concat = require('concat-stream');
var _ = require('underscore');

var stackRequest = function(path, callback){
  var report = concat(function(response){
    callback(null, JSON.parse(response.toString()).items);
  });

  var url = 'http://api.stackexchange.com/2.2' + path;
  request(url)
    .pipe(zlib.createGunzip())
    .pipe(report);
};

var getAnswers = function(userIds, callback){
  // Try It: http://api.stackexchange.com/docs/answers-on-users#order=desc&sort=creation&ids=106&filter=!bJDus)chijNCh3&site=stackoverflow&run=true
  var filters = 'order=desc&sort=creation&site=stackoverflow&filter=!bJDus)chijNCh3';
  var path = '/users/'+userIds+'/answers?'+filters;
  stackRequest(path, function(error, answers){
    if (error) return callback(error);

    var processedAnswers = _.map(answers, function(answer){
      answer.user_id = answer.owner.user_id;
      delete answer.owner;
      return answer;
    });

    callback(null, processedAnswers);
  });
};

var getBadges = function(userIds, callback){
  var now = new Date;
  var yearAgo = new Date(now.setFullYear(now.getFullYear() - 1));
  var yearAgoMs = Math.round(yearAgo.getTime() / 1000);

  // Try It: http://api.stackexchange.com/docs/badges-on-users#fromdate=2013-06-02&order=desc&sort=rank&ids=106&filter=!9b2JK-v*G&site=stackoverflow
  var filters = 'fromdate='+yearAgoMs+'&order=desc&sort=rank&site=stackoverflow&filter=!9b2JK-v*G';
  var path = '/users/'+userIds+'/badges?'+filters;
  stackRequest(path, function(error, badges){
    if (error) return callback(error);

    var processedBadges = _.map(badges, function(badge){
      badge.user_id = badge.user.user_id;
      delete badge.user;
      return badge;
    });

    callback(null, processedBadges);
  });
};

var userIds = '106'; // can be semi-colon-delimited, up to 100 userIds

getAnswers(userIds, function(error, answers){
  console.log('Answers: ', answers);
});

getBadges(userIds, function(error, badges){
  console.log('Badges: ', badges);
});

