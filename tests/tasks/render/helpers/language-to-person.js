var languageToPerson = require('../../../../tasks/render/helpers/language-to-person');
var assert = require('assertive');

describe("language-to-person helper", function(){
  it("JavaScript -> JavaScripter", function(){
    assert.equal('JavaScripter', languageToPerson('JavaScript'));
  });
  it('CoffeeScript -> CoffeeScripter', function(){
    assert.equal('CoffeeScripter', languageToPerson('CoffeeScript'));
  });
  it('Ruby -> Rubyist', function(){
    assert.equal('Rubyist', languageToPerson('Ruby'));
  });
  it('Python -> Pythonista', function(){
    assert.equal('Pythonista', languageToPerson('Python'));
  });
  it('C -> C hacker', function(){
    assert.equal('C hacker', languageToPerson('C'));
  });
  it('CSS -> CSS author', function(){
    assert.equal('CSS author', languageToPerson('CSS'));
  });
  it('SomeOtherLang -> SomeOtherLang Developer', function(){
    assert.equal('SomeOtherLang Developer', languageToPerson('SomeOtherLang'));
  })
});
