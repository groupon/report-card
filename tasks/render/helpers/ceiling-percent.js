module.exports = function(users){
  var percents = users.map(function(u){return u.percent});
  return Math.max.apply(Math, percents);
};
