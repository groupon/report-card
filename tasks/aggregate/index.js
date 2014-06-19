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

  data.answers = results.stackExchange.answers;

  if (results.stackExchange.badges.profiles.length > 0)
    data.badges = results.stackExchange.badges;
  if (results.lanyrd.length > 0)
    data.talks = results.lanyrd;

  pollGithub(data, function(error, data){
    if (error) throw error;

    fs.write('data/data.json', data);
    console.log('Wrote data/data.json!');
  });
});

