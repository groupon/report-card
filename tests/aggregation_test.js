var assert = require("assert");
var fs = require('fs');
var similarUsers = require("../tasks/aggregate/osrc/users").similarUsers;


var trek, sean;

describe('similar users', function(){
  before(function(){
    trek = {
      "username": "trek",
      "similar_users": [
        {
          "name": "Charlike Mike Reagent",
          "username": "tunnckocore"
        }
      ]
    }


    sean = {
      "username": "sean",
      "similar_users": [
        {
          "name": "Charlike Mike Reagent",
          "username": "tunnckocore"
        }
      ]
    }
  });

  it('de-dups users', function(){
    var similar = similarUsers([trek, sean]);
    assert.equal(similar.length, 1);
  })
})
