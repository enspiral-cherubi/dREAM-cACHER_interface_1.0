var $ = require('jquery')
var AuthInterface = require('./../services/auth-interface')
var dreamsModel = require('./model.js')
var dreamsView = require('./view.js')
var queryString = require('query-string')

var environment = global.environment

var controller = {
  init: function () {
    environment.init()
    environment.render()
    dreamsModel.getAllDreams()
  },
  bindEventListeners: function () {
    // change dream collections
    $('#dreamscape-tab').on('click', function(e) {
      e.preventDefault()
      $(this).addClass('active')
      $('#my-dreams-tab').removeClass('active')
      dreamsModel.getAllDreams()
    })

    $('#my-dreams-tab').on('click', function(e) {
      e.preventDefault()
      $(this).addClass('active')
      $('#dreamscape-tab').removeClass('active')
      dreamsModel.getDreamsForUser()
    })

    // new dreams

    $('#new-dream-tab').on('click', function (e) {
      e.preventDefault()
      dreamsView.showDreamEntryModal()
    })

    $('#save-dream').on('click', function (e) {
      e.preventDefault()
      var dream = $('#dream-entry-modal-container').find('textarea').val()
      $('#new-dream-tab').removeClass('active')
      if (dream.length > 10) {
        dreamsModel.saveDream(dream)
      } else {
        alert('your dream must be longer than 10 characters')
        setTimeout(function () {
          dreamsView.showDreamEntryModal()
        }, 1000)
      }
    })

    // closing the dream entry modal
    $('#dream-entry-modal-container').on('hidden.bs.modal', function () {
      $(dreamsView.prevTabActive).addClass('active')
      $('#new-dream-tab').removeClass('active')
    })

    // other navbar stuff

    $('#info').on('click', function(e) {
      e.preventDefault()
      dreamsView.showInfoModal()
    })
    // user stuff

    $('#sign-in-catch').on("click", function(e) {
      e.preventDefault()
      var email = $('#login-nav').find('input[type="email"]').val()
      var password = $('#login-nav').find('input[type="password"]').val()
      dreamsModel.emailSignIn(email, password)
    })

    $('#log-out-tab').on('click', function(e) {
      e.preventDefault()
      AuthInterface.signOut()
      dreamsView.restorePublicInterface()
    })

    // create new account modal
    $('#create-account-catch').on('click', function (e) {
      e.preventDefault()
      $('#login-dropdown').removeClass('open')
      // $('#login-dropdown').hide()
      $('#login-dropdown-toggle').attr('aria-expanded', 'false')

      dreamsView.showCreateAccount()
    })

    $('#sign-up-form').on('submit', function(e) {
      e.preventDefault()
      var $form = $(this)
      var formParams = queryString.parse($form.serialize())
      var errors = signUpErrors(formParams)
      if (errors) {
        dreamsView.showCreateAccount()
        alert(errors)
      } else {
        dreamsModel.emailSignUp(formParams)
      }
    })

    // three.js stuff

    environment.renderer.domElement.addEventListener('mousedown', function () {
      if (environment.objectUnderMouse >= 0) {
        // make the modal appear with the correct dream data
        var dream = dreamsModel.dreamData[environment.objectUnderMouse]
        if (dream) { dreamsModel.getTagsForDream(dream) }
      }
    })

    $(document).on('click', '.tag', function(e) {
      e.preventDefault()
      var tag = this.id
      $('#dreamReadModal').modal('hide');
      dreamsModel.getDreamsForTag(tag)
      $('#dreamscape-tab').removeClass('active')
      $('#my-dreams-tab').removeClass('active')
    })

    // HACK: makes sure that bootstrap-jquery doesn't ignore click events on
    // inputs and textareas inside of dialogs and dropdowns. fucking bootstrap ..
    $('textarea, input').on('click', function () {
      $(this).focus()
    })

    // helper functions

    // TODO: refactor
    function signUpErrors (params) {
      var errors = []
      if (params.password.length < 8) {
        errors.push('password must be atleast 8 characters')
      }
      if (params.password !== params.password_confirmation) {
        errors.push('passwords do not match!')
      }
      return errors.length > 0 ? errors : null
    }
  }
}

module.exports = controller
