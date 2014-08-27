var eventToName = require('../../../../tasks/render/helpers/event-to-name');
var assert = require('assertive');

describe("event-to-name helper", function(){
  it("removes 'Event' from a string", function(){
    var eventlessName = eventToName('EventHorizon');
    assert.equal('Horizon', eventlessName);
  });
});
