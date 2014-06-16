var fs = require('fs');

module.exports = {
  read: function(projectRelativePath){
    var fullPath = __dirname + '/../' + projectRelativePath;
    return JSON.parse(fs.readFileSync(fullPath).toString());
  }
}
