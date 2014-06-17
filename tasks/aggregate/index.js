var async = require('async');
var _ = require('underscore');

var pollOsrc = require('./osrc');
var pollStackExchange = require('./stack');

var fs = require('./fs-json.js');
var github = fs.read('data/users.json');

var members = github.users.map(function(user) {
  return user.name;
});

var tasks = {
  stackExchange: _.partial(pollStackExchange, members),
  osrc: _.partial(pollOsrc, github, members)
};

async.parallel(tasks, function(error, results){
  if(error) throw error;

  var data = results.osrc;
  data.answers = results.stackExchange.answers;
  data.badges = results.stackExchange.badges;

  fs.write('data/data.json', data);
  console.log('Wrote data/data.json!');
});

