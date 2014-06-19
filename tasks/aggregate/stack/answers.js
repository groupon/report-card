var _ = require('underscore');

module.exports = function(callback){
  return function(error, answers){
    if (error) return callback(error);

    var processedAnswers = _.map(answers, function(answer){
      answer.user_id = answer.owner.user_id;
      delete answer.owner;
      return answer;
    });


    var result = _.reduce(processedAnswers, function(result, answer){
      _.each(answer.tags, function(tag){
        result[tag] = result[tag] || {
          scoreTotal: 0,
          acceptedCount: 0,
          answerTotal:0,
          users:{}
        }

        if (answer.is_accepted)
          result[tag].acceptedCount++;

        result[tag].scoreTotal += answer.score;
        result[tag].answerTotal++;
        result[tag].users[answer.user_id] = result[tag].users[answer.user_id] || 0;
        result[tag].users[answer.user_id] += answer.score;
      });

      return result;
    }, {});

    var resultArray = [];
    _.each(result, function(value, key){
      value.tag = key;
      value.acceptedPercent = Math.round(100*(value.acceptedCount / value.answerTotal));
      resultArray.push(value);
    });

    callback(null, resultArray);
  };
};
