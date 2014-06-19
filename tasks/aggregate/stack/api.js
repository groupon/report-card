var request = require('request');
var _ = require('underscore');
var zlib = require('zlib');
var concat = require('concat-stream');

var processAnswers = require('./answers');
var processBadges = require('./badges');

var serializeQuerystring = function(qs){
  var result = '';
  _.each(qs, function(value, key){
    if(result)
      result += '&';

    result += key + '=' + value;
  });
  return result;
};

var stackRequest = function(path, qs, items, callback){
  var fullPath = path + '?' + serializeQuerystring(qs);

  var report = concat(function(response){
    var response = JSON.parse(response.toString());
    if (response.has_more) {
      qs.page++;
      items = items.concat(response.items);
      return stackRequest(path, qs, items, callback);
    }
    callback(null, items);
  });

  var url = 'http://api.stackexchange.com/2.2' + fullPath;
  request(url)
    .pipe(zlib.createGunzip())
    .pipe(report);
};

var getAnswers = function(userIds, callback){
  // Try It: http://api.stackexchange.com/docs/answers-on-users#order=desc&sort=creation&ids=105&filter=!bJDus)chijNCh3&site=stackoverflow&run=true
  var path = '/users/'+userIds+'/answers'
  var qs = {
    order:'desc',
    sort:'creation',
    page: 1,
    pagesize: 100,
    site: 'stackoverflow',
    filter: '!bJDus)chijNCh3'
  };
  stackRequest(path, qs, [], processAnswers(callback));
};

var getBadges = function(userIds, callback){
  /*
  var now = new Date;
  var yearAgo = new Date(now.setFullYear(now.getFullYear() - 1));
  var yearAgoMs = Math.round(yearAgo.getTime() / 1000);
  // 'fromdate='+yearAgoMs
  */

  // Try It: http://api.stackexchange.com/docs/users-by-ids#order=desc&sort=reputation&ids=106%3B999&filter=!Ln3laVm*nneRQDAXXp0nfS&site=stackoverflow
  var path = '/users/'+userIds+'/badges';
  var qs = {
    order:'desc',
    sort:'reputation',
    page: 1,
    pagesize: 100,
    site: 'stackoverflow',
    filter: '!Ln3laVm*nneRQDAXXp0nfS'
  };
  stackRequest(path, qs, [], processBadges(callback));
};

module.exports = {
  getAnswers: getAnswers,
  getBadges: getBadges
};

