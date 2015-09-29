// var dreams = dreamTestData
var overModal
var dreamData
var objectUnderMouse = null
var container, stats;
var camera, controls, scene, renderer;
var pickingData = [], pickingTexture, pickingScene;
var objects = [];
var onRenderFcts = []
var highlightBox;
var defaultMaterial
var geometry

var mouse = new THREE.Vector2();
var offset = new THREE.Vector3( 10, 10, 10 );

var color = new THREE.Color();
var quaternion = new THREE.Quaternion();
var matrix = new THREE.Matrix4();

/////////////////////////// set up marbled texture for objects ///////////////

defaultMaterial = new THREEx.NoiseShaderMaterial()
onRenderFcts.push(function (delta, now) {
  // defaultMaterial.uniforms[ "time" ].value += delta/10
  defaultMaterial.uniforms[ "offset" ].value.x += delta/1
  // defaultMaterial.uniforms[ "scale" ].value.x += delta/10
})



function init3dInterface() {

  container = document.getElementById( "container" );

  /////////////////////////// set up camera /////////////////////////////

  camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 20000 );

  /////////////////////////// set fly controls /////////////////////////////

  controls = new THREE.FlyControls( camera );

  controls.movementSpeed = 120;
  controls.domElement = container;
  controls.rollSpeed = Math.PI / 16;
  controls.autoForward = false;
  controls.dragToLook = false;
  controls.enabled = false

  onRenderFcts.push(
    function (delta, now) {
      controls.update(delta)
  })


  // ///////////// add event listener to disable controls when modal popup mouseover //////////////////////
  // $('.modal-content').on('mouseover', function () {
  //   controls.enabled = false
  //   overModal = true
  // }).on('mouseout', function() {
  //   controls.enabled = true
  //   overModal = false
  // })

  /////////////////////////// set up scene /////////////////////////////

  scene = new THREE.Scene();

  ///////////////////// set up off-screen scene /////////////////////////////

  pickingScene = new THREE.Scene();
  pickingTexture = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight );
  pickingTexture.minFilter = THREE.LinearFilter;
  pickingTexture.generateMipmaps = false;
  pickingMaterial = new THREE.MeshBasicMaterial( { vertexColors: THREE.VertexColors } )

  ///////////////////// create the sky ////////////////////////

  // createStarField()

  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setClearColor( 0xffffff );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.sortObjects = false;
  container.appendChild( renderer.domElement );

  renderer.domElement.addEventListener( 'mousemove', onMouseMove );

  ///////////////////// On Window Resize ////////////////////////
  windowResize = new THREEx.WindowResize(renderer, camera)


  ///////////////////// initial populate dreamscape!~! ////////////////////////
  dreamsModel.getAllDreams()


}


function onMouseMove( e ) {

  mouse.x = e.clientX;
  mouse.y = e.clientY;

}


function pick() {

  //render the picking scene off-screen
  renderer.render( pickingScene, camera, pickingTexture );

  //create buffer for reading single pixel
  var pixelBuffer = new Uint8Array( 4 );

  //read the pixel under the mouse from the texture
  renderer.readRenderTargetPixels(pickingTexture, mouse.x, pickingTexture.height - mouse.y, 1, 1, pixelBuffer);

  //interpret the pixel as an ID

  var id = ( pixelBuffer[0] << 16 ) | ( pixelBuffer[1] << 8 ) | ( pixelBuffer[2] );
  var data = pickingData[ id ];

  objectUnderMouse = null
  if ( data) {

    //move our highlightBox so that it surrounds the picked object
    if ( data.position && data.rotation && data.scale ){

      highlightBox.position.copy( data.position )
      highlightBox.rotation.copy( data.rotation )
      highlightBox.scale.copy( data.scale ).add( offset )
      highlightBox.visible = true
      objectUnderMouse = id
    }

  } else {
      highlightBox.visible = false;
  }
}

onRenderFcts.push(pick)

//////////////////////////////////////////////////////////////////////////////
//    render the scene            //
//////////////////////////////////////////////////////////////////////////////
onRenderFcts.push(function(){
  renderer.render( scene, camera );
})

var lastTimeMsec = null
requestAnimationFrame(function animate(nowMsec){
  // keep looping
  requestAnimationFrame( animate );
  // measure time
  lastTimeMsec  = lastTimeMsec || nowMsec-1000/60
  var deltaMsec = Math.min(200, nowMsec - lastTimeMsec)
  lastTimeMsec  = nowMsec
  // call each update function
  onRenderFcts.forEach(function(onRenderFct){
    onRenderFct(deltaMsec/1000, nowMsec/1000)
  })

})
