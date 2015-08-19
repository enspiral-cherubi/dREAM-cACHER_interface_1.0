function Environment (opts) {
  this.timer = null,
  this.onRenderFunctions = [],
  this.scene = new THREE.Scene(),
  this.camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight, 0.1,30000),
  this.camera.position.z = 1500,
  this.renderer = new THREE.WebGLRenderer({ antialias : true }),
  this.renderer.setSize(window.innerWidth, window.innerHeight),
  this.projector = new THREE.Projector()
}

Environment.prototype.appendScene = function () {
  $(document.body).append(renderer.domElement);
}

// User interaction
Environment.prototype.addListeners = function () {
  window.addEventListener( 'mousedown', this.openDream, false );
  window.addEventListener( 'resize', this.onWindowResize, false );
}

Environment.prototype.openDream = function () {
  var vector = new THREE.Vector3()
  var raycaster = new THREE.Raycaster()
  vector.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1, 0.5 ) // z = 0.5 important!
  vector.unproject( camera )
  raycaster.set( camera.position, vector.sub( camera.position ).normalize() )
  var intersects = raycaster.intersectObjects( catCubes )
  if (intersects.length > 0) {
    var intersection = intersects[ 0 ],
    obj = intersection.object
    var url = obj['userData']['url']
    window.location.replace(url)
  }
}

Environment.prototype.render = function () {
  var time = Date.now()/1000 // increments 1/second
  requestAnimationFrame(this.render)
  this.onRenderFunctions.forEach(function (onRenderFunction) {
    onRenderFunction(time)
  })
  this.renderer.render(this.scene, this.camera)
}


var environment = new Environment()

var logfuck = function() {
  console.log('fuck')
}

environment.onRenderFunctions.push(logfuck)

geometry = new THREE.TorusKnotGeometry(104.53, 128.25, 64, 2, 1.61, 15, 1);
material = new THREE.MeshNormalMaterial({shading: THREE.FlatShading});
mesh = new THREE.Mesh(geometry, material);
environment.scene.add(mesh);

environment.render()














