var fs = require('fs');

module.exports = {
  read: function(projectRelativePath){
    var fullPath = __dirname + '/../../' + projectRelativePath;
    return JSON.parse(fs.readFileSync(fullPath).toString());
  },
  write: function(projectRelativePath, data){
    var fullPath = __dirname + '/../../' + projectRelativePath;
    fs.writeFileSync(fullPath, JSON.stringify(data, null, 2));
  }
}
