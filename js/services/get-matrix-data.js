var getRandom = require('./get-random')
var THREE = require('three')

function getMatrixData (i) {
  // sets the position for each mesh
  var position = getPosition(i)

  // sets the rotation for each mesh
  var rotation = getRotation()

  // sets the scale for each mesh
  var scale = getScale()

  return {
    position: position,
    rotation: rotation,
    scale: scale
  }
}

function getPosition (i) {
  var normCoords = getRandomCoords()
  var position = new THREE.Vector3();
  if ( i === 0) {
    position.x = 0
    position.y = 0
    position.z = 0
  } else {
    position.x = normCoords[0] * Math.log(i + 1) * 90
    position.y = normCoords[1] * Math.log(i + 1) * 90
    position.z = normCoords[2] * Math.log(i + 1) * 90
  }
  return position
}

function getRotation () {
  var rotation = new THREE.Euler();
  rotation.x = Math.random() * 2 * Math.PI;
  rotation.y = Math.random() * 2 * Math.PI;
  rotation.z = Math.random() * 2 * Math.PI;
  return rotation
}

function getScale () {
  var scale = new THREE.Vector3();
  scale.x =  0.05;
  scale.y =  0.05;
  scale.z =  0.05;
  return scale
}

// Pick a random point inside the [-1,1]x[-1,1]x[-1,1] cube
// If x*x + y*y + z*z < 1, keep coords
// Normalize dividing x, y and z by Math.sqrt(x*x + y*y + z*z)

function getXYZ () {
  var coords = []
  for (var i = 0; i < 3; i++) {
    coords.push(getRandom(-1,1))
  }
  return coords
}

function isSuitableCoords (coords) {
  return (coords[0]*coords[0] + coords[1]*coords[1] + coords[2]*coords[2]) < 1
}

function normalizedCoordsFrom (coords) {
  var denominator = Math.sqrt(coords[0]*coords[0] + coords[1]*coords[1] + coords[2]*coords[2])
  var normCoords = coords.map(function (coord) {
    return coord / denominator
  })
  return normCoords
}

function getRandomCoords () {
  var normCoords, coords, coordsFound = false

  while (coordsFound === false) {
    coords = getXYZ()
    if (isSuitableCoords(coords)) {
      coordsFound = true
      normCoords = normalizedCoordsFrom(coords)
    }
  }

  return normCoords
}

module.exports = getMatrixData
