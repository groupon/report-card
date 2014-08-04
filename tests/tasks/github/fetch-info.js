var fetch = require('../../../tasks/github/fetch-info');
var assert = require('assertive');

var nock = require('nock');
nock.disableNetConnect();

describe('github fetch', function(){
  beforeEach(function(done){
    nock('https://api.github.com')
      .get('/orgs/Groupon')
      .reply(200, require('../../../data/stub/org-info.json'));

    nock('https://api.github.com')
      .get('/orgs/Groupon/members?page=1&per_page=300')
      .reply(200, require('../../../data/stub/org-members.json'));

    var context = this;
    fetch(function(error, data){
      context.error = error;
      context.data = data;
      done()
    })
  });

  describe('info has proper shape', function(){
    it('name', function(){
      assert.equal('Groupon', this.data.org.name)
    });

    it('username', function(){
      assert.equal('groupon', this.data.org.username)
    });

    it('avatar url', function(){
      assert.equal('https://avatars.githubusercontent.com/u/206233?v=2', this.data.org.avatar_url)
    });
  });

  describe('members have proper shape', function(){
    before(function(){
      this.member = this.data.users[0];
    });

    it('name', function(){
      assert.equal('abedra', this.member.name);
    });

    it('avatar url', function(){
      assert.equal('https://avatars.githubusercontent.com/u/2090?v=2', this.member.avatar_url);
    });
  });
});

