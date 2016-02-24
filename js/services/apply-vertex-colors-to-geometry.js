var THREE = require('three')

module.exports = function (geometry, color) {
  geometry.faces.forEach(function (face) {
    var n = (face instanceof THREE.Face3) ? 3 : 4;
    for (var j = 0; j < n; j++) {
      face.vertexColors[j] = color;
    }
  })
}
