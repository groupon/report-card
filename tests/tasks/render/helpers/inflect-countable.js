var inflectCount = require('../../../../tasks/render/helpers/inflect-countable');
var assert = require('assertive');

describe("event-to-name helper", function(){
  it("returns 'one' for 1", function(){
    var count = inflectCount(1);
    assert.equal('one', count);
  });

  it("returns 'some' for everything that's not 1", function(){
    var count = inflectCount(12);
    assert.equal('some', count);
  });
});
