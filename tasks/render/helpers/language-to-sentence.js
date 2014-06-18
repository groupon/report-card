var colors = require('../../constants/language-colors');

function span(language){
  return "<span style='color:" + colors[language] + "'>"+ language +"</span>";
}

module.exports = function(languages) {
  return languages.slice(0,languages.length-1).map(function(l){
    return span(l.language);
  }).join(", ") + ", and " + span(languages[languages.length-1].language);
}
