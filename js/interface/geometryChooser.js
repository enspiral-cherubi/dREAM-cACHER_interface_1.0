THREE.geometryChooser = function (sentiment) {
  if (sentiment > 0.75) {
    var argument = Math.round((sentiment - 0.5))
    return new THREE.SphereGeometry(150, argument, argument);
  } else if (sentiment > 0.5) {
    return new THREE.OctahedronGeometry(150, 1)
  } else if (sentiment > 0) {
    return new THREE.TetrahedronGeometry(150, 1);
  } else if (sentiment > -0.5) {
    return new THREE.TorusKnotGeometry(37.67, getRandom(150,200), 4, 3, 7.52, 7.83, getRandom(4,20))
  } else if (sentiment > -0.75) {
    return new THREE.TorusKnotGeometry(37.67, 200, Math.round(getRandom(10,100)), 2, getRandom(4,20), getRandom(4,20), 5.25)
  } else {
    return new THREE.TorusKnotGeometry(37.67, 200, 59, 2, getRandom(4,20), getRandom(4,20), 1)
  }
}
