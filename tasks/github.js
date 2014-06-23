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
var fs = require('fs');
var _ = require('underscore');
var argv = require('minimist')(process.argv.slice(2));

var organization = function() {
  var org = argv["_"][0];
  if(!org){
    throw new Error("First arg must be an org name.")
  } else {
    console.log('Pulling users from the ' + org + ' organization on Github.')
  }
  return org;
}

var github = require('octonode');
var client = github.client(process.env.GROUPONTHECAT_TOKEN);
var org = client.org(organization());

var getUsers = function(callback){
  org.members(1, 300, function(error, members) {
    if (error) {
      return callback(error);
    }

    var users = [];

    _.each(members, function(member) {
      var user = {
        name: member.login,
        avatar_url: member.avatar_url
      };
      users.push(user);
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

var writeData = function(data){
  fs.writeFile(__dirname + "/../data/users.json", JSON.stringify(data, null, 2), function(error) {
    if (error) {
      console.log("Error writing users: " + err);
    } else {
      console.log("Saved users to users.json");
    }
  });
};

async.parallel([getUsers, getInfo], function(error, results){
  if(error) return console.error(error);

  var users = results[0];
  var info = results[1];

  var data = {
    users: users,
    org: info
  };

  writeData(data);
});
