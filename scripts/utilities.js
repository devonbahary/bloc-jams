/*
  bloc-jams
    scripts
      utilities.js
*/

function forEach (pointsArray, callback) {
  for (var i = 0; i < pointsArray.length; i++) {
    callback(i);
  }
}
