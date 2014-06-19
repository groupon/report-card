var _ = require('underscore');
var async = require('async');
var api = require('./osrc/api.js')

module.exports = function(data, callback){
  var repositories = _.map(data.repositories, function(repo){
    return repo.repo;
  });

  var repoInfoFetchTasks = {};
  _.each(repositories, function(repoName) {
    repoInfoFetchTasks[repoName] = _.partial(api.fetchRepoInformation, repoName);
  });

  async.parallel(repoInfoFetchTasks, function(error, repoInfo) {
    if (error)
      return callback(error);

    _.each(data.repositories, function(repo){
      specificRepoInfo = repoInfo[repo.repo];
      if (specificRepoInfo)
        repo.stargazersCount = specificRepoInfo.stargazers_count;
    });

    callback(null, data);
  });
};

