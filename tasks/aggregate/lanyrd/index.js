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

var cheerio = require('cheerio');
var request = require('request');
var async = require('async');
var _  = require('underscore');

var BASE_URL = 'http://lanyrd.com';

var monthNameToInt = {
  'January':   '01',
  'February':  '02',
  'March':     '03',
  'April':     '04',
  'May':       '05',
  'June':      '06',
  'July':      '07',
  'August':    '08',
  'September': '09',
  'October':   '10',
  'November':  '11',
  'December':  '12'
};

var parseDate = function(raw){
  try {

    if (raw.indexOf(' to ')>-1){
      var toParts = raw.split(' to ');
      var year = toParts[1].split(' ')[2]
      raw = toParts[0] + ' ' + year;
    }

    var dateParts = raw.split(' ');

    var day = dateParts[0];
    var dayParts = day.split('-');
    day = parseInt(dayParts[0], 10);

    var month = dateParts[1];
    month = monthNameToInt[month];

    var year = dateParts[2];

    return year + '-' + month + '-' + day;
  } catch(error) {
    console.error(error.stack);
    return null;
  }
};

var getEvents = function(path, username, callback){
  var url = BASE_URL+'/profile/'+username+path;
  request(url, function(error, response, body){
    if(error) return callback(error);

    var events = [];
    var $ = cheerio.load(body);

    $('.conference-listing li').each(function(index, item){
      var $item = $(item);
      var rawDate = $item.find('.date').text();
      var date = parseDate(rawDate);
      var title = $item.find('h4').text();
      var eventPath = $item.find('h4 a').attr('href');
      var eventUrl = BASE_URL + eventPath;

      events.push({
        title: title,
        date: date,
        eventUrl: eventUrl
      });
    });

    callback(null, events);
  });
};

var getFutureEvents = function(usernames, callback){
  var getFuture = _.partial(getEvents, '/future/speaking');
  async.map(usernames, getFuture, callback);
};

var getPastEvents = function(usernames, callback){
  var getPast = _.partial(getEvents, '/past/speaking');
  async.map(usernames, getPast, callback);
};

var getSpeakerCount = function(username, callback){
  var url = BASE_URL+'/profile/'+username;
  request(url, function(error, response, body){
    if(error) return callback(error);

    var $ = cheerio.load(body);

    var targetPath = '/profile/'+username+'/past/speaking/';
    var speakerCount = $('.number-feature a[href="'+targetPath+'"] strong').text();

    var result = {
      username: username,
      speakerCount: speakerCount
    };
    callback(null, result);
  });
};

var getSpeakerCounts = function(usernames, callback){
  async.map(usernames, getSpeakerCount, function(error, results){
    if(error) return callback(error);

    var counts = _.reduce(results, function(reduced, result){
      reduced[result.username] = result.speakerCount;
      return reduced;
    }, {});

    callback(null, counts);
  });
};

module.exports = {
  getFutureEvents: getFutureEvents,
  getPastEvents: getPastEvents,
  getSpeakerCounts: getSpeakerCounts
};

