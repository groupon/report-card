var _ = require('underscore');

module.exports = function(callback){
  return function(error, profiles){
    if (error) return callback(error);

    var badgeCount = 0;

    var results = _.map(profiles, function(profile){
      var profileBadgeCount = profile.badge_counts.gold
        + profile.badge_counts.silver
        + profile.badge_counts.bronze;

      badgeCount += profileBadgeCount;

      return {
        profileImage: profile.profile_image,
        userId: profile.user_id,
        name: profile.display_name,
        badge_counts: profile.badge_counts,
        badgeCount: profileBadgeCount
      };
    });

    callback(null, {
      badgeCount: badgeCount,
      profiles: results
    });
  };
};
