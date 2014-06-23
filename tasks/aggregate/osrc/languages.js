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

/*
  For a single object in usersData see ./data/stub/*.json
  usersData would be array of those [trekObj, seanObj];
*/
module.exports = {
  all: function(usersData){
    var allLanguages = {},
        topLanguages = {};

    _.each(usersData, function(userData){
      var userLanguages = userData.usage.languages;

      _.each(userLanguages, function(userLanguage){

        var userLanguageDatum = {
          username: userData.username,
          percent: userLanguage.quantile
        };

        // find or initialize a data structure
        allLanguages[userLanguage.language] = allLanguages[userLanguage.language] || {
          language: userLanguage.language,
          count: 0,
          who: []
        };

        // add this user's data to the aggregation
        allLanguages[userLanguage.language].count += userLanguage.count;
        allLanguages[userLanguage.language].who.push(userLanguageDatum);

        // we want to highlight our big players
        if (userLanguage.quantile < 25) {
          // find or initialize a data structure
          topLanguages[userLanguage.language] = topLanguages[userLanguage.language] || {
            language: userLanguage.language,
            count: 0,
            who: []
          };
          topLanguages[userLanguage.language].count += userLanguage.count;
          topLanguages[userLanguage.language].who.push(userLanguageDatum);
        }
      });
    });

    return {allLanguages: _.values(allLanguages), topLanguages: _.values(topLanguages)};
  }
}
