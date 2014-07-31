/*
Copyright (c) 2014, Groupon, Inc.
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions
are met:

Redistributions of source code must retain the above copyright notice,
this list of conditions and the following disclaimer.

Redistributions in binary form must reproduce the above copyright
notice, this list of conditions and the following disclaimer in the
documentation and/or other materials provided with the distribution.

Neither the name of GROUPON nor the names of its contributors may be
used to endorse or promote products derived from this software without
specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS
IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED
TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A
PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

var request = require('request');
var _ = require('underscore');
var zlib = require('zlib');
var concat = require('concat-stream');
var config = require('config')

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
    var response = JSON.parse(response.toString().trim());
    if (response.error_message) {
      console.log('Stack Exchange Request Error: ', response.error_message);
    }

    items = items.concat(response.items);

    if (response.has_more) {
      qs.page++;
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
    page: 1,
    pagesize: 100,
    site: 'stackoverflow',
    filter: config.stack_overflow.answers_filter
  };
  stackRequest(path, qs, [], processAnswers(callback));
};

var getBadges = function(userIds, callback){
  // Try It: http://api.stackexchange.com/docs/users-by-ids#order=desc&sort=reputation&ids=106%3B999&filter=!Ln3laVm*nneRQDAXXp0nfS&site=stackoverflow
  // /users/106%3B999?order=desc&sort=reputation&site=stackoverflow&filter=!Ln3laVm*nneRQDAXXp0nfS
  var path = '/users/'+userIds;
  var qs = {
    order: 'desc',
    sort: 'reputation',
    page: 1,
    pagesize: 100,
    site: 'stackoverflow',
    filter: config.stack_overflow.badges_filter
  };
  stackRequest(path, qs, [], processBadges(callback));
};

module.exports = {
  getAnswers: getAnswers,
  getBadges: getBadges
};

