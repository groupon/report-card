module.exports = function(username, size){
  size = size || 30;
  return "https://avatars.githubusercontent.com/"+username+"?size="+size;
}
