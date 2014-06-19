var _ = require('underscore');

module.exports = function(callback){
  return function(error, answers){
    if (error) return callback(error);

    var processedAnswers = _.map(answers, function(answer){
      answer.user_id = answer.owner.user_id;
      delete answer.owner;
      return answer;
    });


    var result = _.reduce(processedAnswers, function(memo, answer){
      _.each(answer.tags, function(tag){
        if(typeof memo[tag] === 'function'){
          console.log('Ignoring tag: ' + tag);
          return;
        }

        memo[tag] = memo[tag] || {
          scoreTotal: 0,
          acceptedCount: 0,
          answerTotal:0,
          users:{}
        };

        if (answer.is_accepted)
          memo[tag].acceptedCount++;

        memo[tag].scoreTotal += answer.score;
        memo[tag].answerTotal++;
        memo[tag].users[answer.user_id] = memo[tag].users[answer.user_id] || 0;
        memo[tag].users[answer.user_id] += answer.score;
      });

      return memo;
    }, {});

    var resultArray = [];
    _.each(result, function(value, key){
      value.tag = key;
      value.acceptedPercent = Math.round(100*(value.acceptedCount / value.answerTotal));
      resultArray.push(value);
    });

    callback(null, {
      total: answers.length,
      inTags: resultArray
    });
  };
};
