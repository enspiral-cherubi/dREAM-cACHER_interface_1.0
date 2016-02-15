var THREE = require('three')
var geometryChooser = require('./../services/geometry-chooser')
var getMatrixData = require('./../services/get-matrix-data')
var $ = require('jquery')
var AuthInterface = require('./../interface/auth-interface')

var environment = global.environment

// posts stuff to the dom
var dreamsView = {
  updateNavBar: function () {
    $('#info').show()
    $('#controls').show()
    $('#new-dream-tab').show()
    $('#dreamscape-tab').show()
    if (AuthInterface.user['id']) {
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

  showCreateAccount: function () {
    setTimeout( function () {
      $('.signup-dropdown-toggle').attr('aria-expanded', 'true')
      $('#signup-dropdown').show()
      $('#signup-dropdown').addClass('open')
      $('.signup-dropdown-toggle').hide()
      $('#login-dropdown').show()
    }, 1)
  },

  // takes dreams, decides where they're going to go
  populateDreamscape: function (dreams) {

    allDreamsGeometry = new THREE.Geometry()
    pickingGeometry = new THREE.Geometry()

    for ( var i = 0; i < dreams.length; i ++ ) {
      var color = new THREE.Color();
      var quaternion = new THREE.Quaternion();
      var matrix = new THREE.Matrix4();

      var singleDreamGeom = geometryChooser(dreams[i].sentiment)

      var matrixData = getMatrixData(i)

      quaternion.setFromEuler( matrixData.rotation, false );

      // the matrix has the position, scale, and rotation of the object
      matrix.compose( matrixData.position, quaternion, matrixData.scale );

      // merge each geometry into the one 'master' geometry
      allDreamsGeometry.merge( singleDreamGeom, matrix );

      // give the singleDreamGeom's vertices a color corresponding to the "id"

      applyVertexColorsToGeometry( singleDreamGeom, color.setHex( i ) );

      pickingGeometry.merge( singleDreamGeom, matrix );

      environment.pickingData[ i ] = {
        position: matrixData.position,
        rotation: matrixData.rotation,
        scale: matrixData.scale
      }

    }


    // allDreamsMesh is all of the dream objects merged together together
    environment.dreamsMesh = new THREE.Mesh( allDreamsGeometry, environment.defaultMaterial );
    environment.addObjectToScene( environment.dreamsMesh );

    environment.pickingMesh = new THREE.Mesh( pickingGeometry, environment.pickingMaterial )
    environment.pickingScene.add( environment.pickingMesh );

    environment.highlightSphere = new THREE.Mesh(
      new THREE.SphereGeometry( 5, 32, 32 ),
      new THREE.MeshBasicMaterial({
        color: 0xeeeeee,
        side: THREE.BackSide,
        transparent: true,
        opacity: 0.5
      })
    )

    environment.addObjectToScene( environment.highlightSphere );

    environment.resetCameraPosition()

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

  }
};

function parseTagObjects (tagObjects) {
  var tags = []
  for (var i = 0; i < tagObjects.length; i++) {
    tags.push(tagObjects[i].word)
  }
  return tags
}

function applyVertexColorsToGeometry (geometry, color) {
  geometry.faces.forEach(function (face) {
    var n = (face instanceof THREE.Face3) ? 3 : 4;
    for (var j = 0; j < n; j++) {
      face.vertexColors[j] = color;
    }
  })
}

module.exports = dreamsView
