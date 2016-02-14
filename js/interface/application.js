var environment = {}

environment.init = function () {
  var self = this

  this.objectUnderMouse = null
  this.pickingData = []
  this.objects = [];
  this.onRenderFcts = []

  this.mouse = new THREE.Vector2();
  this.offset = new THREE.Vector3( 10, 10, 10 );

  this.container = document.getElementById( "container" );




  /////////////////////////// set up marbled texture for objects ///////////////

  this.defaultMaterial = new THREEx.NoiseShaderMaterial()
  this.onRenderFcts.push(function (delta, now) {
    self.defaultMaterial.uniforms[ "offset" ].value.x += delta/1
  })



  /////////////////////////// set up camera /////////////////////////////

  this.camera = new THREE.PerspectiveCamera( 80, window.innerWidth / window.innerHeight, 1, 20000 );

  /////////////////////////// set fly controls /////////////////////////////

  this.controls = new THREE.FlyControls( this.camera );

  this.controls.movementSpeed = 120;
  this.controls.domElement = container;
  this.controls.rollSpeed = Math.PI / 16;
  this.controls.autoForward = false;
  this.controls.dragToLook = false;

  this.onRenderFcts.push(
    function (delta, now) {
      self.controls.update(delta)
  })


  /////////////////////////// set up scene /////////////////////////////

  this.scene = new THREE.Scene();

  ///////////////////// set up off-screen scene /////////////////////////////

  this.pickingScene = new THREE.Scene();
  this.pickingTexture = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight );
  this.pickingTexture.minFilter = THREE.LinearFilter;
  this.pickingTexture.generateMipmaps = false;
  this.pickingMaterial = new THREE.MeshBasicMaterial( { vertexColors: THREE.VertexColors } )

  /////////////////////////// set up renderer /////////////////////////////

  this.renderer = new THREE.WebGLRenderer( { antialias: true } );
  this.renderer.setClearColor( 0xffffff );
  this.renderer.setPixelRatio( window.devicePixelRatio );
  this.renderer.setSize( window.innerWidth, window.innerHeight );
  this.container.appendChild( this.renderer.domElement );

  this.onMouseMove = function( e ) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }
  this.renderer.domElement.addEventListener( 'mousemove', this.onMouseMove );

  ///////////////////// On Window Resize ////////////////////////
  this.windowResize = new THREEx.WindowResize(this.renderer, this.camera)

  this.pick = function () {
    //render the picking scene off-screen
    self.renderer.render( self.pickingScene, self.camera, self.pickingTexture );

    //create buffer for reading single pixel
    var pixelBuffer = new Uint8Array( 4 );

    //read the pixel under the mouse from the texture
    self.renderer.readRenderTargetPixels(self.pickingTexture, self.mouse.x, self.pickingTexture.height - self.mouse.y, 1, 1, pixelBuffer);

    //interpret the pixel as an ID

    var id = ( pixelBuffer[0] << 16 ) | ( pixelBuffer[1] << 8 ) | ( pixelBuffer[2] );
    var data = self.pickingData[ id ];

    self.objectUnderMouse = null
    if ( data) {
      //move our highlightBox so that it surrounds the picked object
      if ( data.position && data.rotation && data.scale ){
        self.highlightBox.position.copy( data.position )
        self.highlightBox.rotation.copy( data.rotation )
        self.highlightBox.scale.copy( data.scale ).add( self.offset )
        self.highlightBox.visible = true
        self.objectUnderMouse = id
      }
    } else {
      if (self.highlightBox) { self.highlightBox.visible = false; }
    }
  }
  this.onRenderFcts.push(this.pick)

  //////////////////////////////////////////////////////////////////////////////
  //    render the scene            //
  //////////////////////////////////////////////////////////////////////////////

  this.onRenderFcts.push(function(){
    self.renderer.render( self.scene, self.camera );
  })


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


















