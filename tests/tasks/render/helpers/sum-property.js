var sumProperty = require('../../../../tasks/render/helpers/sum-property');
var assert = require('assertive');

describe("sum-property helper", function(){
  it("sums the values of a key across properties", function(){
    total = sumProperty([{count: 10}, {count: 22}], 'count');
    assert.equal(total, 32);
  })
});
