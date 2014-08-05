var getSpeakerCounts = require('../../../../tasks/aggregate/lanyrd').getSpeakerCounts;
var assert = require('assertive');

var nock = require('nock');
nock.disableNetConnect();

var fs = require('fs');
var fixture = fs.readFileSync(__dirname+'/fixture.html');

describe('aggregate:lanyrd', function(){
  beforeEach(function(done){
    nock('http://lanyrd.com')
      .get('/profile/tundal45')
      .reply(200, fixture);

    var context = this;
    getSpeakerCounts(['tundal45'], function(error, data){
      context.error = error;
      context.data = data;
      done()
    })
  });

  it('does not error', function(){
    assert.falsey(this.error);
  });

  it('grabs speaker count', function(){
    assert.equal('3', this.data['tundal45']);
  });
});

