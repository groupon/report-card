var parseUsers = require('../../../tasks/generate-user-mapping/parse-users');
var assert = require('assertive');

describe('generate-user-mapping:parseUsers', function(){
  describe('errors', function(){
    it('throws an error if there are no tabs', function(){
      var csv = 'smassa smassa 106';
      var error = assert.throws(function(){
        parseUsers(csv);
      });
      assert.truthy(error);
    });
  });

  describe('parsing', function(){
    before(function(){
      var csv = 'smassa\tsmassa\t106\tendangeredmassa\tendangeredmassa\t\t\n'
        + 'trek-internal\ttrek-external\t1584375\ttrek\ttrek-lanyrd\ttrek-speaker\t';
      this.users = parseUsers(csv);
    });

    it('multiple users', function(){
      assert.equal(2, Object.keys(this.users).length);
    });

    it('keyed by github username', function(){
      assert.truthy(this.users['trek-external']);
    });

    it('missing fields are empty strings', function(){
      var user = this.users['smassa'];
      assert.equal('', user.speakerdeck);
    });

    it('all fields are strings', function(){
      var id = this.users['smassa'].stackexchange;
      assert.equal('106', id);
    });

    describe('extracts', function(){
      before(function(){
        this.user = this.users['trek-external'];
      });

      it('organization github', function(){
        assert.equal('trek-internal', this.user.organization);
      });

      it('public github', function(){
        assert.equal('trek-external', this.user.github);
      });

      it('stack overflow', function(){
        assert.equal('1584375', this.user.stackexchange);
      });

      it('twitter', function(){
        assert.equal('trek', this.user.twitter);
      });

      it('lanyrd', function(){
        assert.equal('trek-lanyrd', this.user.lanyrd);
      });

      it('speakerdeck', function(){
        assert.equal('trek-speaker', this.user.speakerdeck);
      });
    });
  });
});

