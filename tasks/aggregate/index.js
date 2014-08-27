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

var async = require('async');
var _ = require('underscore');

var pollOsrc = require('./osrc');
var pollGithub = require('./github');
var pollStackExchange = require('./stack');
var lanyrd = require('./lanyrd');

var fs = require('./fs-json.js');
var github = fs.read('data/users.json');

var members = github.users.map(function(user) {
  return user.name;
});

var sift = function(mapping, keys, finalKey){
  return _.compact(
    _.map(keys, function(key){
      var value = mapping[key.toLowerCase()]
      if(value)
        return value[finalKey];
      else
        return null;
  }));
};

var mapping = fs.read('data/user-map.json').mapping;

var stackUserIds = sift(mapping, members, 'stackexchange').join(';');
var lanyrdIds = sift(mapping, members, 'lanyrd');

var tasks = {
  stackExchange: _.partial(pollStackExchange, stackUserIds),
  osrc: _.partial(pollOsrc, github, members),
  lanyrd: _.partial(lanyrd.getSpeakerCounts, lanyrdIds)
};

async.parallel(tasks, function(error, results){
  if(error) throw error;

  var data = fs.read('data/data.json');

  if (results.osrc) {
    if (results.osrc.connected_users.length > 0)
      data.connected_users = results.osrc.connected_users;
    if (results.osrc.similar_users.length > 0)
      data.similar_users = results.osrc.similar_users;
    if (results.osrc.repositories.length > 0)
      data.repositories = results.osrc.repositories;
    if (results.osrc.members.length > 0)
      data.members = results.osrc.members;

    data.usage = results.osrc.usage;
    data.username = results.osrc.username;
    data.avatar_url = results.osrc.avatar_url;
  }

  if (results.stackExchange) {
    data.answers = results.stackExchange.answers;

    if (results.stackExchange.badges.profiles.length > 0)
      data.badges = results.stackExchange.badges;
  }

  if (results.lanyrd) {
    data.talks = results.lanyrd;
  }

  pollGithub(data, function(error, data){
    if (error) throw error;

    fs.write('data/data.json', data);
    console.log('Wrote data/data.json!');
  });
});

