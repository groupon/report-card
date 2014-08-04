var ceil = require('../../../../tasks/render/helpers/ceiling-percent');
var assert = require('assertive');

describe("ceiling-percent helper", function(){
  it("returns the ceiling value for the `percent` propery of an array of literal", function(){
    var ceilingValue = ceil([{percent: 10}, {percent: 20}, {percent: 21}]);
    assert.equal(21, ceilingValue);
  });
});
