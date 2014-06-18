var _ = require('underscore');

module.exports = function(callback){
  return function(error, badges){
    if (error) return callback(error);

    var processedBadges = _.map(badges, function(badge){
      badge.user_id = badge.user.user_id;
      delete badge.user;
      return badge;
    });

    var result = _.reduce(processedBadges, function(result, badge){
      result[badge.name] = result[badge.name] || {total: 0, users:{}}
      result[badge.name].total += badge.award_count;
      result[badge.name].url = badge.link;
      result[badge.name].rank = badge.rank;
      result[badge.name].users[badge.user_id] = badge.award_count;
      return result;
    }, {});

    callback(null, result);
  };
};
