var request = require('request');
var zlib = require('zlib');
var concat = require('concat-stream');

var report = concat(function(response){
  console.log(response.toString());
});

var userIds = '106'; // can be semi-colon-delimited, up to 100 userIds
// Try It: http://api.stackexchange.com/docs/answers-on-users#order=desc&sort=creation&ids=106&filter=!bJDus)chijNCh3&site=stackoverflow&run=true
var filters = 'order=desc&sort=creation&site=stackoverflow&filter=!bJDus)chijNCh3';
var url = 'http://api.stackexchange.com/2.2/users/'+userIds+'/answers?'+filters;
request(url)
  .pipe(zlib.createGunzip())
  .pipe(report);

