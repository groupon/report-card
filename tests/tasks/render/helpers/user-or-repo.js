var userOrRepo = require('../../../../tasks/render/helpers/user-or-repo');
var assert = require('assertive');

describe("user-or-repo helper", function(){
  it("pulls the first slug off a user/repo", function(){
    assert.equal('trek', userOrRepo('trek/javascript-is-awful'));
  });

  it("pulls the returns the repo", function(){
    assert.equal('javascript-is-awful', userOrRepo('javascript-is-awful'));
  });
});
