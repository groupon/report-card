var colors = require('../../constants/language-colors');

function span(language){
  return "<span style='color:" + colors[language] + "'>"+ language +"</span>";
}

module.exports = function(languages) {
  debugger;
  return languages.slice(0,3).map(function(l){
    return span(l.language);
  }).join(", ") + ", and " + span(languages[4].language);
}
