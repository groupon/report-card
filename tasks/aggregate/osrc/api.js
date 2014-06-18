var request = require('request');
var github = require('octonode');
var client = github.client(process.env.GROUPONTHECAT_TOKEN);

module.exports = {
  fetch: function(username, callback) {
    request.get('http://osrc.dfm.io/'+username+'.json', function(error, response) {
      var body = null;

      if (error) {
        console.log('Error hitting osrc.dfm.io: ' + error.message);
        console.log('Defaulting to local stub for ' + username);
        var fs = require('../fs-json.js');
        body = fs.read('data/stub/'+username+'.json');
      } else {
        body = response.body;
      }

      var json = JSON.parse(body);
      callback(null, json);
    });
  },

  fetchRepoInformation: function(repoName, callback) {
    ghrepo = client.repo(repoName);
    ghrepo.info(function(err, repoInfo) {
      if(err) {
        console.log("Repo Information Fetch failed for " + repoName + ". Status Code: " + err.statusCode + " Error Message: " + err.message)
        callback();
      }
      else {
        callback(null, repoInfo);
      }
    });
  }
}
