var avatar = require('../../../../tasks/render/helpers/avatar');
var assert = require('assertive');

// this test is brittle becuase of the state inside avatar :(
describe("avatar helper", function(){
  it("returns a github user avatar url", function(){
    var url = avatar('trek', 32);
    assert.equal(url, "https://avatars.githubusercontent.com/trek?size=32");
  });

  it("cycles through asset hosts", function(){
    var url1 = avatar('trek', 32);
    var url2 = avatar('trek', 32);
    var url3 = avatar('trek', 32);

    assert.equal(url1, "https://avatars1.githubusercontent.com/trek?size=32");
    assert.equal(url2, "https://avatars2.githubusercontent.com/trek?size=32");
    assert.equal(url3, "https://avatars3.githubusercontent.com/trek?size=32");
  });
});
