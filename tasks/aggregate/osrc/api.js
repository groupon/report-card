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
var github = require('octonode');
var config = require('config');
var client = github.client(config.github_token);

var parse = function(string){
  try {
    return JSON.parse(string);
  } catch(error) {
    console.error('Error parsing: ', string, error.stack);
  }
};

module.exports = {
  fetch: function(username, callback) {
    request.get('http://osrc.dfm.io/'+username+'.json', function(error, response) {
      var body = null;

      if (error) {
        console.error('Error hitting osrc.dfm.io: ' + error.message);
        console.error('Defaulting to local stub for ' + username);
        var fs = require('../fs-json.js');
        body = fs.read('data/stub/'+username+'.json');
      } else {
        body = response.body;
      }

      var json = parse(body);
      callback(null, json);
    });
  },

  fetchRepoInformation: function(repoName, callback) {
    ghrepo = client.repo(repoName);
    ghrepo.info(function(err, repoInfo) {
      if(err) {
        console.error("Repo Information Fetch failed for " + repoName + ". Status Code: " + err.statusCode + " Error Message: " + err.message)
        callback();
      }
      else {
        callback(null, repoInfo);
      }
    });
  }
}
