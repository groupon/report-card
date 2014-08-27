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
