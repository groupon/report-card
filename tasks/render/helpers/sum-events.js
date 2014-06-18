module.exports = function(events) {
  var totals = events.map(function(e) { return e.total; });

  return totals.reduce(function(previousValue, currentValue) {
    return previousValue + currentValue;
  }, 0);
};
