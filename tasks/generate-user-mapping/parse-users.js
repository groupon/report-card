module.exports = function(csvString){
  var lines = csvString.trim().split('\n');

  var userMapping = {};

  lines.forEach(function(line){
    if(line.indexOf('\t') === -1){
      throw new Error('Invalid CSV Format: must use tabs.');
    }

    var cells = line.split('\t');

    var organization = cells[0];
    var github = cells[1];
    var stack = cells[2];
    var twitter = cells[3];
    var lanyrd = cells[4];
    var speakerdeck = cells[5];
    var booksWritten = cells[6];

    userMapping[github] = {
      organization: organization,
      github: github,
      stackexchange: stack,
      twitter: twitter,
      lanyrd: lanyrd,
      speakerdeck: speakerdeck,
      booksWritten: booksWritten
    };
  });

  return userMapping;
};

