var fetch = require('../../../../tasks/aggregate/stack');
var assert = require('assertive');
var fs = require('fs');

var nock = require('nock');
nock.disableNetConnect();

var load = function(path){
  var buffer = fs.readFileSync(__dirname+'/'+path);
  var result = [];
  for(var i=0; i<buffer.length; i++) {
    result.push(buffer[i]);
  }
  return result;
};

// TODO: Get gzip encoding in responses to work
xdescribe('aggregate:stack', function(){
  beforeEach(function(done){
    nock('http://api.stackexchange.com')
      .get('/2.2/users/106?order=desc&sort=reputation&page=1&pagesize=100&site=stackoverflow&filter=!Ln3laVm*nneRQDAXXp0nfS')
      .reply(200, load('user.gzip'), {
        'content-encoding': 'gzip'
      });

    nock('http://api.stackexchange.com')
      .get('/2.2/users/106/answers?page=1&pagesize=100&site=stackoverflow&filter=!bJDus)chijNCh3')
      .reply(200, load('answers1.gzip'), {
        'content-encoding': 'gzip'
      });
    nock('http://api.stackexchange.com')
      .get('/2.2/users/106/answers?page=2&pagesize=100&site=stackoverflow&filter=!bJDus)chijNCh3')
      .reply(200, load('answers2.gzip'), {
        'content-encoding': 'gzip'
      });
    nock('http://api.stackexchange.com')
      .get('/2.2/users/106/answers?page=3&pagesize=100&site=stackoverflow&filter=!bJDus)chijNCh3')
      .reply(200, load('answers3.gzip'), {
        'content-encoding': 'gzip'
      });

    var context = this;
    fetch([106], function(error, data){
      data = data || {};
      context.error = error;
      context.answers = data.answers;
      context.badges = data.badges;
      done()
    })
  });

  it('works', function(){
    assert.falsey(this.error);
  });
});

