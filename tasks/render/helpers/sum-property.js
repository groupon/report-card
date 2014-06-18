module.exports = function(events, property) {
  var totals = events.map(function(e) { return e[property]; });

  return totals.reduce(function(previousValue, currentValue) {
    return previousValue + currentValue;
  }, 0);
};
