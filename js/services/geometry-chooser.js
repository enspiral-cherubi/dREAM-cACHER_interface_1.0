var THREE = require('three')
var random = require('lodash.random')

function geometryChooser (sentiment) {
  if (sentiment > 0.75) {
    var argument = Math.round((sentiment - 0.5))
    return new THREE.SphereGeometry(150, argument, argument);
  } else if (sentiment > 0.5) {
    return new THREE.OctahedronGeometry(150, 1)
  } else if (sentiment > 0) {
    return new THREE.TetrahedronGeometry(150, 1);
  } else if (sentiment > -0.5) {
    return new THREE.TorusKnotGeometry(37.67, random(150,200, true), 4, 3, 7.52, 7.83, random(4,20, true))
  } else if (sentiment > -0.75) {
    return new THREE.TorusKnotGeometry(37.67, 200, Math.round(random(10,100, true)), 2, random(4,20, true), random(4,20, true), 5.25)
  } else {
    return new THREE.TorusKnotGeometry(37.67, 200, 59, 2, random(4,20, true), random(4,20, true), 1)
  }
}

module.exports = geometryChooser
