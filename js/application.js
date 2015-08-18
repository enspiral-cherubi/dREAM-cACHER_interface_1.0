function Environment (opts) {
  this.timer = null
  this.scene = new THREE.Scene()
  this.camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight, 1,10000);
  this.camera.position.z = 1500;
  this.renderer = new THREE.WebGLRenderer();
  this.renderer.setSize(window.innerWidth, window.innerHeight);
  this.projector = new THREE.Projector()

  this.appendScene = function () {
    $(document.body).append(renderer.domElement);
  }

  // User interaction
  this.addListeners = function () {
    window.addEventListener( 'mousedown', this.openDream, false );
    window.addEventListener( 'resize', this.onWindowResize, false );
  }

  this.openDream = function () {
    var vector = new THREE.Vector3();
    var raycaster = new THREE.Raycaster();
    vector.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1, 0.5 ); // z = 0.5 important!
    vector.unproject( camera );
    raycaster.set( camera.position, vector.sub( camera.position ).normalize() );
    var intersects = raycaster.intersectObjects( catCubes );
    if (intersects.length > 0) {
      var intersection = intersects[ 0 ],
      obj = intersection.object;
      var url = obj['userData']['url']
      window.location.replace(url)
    };
  }



}

for (var i = 0; i < amountObjects; i++) {

  var geometry = new THREE.CylinderGeometry(front, back, length, verticies1, verticies2, false);
  var material = new THREE.MeshNormalMaterial({shading: THREE.FlatShading, wireframe: wfBoolean, wireframeLinewidth: 1});
  mesh = new THREE.Mesh(geometry, material);




};



render();






