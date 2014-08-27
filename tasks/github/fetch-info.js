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
var config = require('config');
var organization = config.organization.name;
var github = require('octonode');
var client = github.client(config.github_token);
var org = client.org(organization);

var getUsers = function(callback){
  var currentPage = 1;
  var countPerPage = 300;

  org.members(currentPage, countPerPage, function(error, members) {
    if (error) {
      return callback(error);
    }

    var users = members.map(function(member) {
      return {
        name: member.login,
        avatar_url: member.avatar_url
      };
    });

    callback(null, users);
  });
};

var getInfo = function(callback){
  org.info(function(error, info){
    if (error) {
      return callback(error);
    }

    var orgInfo = {
      name: info.name,
      username: info.login,
      avatar_url: info.avatar_url
    };

    callback(null, orgInfo);
  });
};


module.exports = function(callback){
  async.parallel([getUsers, getInfo], function(error, results){
    if(error) return callback(error);

    var users = results[0];
    var info = results[1];

    var data = {
      users: users,
      org: info
    };

    callback(null, data);
  });
};

