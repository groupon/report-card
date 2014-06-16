var request = require('request');

module.exports = {
  fetch: function(username, callback) {
    request.get('http://osrc.dfm.io/'+username+'.json', function(error, response) {
      var body = null;

      if (error) {
        console.log('Error hitting osrc.dfm.io: ' + error.message);
        console.log('Defaulting to local stub for ' + username);
        body = read('data/stub/'+username+'.json');
      } else {
        body = response.body;
      }

      var json = JSON.parse(body);
      callback(null, json);
    });
  }
}
