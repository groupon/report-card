var fs = require('fs');
var github = require('octonode');
var client = github.client();
var org = client.org('groupon');

function writeUsers(err, members) {
    var data = [];

    if (err) {
	console.log("Error: " + err);
	return;
    }

    for (var i = 0; i < members.length; i++) {
	data.push(members[i]["login"]);
    }

    fs.writeFile("users.json", JSON.stringify(data, null, 2), function(err) {
	if (err) {
	    console.log("Error writing users: " + err);
	} else {
	    console.log("Saved users to users.json");
	}
    });
}

org.members(writeUsers);
