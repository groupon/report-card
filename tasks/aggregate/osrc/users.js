/*
Copyright (c) 2014, Groupon, Inc.
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions
are met:

Redistributions of source code must retain the above copyright notice,
this list of conditions and the following disclaimer.

Redistributions in binary form must reproduce the above copyright
notice, this list of conditions and the following disclaimer in the
documentation and/or other materials provided with the distribution.

Neither the name of GROUPON nor the names of its contributors may be
used to endorse or promote products derived from this software without
specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS
IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED
TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A
PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

var _ = require('underscore');

module.exports = {
  similarUsers: function(usersData, grouponUsers) {
    var similarUsers = [];
    var grouponUserNames = _.map(grouponUsers, function(user) {
      return user.name;
    });

    _.each(usersData, function(userData){
      _.each(userData.similar_users, function(similarUser){
        var foundUser = _.find(similarUsers, function(user){
          return user.name == similarUser.name;
        });

        if(!(foundUser || (_.contains(grouponUserNames, similarUser.username)))) {
            similarUsers.push(similarUser);
        }

        var targetUser = foundUser || similarUser;
        targetUser.who = targetUser.who || [];
        targetUser.who.push(userData.username);
      });
    });

    return similarUsers;
  },

  connectedUsers: function(usersData){
    var connected_users = [];

    _.each(usersData, function(userData){
      _.each(userData.connected_users, function(connectedUser){
        var foundConnectedUser = _.find(connected_users, function(user){
          return user.name == connectedUser.name;
        });

        if (!foundConnectedUser) {
          connected_users.push(connectedUser);
        }

        var targetConnectedUser = foundConnectedUser || connectedUser;
        targetConnectedUser.who = targetConnectedUser.who || [];
        targetConnectedUser.who.push(userData.username);
      });
    });

    return connected_users;
  }
}
