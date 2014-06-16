var fs = require('fs');
var _ = require('underscore');
var github = require('octonode');
var client = github.client();
var org = client.org('groupon');

var writeUsers = function(error, members) {
  var data = [];

  if (error) {
    console.log("Error: " + error);
    return;
  }

  _.each(members, function(member) {
    data.push(member["login"]);
  });

  fs.writeFile(__dirname + "/../data/users.json", JSON.stringify(data, null, 2), function(error) {
    if (error) {
      console.log("Error writing users: " + err);
    } else {
      console.log("Saved users to users.json");
    }
  });
}

org.members(writeUsers);
