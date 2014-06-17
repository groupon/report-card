var static = require('node-static');
var argv = require('minimist')(process.argv.slice(2));

var port = function() {
  var fromCli = argv["_"][0];
  if (fromCli < 1024 || fromCli == undefined) {
    return 8080;
  } else {
    return fromCli;
  }
}

var file = new static.Server('./public');

require('http').createServer(function (request, response) {
    request.addListener('end', function () {
        file.serve(request, response);
    }).resume();
}).listen(port());

console.log('Started server on localhost:' + port());
