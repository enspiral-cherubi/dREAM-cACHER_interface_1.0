function SingleDreamGeometry(opts) {
  this.geometry = THREE.geometryChooser(opts.sentiment)
  this.matrix = this.createMatrix(opts.i)
}

SingleDreamGeometry.prototype.createMatrix = function(i) {
  var quaternion = new THREE.Quaternion();
  var matrix = new THREE.Matrix4();

  var normCoords = getRandomCoords()

  // sets the position for each mesh
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

  // sets the rotation for each mesh
  var rotation = new THREE.Euler();
  rotation.x = Math.random() * 2 * Math.PI;
  rotation.y = Math.random() * 2 * Math.PI;
  rotation.z = Math.random() * 2 * Math.PI;

  // sets the scale for each mesh
  var scale = new THREE.Vector3();
  scale.x =  0.05;
  scale.y =  0.05;
  scale.z =  0.05;

  quaternion.setFromEuler( rotation, false );

  // the matrix has the position, scale, and rotation of the object
  matrix.compose( position, quaternion, scale );

  this.data = {
    position : position,
    rotation : rotation,
    scale : scale
  }

  return matrix
};