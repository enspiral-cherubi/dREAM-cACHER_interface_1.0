// post stuff to the dom

var dreamsView = {
  updateNavBar: function () {
    $('#info').show()
    $('#controls').show()
    $('#new-dream-tab').show()
    $('#dreamscape-tab').show()
    if ($.auth.user['id']) {
      $('#login-dropdown').hide()
      $('#my-dreams-tab').show()
      $('#log-out-tab').show()

    } else {
      $('#login-dropdown').show()
      $('#my-dreams-tab').hide()
      $('#log-out-tab').hide()
    }
  },

  restorePublicInterface: function () {
    if ( $("#my-dreams-tab").hasClass("active") ) {
      dreamsModel.getAllDreams()
      $('#my-dreams-tab').removeClass('active')
      $('#dreamscape-tab').addClass('active')
    }
    // (EL) can prolly change to `this`
    dreamsView.updateNavBar()
  },

  showDreamEntryModal: function () {
    if ( $('#dreamscape-tab').hasClass('active') ) {
      $('#dreamscape-tab').removeClass('active')
      $('#dream-entry-modal').modal('show')
      $('#new-dream-tab').addClass('active')
      this.prevTabActive = '#dreamscape-tab'
    } else if  ( $('#my-dreams-tab').hasClass('active') ) {
      $('#my-dreams-tab').removeClass('active')
      $('#dream-entry-modal').modal('show')
      $('#new-dream-tab').addClass('active')
      this.prevTabActive = '#my-dreams-tab'
    }
  },

  // takes dreams, decides where they're going to go
  populateDreamscape: function (dreams) {
    geometry = new THREE.Geometry()
    pickingGeometry = new THREE.Geometry()

    var color = new THREE.Color();
    var quaternion = new THREE.Quaternion();
    var matrix = new THREE.Matrix4();

    for ( var i = 0; i < dreams.length; i ++ ) {

      var geom = THREE.geometryChooser(dreams[i].sentiment)

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

      // merge each geometry into the one 'master' geometry
      geometry.merge( geom, matrix );

      // give the geom's vertices a color corresponding to the "id"

      applyVertexColors( geom, color.setHex( i ) );

      pickingGeometry.merge( geom, matrix );

      environment.pickingData[ i ] = {
          position: position,
          rotation: rotation,
          scale: scale
      }

    }


    // drawnObject is all of the dream objects merged together together
    var drawnObject = new THREE.Mesh( geometry, environment.defaultMaterial );
    environment.scene.add( drawnObject );

    environment.pickingScene.add( new THREE.Mesh( pickingGeometry, environment.pickingMaterial ) );

    environment.highlightBox = new THREE.Mesh(
      new THREE.SphereGeometry( 5, 32, 32 ),
      new THREE.MeshBasicMaterial({
        color: 0xeeeeee,
        side: THREE.BackSide,
        transparent: true,
        opacity: 0.5
      })
    )
    environment.scene.add( environment.highlightBox );

    this.positionCamera()

  },

  // move to 'environment'
  clearScene: function () {
    for( var i = environment.scene.children.length - 1; i >= 0; i--) { environment.scene.remove(environment.scene.children[i]) }
    for( var i = environment.pickingScene.children.length - 1; i >= 0; i--) { environment.pickingScene.remove(environment.pickingScene.children[i]) }
  },

  // move to 'environment'
  positionCamera: function () {
    environment.camera.position.set( 0, 0, 300 );
    environment.camera.lookAt( environment.scene.position )
  },

  showInfoModal: function () {
    var contents = 'Each shape in the dreamscape represents a dream submited by somebody. You can click on an object to read the dream. Submit a dream yourself by clicking "Cache New Dream" in the nav bar. All dreams are anonymous. If you would like to keep track of your dreams, create an account and you will have access to you own personal dreamscape. Think of it like a 3D dream diary. You can also click on keywords in a dream to reveal other dreams with the same themes.<br><br>Dreamcacher is an experiment by <a href="http://will-sklenars.github.io/" target="_blank">Will Sklenars</a> and <a href="https://github.com/data-doge" target="_blank">Eugene Lynch</a>, using <a href="http://threejs.org/">three.js</a>.<br><br> <a href="https://twitter.com/WIllSklenars" id="feedback" target="_blank">Feedback</a>'
    // var contents = 'contents'
    var html = ""
      +   '<div class="modal-body">'
      +           "<p>"
      +                contents
      +           "</p>"
      +       "</div>"

    var titlehtml = ""
      + '<h4 class="modal-title">'
      +   "About Dreamcacher"
      + "</h4>"

    $('#dreamReadModal').modal('show')
    $('#read-modal-body').html(html)
    $('#read-modal-title').html(titlehtml)

  },

  showDreamModal: function (dream, tags) {
    var dreamTime = moment(dream.created_at).fromNow()
    var tagWords = parseTagObjects(tags)
    var taggedDreamString = parseDreamString(dream.contents, tagWords)
    var html = ""
      +   '<div class="modal-body">'
      +           "<p>"
      // +             dream.contents
      +                taggedDreamString
      +           "</p>"
      +       "</div>"

    var titlehtml = ""
      + '<h4 class="modal-title">'
      +   "A dream from "
      +   dreamTime
      + ".</h4>"

    $('#dreamReadModal').modal('show')
    $('#read-modal-body').html(html)
    $('#read-modal-title').html(titlehtml)

    dreamModalListners()

  }


};

