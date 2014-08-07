var fetch = require('../../../../tasks/aggregate/osrc');
var assert = require('assertive');

var nock = require('nock');
nock.disableNetConnect();

describe('aggregate:osrc', function(){
  before(function(done){
    nock('http://osrc.dfm.io')
      .get('/endangeredmassa.json')
      .reply(200, require('./fixture.json'));

    var github = {
      org: {
        name: 'Groupon',
        username: 'groupon',
        avatar_url: 'http://avatar.url'
      },
      users: [
        {name: 'someone'}
      ]
    };

    var context = this;
    fetch(github, ['endangeredmassa'], function(error, data){
      assert.falsey(error);

      context.data = data;
      done()
    })
  });

  describe('pulls osrc data', function(){
    before(function(){
      this.user = this.data;
    });

    it('connected users', function(){
      assert.equal(5, this.user.connected_users.length);
    });

    it('similar users', function(){
      assert.equal(5, this.user.similar_users.length);
    });

    it('repositories', function(){
      assert.equal(5, this.user.repositories.length);
    });

    it('usage', function(){
      assert.equal(2204, this.user.usage.total);
    });

    it('name', function(){
      assert.equal('Groupon', this.user.name);
    });

    it('username', function(){
      assert.equal('groupon', this.user.username);
    });

    it('avatar_url', function(){
      assert.equal('http://avatar.url', this.user.avatar_url);
    });

    it('members', function(){
      assert.equal('someone', this.user.members[0].name);
    });
  });
});

