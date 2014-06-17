var fs = require('fs');
var argv = require('minimist')(process.argv.slice(2));
var rawUserCsvPath = argv._[0];

var csv = fs.readFileSync(rawUserCsvPath).toString();

var lines = csv.split('\n');

var userMapping = {};

lines.forEach(function(line){
  var cells = line.split('\t');

  var groupon = cells[0];
  var github = cells[1];
  var stack = cells[2];
  var lanyrd = cells[3];
  var speakerdeck = cells[4];

  userMapping[github] = {
    groupon: groupon,
    stackexchange: stack,
    lanyrd: lanyrd,
    speakerdeck: speakerdeck
  };
});

var writePath = __dirname + '/../data/user-map.json'
var writeData = {
  mapping: userMapping
}
fs.writeFileSync(writePath, JSON.stringify(writeData, null, 2));