function generateATag(text) {
  var html = "<a href='/"
  + text
  + "' "
  + "class='tag"
  + "' "
  + "id='"
  + text
  + "'"
  + " type='"
  + "button'>"
  + text
  + "</a>"
  return html
}

// TODO: abstract into module
function parseDreamString(dreamString, tagWords) {
  var outputString = dreamString
  for (var i = 0; i < tagWords.length; i++) {

    var currentTagWordSpace = " " + tagWords[i] + " "
    var currentTagWordComma = " " + tagWords[i] + ","
    var currentTagWordStop = " " + tagWords[i] + "."

    // all lowercase
    var aTag = " " + generateATag(tagWords[i]) + " "
    outputString = outputString.replace(currentTagWordSpace, aTag)

    aTag = " " + generateATag(tagWords[i]) + ","
    outputString = outputString.replace(currentTagWordComma, aTag)

    aTag = " " + generateATag(tagWords[i]) + "."
    outputString = outputString.replace(currentTagWordStop, aTag)

    // capitalised

    currentTagWordSpace = " " + capitalizeFirstLetter(tagWords[i]) + " "
    currentTagWordComma = " " + capitalizeFirstLetter(tagWords[i]) + ","
    currentTagWordStop = " " + capitalizeFirstLetter(tagWords[i]) + "."

    aTag = " " + generateATag(capitalizeFirstLetter(tagWords[i])) + " "
    outputString = outputString.replace(currentTagWordSpace, aTag)

    aTag = " " + generateATag(capitalizeFirstLetter(tagWords[i])) + ","
    outputString = outputString.replace(currentTagWordComma, aTag)

    aTag = " " + generateATag(capitalizeFirstLetter(tagWords[i])) + "."
    outputString = outputString.replace(currentTagWordStop, aTag)

    // allCaps
    aTag = generateATag(allCapsTag)
    var allCapsTag = tagWords[i].toUpperCase()

    currentTagWordSpace = " " + tagWords[i].toUpperCase() + " "
    currentTagWordComma = " " + tagWords[i].toUpperCase() + ","
    currentTagWordStop = " " + tagWords[i].toUpperCase() + "."

    aTag = " " + generateATag(tagWords[i].toUpperCase()) + " "
    outputString = outputString.replace(currentTagWordSpace, aTag)

    aTag = " " + generateATag(tagWords[i].toUpperCase()) + ","
    outputString = outputString.replace(currentTagWordComma, aTag)

    aTag = " " + generateATag(tagWords[i].toUpperCase()) + "."
    outputString = outputString.replace(currentTagWordStop, aTag)
  }
  return outputString
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function parseTagObjects (tagObjects) {
  var tags = []
  for (var i = 0; i < tagObjects.length; i++) {
      tags.push(tagObjects[i].word)
  };
  return tags
}


function applyVertexColors( g, c ) {
  g.faces.forEach( function( f ) {
      var n = ( f instanceof THREE.Face3 ) ? 3 : 4;
      for( var j = 0; j < n; j ++ ) {
          f.vertexColors[ j ] = c;
      }
  } );
}
