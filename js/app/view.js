var Auth = global.Auth
var environment = global.environment
var THREE = require('three')
var moment = require('moment')
var parseDreamString = require('./../services/parse-dream-string')
var $ = require('jquery')
require('bootstrap-jquery')
var generateMergedGeometriesFromDreams = require('./../services/generate-merged-geometries-from-dreams')

// posts stuff to the dom
var dreamsView = {
  setNavBarSignedIn: function () {
    $('#login-dropdown').hide()
    $('.dp-form-container').hide()
    $('#my-dreams-tab').show()
    $('#log-out-btn').show()
  },

  setNavBarSignedOut: function () {
    $('#my-dreams-tab').removeClass('active')
    $('#dreamscape-tab').addClass('active')
    $('#login-dropdown').show()
    $('#login-dropdown').attr('data-state', 'closed')
    $('#my-dreams-tab').hide()
    $('#log-out-btn').hide()
  },

  showDreamEntryModal: function () {
    $('#dream-entry-modal-container').modal('show')
    $('#save-dream-btn').attr('disabled', false)
  },

  closeDreamEntryModal: function () {
    $('#dream-entry-modal-container').modal('hide')
    $('#save-dream-btn').attr('disabled', true)
  },

  showCreateAccount: function () {
    $('#sign-up-dp-form-container').show()
    $('#login-dp-form-container').hide()
  },

  clearLoginForm: function () {
    $('#login-dp-form-container form')[0].reset()
  },

  clearSignUpForm: function () {
    $('#sign-up-dp-form-container form')[0].reset()
  },

  // takes dreams, decides where they're going to go
  populateDreamscape: function (dreams) {
    var mergedGeometries = generateMergedGeometriesFromDreams(dreams)

    environment.pickingData = mergedGeometries.pickingData

    // allDreamsMesh is all of the dream objects merged together together
    var materials = [ environment.defaultMaterial, environment.viewedMaterial ]
    environment.dreamsMesh = new THREE.Mesh( mergedGeometries.allDreamsGeometry, new THREE.MultiMaterial(materials) );
    environment.addObjectToScene( environment.dreamsMesh );

    environment.pickingMesh = new THREE.Mesh( mergedGeometries.pickingGeometry, environment.pickingMaterial )
    environment.pickingScene.add( environment.pickingMesh );

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

module.exports = dreamsView
