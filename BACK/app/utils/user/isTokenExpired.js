const isTokenExpired = function (exp){

    const currentTime = Math.floor(Date.now() / 1000); // Get current time in seconds
  return exp < currentTime;

}

module.exports = isTokenExpired;