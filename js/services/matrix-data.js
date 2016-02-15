function defineMatrixData (i) {
  // sets the position for each mesh
  var position = definePosition(i)

  // sets the rotation for each mesh
  var rotation = defineRotation()

  // sets the scale for each mesh
  var scale = defineScale()

  return {
    position: position,
    rotation: rotation,
    scale: scale
  }
}

function definePosition (i) {
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

function defineRotation () {
  var rotation = new THREE.Euler();
  rotation.x = Math.random() * 2 * Math.PI;
  rotation.y = Math.random() * 2 * Math.PI;
  rotation.z = Math.random() * 2 * Math.PI;
  return rotation
}

function defineScale () {
  var scale = new THREE.Vector3();
  scale.x =  0.05;
  scale.y =  0.05;
  scale.z =  0.05;
  return scale
}

