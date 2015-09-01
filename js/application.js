var container, stats;
var camera, controls, scene, renderer;
var pickingData = [], pickingTexture, pickingScene;
var objects = [];
var onRenderFcts = []
var highlightBox;
var defaultMaterial

var mouse = new THREE.Vector2();
var offset = new THREE.Vector3( 10, 10, 10 );

/////////////////////////// set up marbled texture for objects ///////////////

defaultMaterial = new THREEx.NoiseShaderMaterial()
onRenderFcts.push(function (delta, now) {
  // defaultMaterial.uniforms[ "time" ].value += delta/10
  defaultMaterial.uniforms[ "offset" ].value.x += delta/1
  // defaultMaterial.uniforms[ "scale" ].value.x += delta/10
})

init();

function init() {

  container = document.getElementById( "container" );

  /////////////////////////// set up camera /////////////////////////////

  camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );
  camera.position.z = 100;

  /////////////////////////// set up controls /////////////////////////////

  controls = new THREE.TrackballControls( camera );
  controls.rotateSpeed = 1.0;
  controls.zoomSpeed = 1.2;
  controls.panSpeed = 0.8;
  controls.noZoom = false;
  controls.noPan = false;
  controls.staticMoving = true;
  controls.dynamicDampingFactor = 0.3;

  onRenderFcts.push(controls.update)

  /////////////////////////// set up scene /////////////////////////////

  scene = new THREE.Scene();

  ///////////////////// set up off-screen scene /////////////////////////////

  pickingScene = new THREE.Scene();
  pickingTexture = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight );
  pickingTexture.minFilter = THREE.LinearFilter;
  pickingTexture.generateMipmaps = false;

  ///////////////////// set up lights /////////////////////////////
  // not needed for current materials

  // scene.add( new THREE.AmbientLight( 0x555555 ) );

  // var light = new THREE.SpotLight( 0xffffff, 1.5 );
  // light.position.set( 0, 500, 2000 );
  // scene.add( light );

  var geometry = new THREE.Geometry()
  pickingGeometry = new THREE.Geometry()
  pickingMaterial = new THREE.MeshBasicMaterial( { vertexColors: THREE.VertexColors } )

  function applyVertexColors( g, c ) {

    g.faces.forEach( function( f ) {

        var n = ( f instanceof THREE.Face3 ) ? 3 : 4;

        for( var j = 0; j < n; j ++ ) {

            f.vertexColors[ j ] = c;

        }

    } );

  }

  ///////////////////// create the sky ////////////////////////

  createStarField()

  ///////////////////// create the dream objects ////////////////////////

  var color = new THREE.Color();
  var quaternion = new THREE.Quaternion();
  var matrix = new THREE.Matrix4();


  for ( var i = 0; i < dreamTestData.length; i ++ ) {

    var geom = THREE.geometryChooser(dreamTestData[i].sentiment)

    // sets the position for each mesh
    var position = new THREE.Vector3();
    position.x = Math.random() * 80 - 40;
    position.y = Math.random() * 10 - 5;
    position.z = Math.random() * 80 - 40;

    // sets the rotation for each mesh
    var rotation = new THREE.Euler();
    rotation.x = Math.random() * 2 * Math.PI;
    rotation.y = Math.random() * 2 * Math.PI;
    rotation.z = Math.random() * 2 * Math.PI;

    // sets the scale for each mesh
    var scale = new THREE.Vector3();
    scale.x =  0.01;
    scale.y =  0.01;
    scale.z =  0.01;

    quaternion.setFromEuler( rotation, false );

    // the matrix has the position, scale, and rotation of the object
    matrix.compose( position, quaternion, scale );

    // merge each geometry into the one 'master' geometry
    geometry.merge( geom, matrix );

    // give the geom's vertices a color corresponding to the "id"

    applyVertexColors( geom, color.setHex( i ) );

    pickingGeometry.merge( geom, matrix );

    pickingData[ i ] = {
        position: position,
        rotation: rotation,
        scale: scale
    }
  }

  var drawnObject = new THREE.Mesh( geometry, defaultMaterial );
  scene.add( drawnObject );

  console.log ( drawnObject )

  pickingScene.add( new THREE.Mesh( pickingGeometry, pickingMaterial ) );

  highlightBox = new THREE.Mesh(
      new THREE.BoxGeometry( 0.1, 0.1, 0.1 ),
      new THREE.MeshLambertMaterial( { color: 0xffff00 }
  ) );
  scene.add( highlightBox );

  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setClearColor( 0xffffff );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.sortObjects = false;
  container.appendChild( renderer.domElement );

  renderer.domElement.addEventListener( 'mousemove', onMouseMove );

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

  if ( data) {

    //move our highlightBox so that it surrounds the picked object

    if ( data.position && data.rotation && data.scale ){

      highlightBox.position.copy( data.position );
      highlightBox.rotation.copy( data.rotation );
      highlightBox.scale.copy( data.scale ).add( offset );
      highlightBox.visible = true;

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
