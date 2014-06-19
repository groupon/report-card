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
