var THREE = require('three')
var NoiseShaderMaterial = require('three-noise-shader-material')(THREE)
var WindowResize = require('three-window-resize')
require('three-fly-controls')(THREE)

var environment = {
  objectUnderMouse: null,
  pickingData: [],
  objects: [],
  onRenderFcts: [],
  mouse: new THREE.Vector2(),
  offset: new THREE.Vector3(10, 10, 10),
  container: document.getElementById('container'),
  defaultMaterial: NoiseShaderMaterial(),
  camera: new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 1, 20000),
  scene: new THREE.Scene(),
  renderer: new THREE.WebGLRenderer({ antialias: true})
}

// init fxns

environment.initializeFlyControls = function () {
  this.controls = new THREE.FlyControls(this.camera)
  this.controls.movementSpeed = 1;
  this.controls.domElement = this.container;
  this.controls.rollSpeed = Math.PI / 1600;
  this.controls.autoForward = false;
  this.controls.dragToLook = false;
}

environment.initializeRenderer = function () {
  this.renderer.setClearColor(0xffffff)
  this.renderer.setPixelRatio(window.devicePixelRatio)
  this.renderer.setSize(window.innerWidth, window.innerHeight)
  this.container.appendChild(this.renderer.domElement)

  this.onMouseMove = function( e ) {
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;
  }
  this.renderer.domElement.addEventListener('mousemove', this.onMouseMove.bind(this));
}

environment.initializeWindowResize = function () {
  this.windowResize = new WindowResize(this.renderer, this.camera)
}

environment.initializePickingScene = function () {
  this.pickingScene = new THREE.Scene();
  this.pickingTexture = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight );
  this.pickingTexture.minFilter = THREE.LinearFilter;
  this.pickingTexture.generateMipmaps = false;
  this.pickingMaterial = new THREE.MeshBasicMaterial( { vertexColors: THREE.VertexColors } )
}

// update fxns

environment.updateMarbleTexture = function (delta, now) {
  this.defaultMaterial.uniforms[ "offset" ].value.x += delta / 1
}

environment.updateControls = function (delta, now) {
  this.controls.update(delta)
}

environment.updatePickingScene = function () {
  //render the picking scene off-screen
  this.renderer.render( this.pickingScene, this.camera, this.pickingTexture );

  //create buffer for reading single pixel
  var pixelBuffer = new Uint8Array( 4 );

  //read the pixel under the mouse from the texture
  this.renderer.readRenderTargetPixels(this.pickingTexture, this.mouse.x, this.pickingTexture.height - this.mouse.y, 1, 1, pixelBuffer);

  //interpret the pixel as an ID
  var id = ( pixelBuffer[0] << 16 ) | ( pixelBuffer[1] << 8 ) | ( pixelBuffer[2] );
  var data = this.pickingData[ id ];

  this.objectUnderMouse = null
  if ( data) {
    //move our highlightSphere so that it surrounds the picked object
    if ( data.position && data.rotation && data.scale ){
      this.highlightSphere.position.copy( data.position )
      this.highlightSphere.rotation.copy( data.rotation )
      this.highlightSphere.scale.copy( data.scale ).add( this.offset )
      this.highlightSphere.visible = true
      this.objectUnderMouse = id
    }
  } else {
    if (this.highlightSphere) { this.highlightSphere.visible = false; }
  }
}

// utilities

environment.resetCameraPosition = function () {
  this.camera.position.set( 0, 0, 300 );
  this.camera.lookAt( this.scene.position )
}

environment.clearScene = function () {
  if (this.dreamsMesh) {
    this.removeObjectFromScene(this.dreamsMesh)
    this.dreamsMesh = null

    this.removeObjectFromPickingScene(this.pickingMesh)
    this.pickingMesh = null
  }
}


environment.addObjectsToScene = function (objects) {
  _.forEach(objects, environment.addObjectToScene)
}

environment.addObjectToScene = function (object) {
  if (object.mesh) {
    environment.scene.add(object.mesh)
  } else {
    environment.scene.add(object)
  }
}

environment.removeObjectFromScene = function (object) {
  if (object.mesh) {
    environment.scene.remove( object.mesh )
  } else {
    environment.scene.remove( object )
  }
}

environment.removeObjectsFromScene = function (objects) { // duplicate of ebove function
  _.forEach( objects, environment.removeObjectFromScene )
}

environment.removeObjectFromPickingScene = function (object) {
  if (object.mesh) {
    environment.pickingScene.remove( object.mesh )
  } else {
    environment.pickingScene.remove( object )
  }
}

environment.removeObjectsFromPickingScene = function (objects) { // duplicate of ebove function
  _.forEach( objects, environment.removeObjectFromPickingScene )
}


environment.updateRenderer = function () {
  this.renderer.render(this.scene, this.camera)
}

// 'public' methods

environment.init = function () {
  this.initializeFlyControls()
  this.initializeRenderer()
  this.initializePickingScene()
  this.initializeWindowResize()
  this.onRenderFcts = [
    this.updateMarbleTexture.bind(this),
    this.updateControls.bind(this),
    this.updatePickingScene.bind(this),
    this.updateRenderer.bind(this)
  ]
}

environment.render = function () {
  var self = this
  var lastTimeMsec = null
  requestAnimationFrame(function animate(nowMsec){
    // keep looping
    requestAnimationFrame( animate );

    // measure time
    lastTimeMsec  = lastTimeMsec || nowMsec-1000/60
    var deltaMsec = Math.min(200, nowMsec - lastTimeMsec)
    lastTimeMsec  = nowMsec

    // call each update function
    self.onRenderFcts.forEach(function(onRenderFct){
      onRenderFct(deltaMsec/1000, nowMsec/1000)
    })
  })
}

module.exports = environment
