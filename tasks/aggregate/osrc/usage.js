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
var events = require('./events.js');
var empty = require('./empty.js');
var languages = require('./languages.js');

var addArrays = function(source, add){
  for(var i=0; i<source.length; i++) {
    source[i] += add[i] || 0;
  }
};

module.exports = {
  gather: function(usersData) {
    var usage = {
      day: empty.day(),
      week: empty.week(),
      events: events,
      languages: [],
      total: 0
    };

    _.each(usersData, function(userData){
      var userUsage = userData.usage;
      usage.total += userUsage.total;
      addArrays(usage.day, userUsage.day);
      addArrays(usage.week, userUsage.week);

      _.each(userData.usage.events, function(event){
        if(event.type === "IssueCommentEvent" || event.type === "CommitCommentEvent" || event.type === "PullRequestReviewCommentEvent")
          event.type = "CommentEvent"

        var foundEvent = _.find(usage.events, function(currentEvent){
          return currentEvent.type == event.type;
        });

        if(foundEvent) {
          foundEvent.total += event.total;
          addArrays(foundEvent.day, event.day);
          addArrays(foundEvent.week, event.week);
        }
      });
    });

    var langaugeStatistics = languages.all(usersData);
    usage.allLanguages = langaugeStatistics.allLanguages;
    usage.topLanguages = langaugeStatistics.topLanguages

    return usage;
  }
}
