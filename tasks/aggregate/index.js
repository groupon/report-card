var async = require('async');
var _ = require('underscore');

var pollOsrc = require('./osrc');
var pollStackExchange = require('./stack');
var lanyrd = require('./lanyrd');

var fs = require('./fs-json.js');
var github = fs.read('data/users.json');

var api = require('./osrc/api.js')

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

  var data = results.osrc;
  data.answers = results.stackExchange.answers;
  data.badges = results.stackExchange.badges;
  data.talks = results.lanyrd;

  var repositories = _.map(data.repositories, function(repo){
    return repo.repo;
  });

  var repoInfoFetchTasks = {};
  _.each(repositories, function(repoName) {
    repoInfoFetchTasks[repoName] = _.partial(api.fetchRepoInformation, repoName);
  });

  async.parallel(repoInfoFetchTasks, function(err, repoInfo) {
    if(error){
      console.log('There was an error aggregating the data.');
    }
    else {
      _.each(data.repositories, function(repo){
        specificRepoInfo = repoInfo[repo.repo];
        if (specificRepoInfo)
          repo.stargazersCount = specificRepoInfo.stargazers_count;
      });

      fs.write('data/data.json', data);
      console.log('Wrote data/data.json!');
    }
  });
});

