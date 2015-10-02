// post stuff to the dom

var dreamsView = {
  updateNavBar: function () {
    $('#new-dream-tab').show()
    if ($.auth.user['id']) {
      $('#login-dropdown').hide()
      $('#dreamscape-tab').show()
      $('#my-dreams-tab').show()
      $('#log-out-tab').show()

    } else {
      $('#login-dropdown').show()
      $('#dreamscape-tab').hide()
      $('#my-dreams-tab').hide()
      $('#log-out-tab').hide()
    }
  },

  populateDreamscape: function (dreams) {

    geometry = new THREE.Geometry()
    pickingGeometry = new THREE.Geometry()
    // clear the scene!
    var color = new THREE.Color();
    var quaternion = new THREE.Quaternion();
    var matrix = new THREE.Matrix4();

    for ( var i = 0; i < dreams.length; i ++ ) {

      var geom = THREE.geometryChooser(dreams[i].sentiment)

      getRandomCoords()

      // sets the position for each mesh
      var position = new THREE.Vector3();
        // position.z = 1
      if ( i === 0) {
        position.x = 0
        position.y = 0
        position.z = 0
      } else {
        if (dreams.length < 500) {
          position.x = normCoords[0] * Math.log(i + 1) * dreams.length
          position.y = normCoords[1] * Math.log(i + 1) * dreams.length
          position.z = normCoords[2] * Math.log(i + 1) * dreams.length
        } else {
          position.x = normCoords[0] * ( i + 1)^500
          position.y = normCoords[1] * ( i + 1)^500
          position.z = normCoords[2] * ( i + 1)^500
        }

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


    // drawnObject is all of the dream objects merged together together
    var drawnObject = new THREE.Mesh( geometry, defaultMaterial );
    scene.add( drawnObject );

    pickingScene.add( new THREE.Mesh( pickingGeometry, pickingMaterial ) );

    highlightBox = new THREE.Mesh(
      new THREE.SphereGeometry( 5, 32, 32 ),
      new THREE.MeshBasicMaterial( {
        shading: THREE.FlatShading, color: 0xf9d624, side: THREE.BackSide, transparent: true, opacity: 0.3
      } )
    )
    scene.add( highlightBox );

    this.positionCamera()

  },

  clearScene: function () {
    for( var i = scene.children.length - 1; i >= 0; i--) { scene.remove(scene.children[i]) }
    for( var i = pickingScene.children.length - 1; i >= 0; i--) { pickingScene.remove(pickingScene.children[i]) }
  },

  positionCamera: function () {
    camera.position.set( 0, 0, 100 );
    camera.lookAt( scene.position )
  },

  showDreamModal: function (dream) {
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


}


function applyVertexColors( g, c ) {
  g.faces.forEach( function( f ) {
      var n = ( f instanceof THREE.Face3 ) ? 3 : 4;
      for( var j = 0; j < n; j ++ ) {
          f.vertexColors[ j ] = c;
      }
  } );
}