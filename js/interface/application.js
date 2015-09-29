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



function init(dreamType) {

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

  ///////////////////// set up lights /////////////////////////////
  // not needed for current materials

  // scene.add( new THREE.AmbientLight( 0x555555 ) );

  // var light = new THREE.SpotLight( 0xffffff, 1.5 );
  // light.position.set( 0, 500, 2000 );
  // scene.add( light );

  // geometry = new THREE.Geometry()
  // pickingGeometry = new THREE.Geometry()
  pickingMaterial = new THREE.MeshBasicMaterial( { vertexColors: THREE.VertexColors } )

  // function applyVertexColors( g, c ) {
  //   g.faces.forEach( function( f ) {
  //       var n = ( f instanceof THREE.Face3 ) ? 3 : 4;
  //       for( var j = 0; j < n; j ++ ) {
  //           f.vertexColors[ j ] = c;
  //       }
  //   } );
  // }

  ///////////////////// create the sky ////////////////////////

  // createStarField()

  ///////////////////// create the dream objects ////////////////////////



  // var color = new THREE.Color();
  // var quaternion = new THREE.Quaternion();
  // var matrix = new THREE.Matrix4();

  // function populateDreamscape (dreams) {
  //   for ( var i = 0; i < dreams.length; i ++ ) {

  //     var geom = THREE.geometryChooser(dreams[i].sentiment)

  //     getRandomCoords()


  //     // sets the position for each mesh
  //     var position = new THREE.Vector3();
  //       // position.z = 1
  //     if ( i === 0) {
  //       position.x = 0
  //       position.y = 0
  //       position.z = 0

  //     } else {
  //       // this one is good after the initial cluseter
  //       position.x = normCoords[0] * ( i + 1)^500
  //       position.y = normCoords[1] * ( i + 1)^500
  //       position.z = normCoords[2] * ( i + 1)^500
  //       // position.z = 50

  //     }

  //     // sets the rotation for each mesh
  //     var rotation = new THREE.Euler();
  //     rotation.x = Math.random() * 2 * Math.PI;
  //     rotation.y = Math.random() * 2 * Math.PI;
  //     rotation.z = Math.random() * 2 * Math.PI;

  //     // sets the scale for each mesh
  //     var scale = new THREE.Vector3();
  //     scale.x =  0.05;
  //     scale.y =  0.05;
  //     scale.z =  0.05;

  //     quaternion.setFromEuler( rotation, false );

  //     // the matrix has the position, scale, and rotation of the object
  //     matrix.compose( position, quaternion, scale );

  //     // merge each geometry into the one 'master' geometry
  //     geometry.merge( geom, matrix );

  //     // give the geom's vertices a color corresponding to the "id"

  //     applyVertexColors( geom, color.setHex( i ) );

  //     pickingGeometry.merge( geom, matrix );

  //     pickingData[ i ] = {
  //         position: position,
  //         rotation: rotation,
  //         scale: scale
  //     }
  //   }

  //   // drawnObject is all of the dream objects merged together together
  //   var drawnObject = new THREE.Mesh( geometry, defaultMaterial );
  //   scene.add( drawnObject );

  //   pickingScene.add( new THREE.Mesh( pickingGeometry, pickingMaterial ) );



  //   highlightBox = new THREE.Mesh(
  //     new THREE.SphereGeometry( 5, 32, 32 ),
  //     new THREE.MeshBasicMaterial( {
  //       shading: THREE.FlatShading, color: 0xf9d624, side: THREE.BackSide, transparent: true, opacity: 0.3
  //     } )
  //   )
  //   scene.add( highlightBox );
  // }

  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setClearColor( 0xffffff );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.sortObjects = false;
  container.appendChild( renderer.domElement );

  renderer.domElement.addEventListener( 'mousemove', onMouseMove );

   ///////////////////// On Window Resize ////////////////////////
  windowResize = new THREEx.WindowResize(renderer, camera)

  ///////////////////// Display modal!!!! ////////////////////////
  renderer.domElement.addEventListener('mousedown', function () {
    if (objectUnderMouse >= 0) {
      // make the modal appear with the correct dream data
      var dream = dreamData[objectUnderMouse]
      var html = ""
      +   '<div class="modal-body">'
      +           "<p>"
      +             dream.contents
      +           "</p>"
      +       "</div>"

      var titlehtml = ""
      + '<h4 class="modal-title">'
      +   "Dreamtime: "
      +   dream.created_at
      + "</h4>"

      $('#myModal').modal('show')
      $('.modal-body').replaceWith(html)
      $('.modal-title').replaceWith(titlehtml)
    }
  })


  // function getAllDreams () {
  //   var self = this
  //   var returnValue = null
  //   $.ajax({
  //     url: "http://localhost:3000/dreams",
  //     type: 'GET',
  //     success: function (dreams){
  //       dreamData = dreams
  //       populateDreamscape(dreams)
  //     },
  //     error: function (err){
  //       console.log("Error: ", err);
  //     }
  //   })
  // }

  if (dreamType === 'all') {
    dreamsModel.getAllDreams()
  } else if (dreamType === 'user') {
    dreamsModel.getDreamsForUser()
  }


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

  // console.log(pickingTexture.height)

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
      // renderer.domElement.addEventListener('mousedown', function () {alert(dreamTestData[id])})
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



// function populateDreamscape (dreams) {
//     for ( var i = 0; i < dreams.length; i ++ ) {

//       var geom = THREE.geometryChooser(dreams[i].sentiment)

//       getRandomCoords()


//       // sets the position for each mesh
//       var position = new THREE.Vector3();
//         // position.z = 1
//       if ( i === 0) {
//         position.x = 0
//         position.y = 0
//         position.z = 0

//       } else {
//         // this one is good after the initial cluseter
//         position.x = normCoords[0] * ( i + 1)^500
//         position.y = normCoords[1] * ( i + 1)^500
//         position.z = normCoords[2] * ( i + 1)^500
//         // position.z = 50

//       }

//       // sets the rotation for each mesh
//       var rotation = new THREE.Euler();
//       rotation.x = Math.random() * 2 * Math.PI;
//       rotation.y = Math.random() * 2 * Math.PI;
//       rotation.z = Math.random() * 2 * Math.PI;

//       // sets the scale for each mesh
//       var scale = new THREE.Vector3();
//       scale.x =  0.05;
//       scale.y =  0.05;
//       scale.z =  0.05;

//       quaternion.setFromEuler( rotation, false );

//       // the matrix has the position, scale, and rotation of the object
//       matrix.compose( position, quaternion, scale );

//       // merge each geometry into the one 'master' geometry
//       geometry.merge( geom, matrix );

//       // give the geom's vertices a color corresponding to the "id"

//       applyVertexColors( geom, color.setHex( i ) );

//       pickingGeometry.merge( geom, matrix );

//       pickingData[ i ] = {
//           position: position,
//           rotation: rotation,
//           scale: scale
//       }
//     }

//     // drawnObject is all of the dream objects merged together together
//     var drawnObject = new THREE.Mesh( geometry, defaultMaterial );
//     scene.add( drawnObject );

//     pickingScene.add( new THREE.Mesh( pickingGeometry, pickingMaterial ) );



//     highlightBox = new THREE.Mesh(
//       new THREE.SphereGeometry( 5, 32, 32 ),
//       new THREE.MeshBasicMaterial( {
//         shading: THREE.FlatShading, color: 0xf9d624, side: THREE.BackSide, transparent: true, opacity: 0.3
//       } )
//     )
//     scene.add( highlightBox );
//   }


//   function applyVertexColors( g, c ) {
//     g.faces.forEach( function( f ) {
//         var n = ( f instanceof THREE.Face3 ) ? 3 : 4;
//         for( var j = 0; j < n; j ++ ) {
//             f.vertexColors[ j ] = c;
//         }
//     } );
//   }