var assetHost = [null, "1", "2" ,"3"], assetHostIndex = 0;
module.exports = function(username, size){
  size = size || 30;
  var avartUrl = "https://avatars"+ (assetHost[assetHostIndex] || '') +".githubusercontent.com/"+username+"?size="+size;

  if (assetHostIndex >= 3) {
    assetHostIndex = 0;
  } else {
    assetHostIndex++;
  }

  return avartUrl;
};