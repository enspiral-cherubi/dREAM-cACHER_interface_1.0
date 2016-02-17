var THREE = require('three')
var random = require('lodash.random')
var normalize = require('vectors/normalize')(3)
var range = require('lodash.range')

module.exports = function (i) {
  return {
    position: getPosition(i),
    rotation: new THREE.Euler(random(2 * Math.PI), random(2 * Math.PI), random(2 * Math.PI)),
    scale: new THREE.Vector3(0.05, 0.05, 0.05)
  }
}

function getPosition (i) {
  var coords;
  if (i === 0) {
    coords = [0,0,0]
  } else {
    coords = getRandNormCoords().map(function (c) { return c * Math.log(i + 1) * 90 })
  }
  return new THREE.Vector3(coords[0], coords[1], coords[2])
}

function getRandNormCoords () {
  var randCoords = range(3).map(function () { return random(-1,1, true) })
  return normalize(randCoords)
}
