var _ = require('underscore');

module.exports = {
  all: function(usersData){
    var repositories = [];

    _.each(usersData, function(userData){
      _.each(userData.repositories, function(repo){
        var foundRepo = _.find(repositories, function(currentRepo){
          return currentRepo.repo == repo.repo;
        });

        if (!foundRepo) {
          repositories.push(repo);
        } else {
          foundRepo.count = foundRepo.count || 0;
          foundRepo.count += repo.count;
        }

        var targetRepo = foundRepo || repo;
        targetRepo.activeUsers = targetRepo.activeUsers || [];
        targetRepo.activeUsers.push(userData.username);
      });
    });

    return repositories;
  }
}
