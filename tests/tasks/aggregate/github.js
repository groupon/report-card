var fetch = require('../../../tasks/aggregate/github');
var assert = require('assertive');

var nock = require('nock');
nock.disableNetConnect();

describe('aggregate:github', function(){
  beforeEach(function(done){
    nock('https://api.github.com')
      .filteringPath(/access_token=[^&]*/g, 'access_token=XXX')
      .get('/repos/emberjs/ember.js?access_token=XXX')
      .reply(200, {stargazers_count: 1000});

    nock('https://api.github.com')
      .filteringPath(/access_token=[^&]*/g, 'access_token=XXX')
      .get('/repos/groupon-testium/testium?access_token=XXX')
      .reply(200, {stargazers_count: 200});

    var data = {
      repositories: [
        {repo: 'emberjs/ember.js'},
        {repo: 'groupon-testium/testium'}
      ]
    };

    var context = this;
    fetch(data, function(error, data){
      assert.falsey(error);

      context.data = data;
      done()
    })
  });

  it('fetches stargazer count', function(){
    assert.equal(1000, this.data.repositories[0].stargazersCount);
  });
});

