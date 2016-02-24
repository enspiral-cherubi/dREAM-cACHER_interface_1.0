var THREE = require('three')
var Auth = global.Auth
var environment = global.environment
var $ = require('jquery')
var dreamsModel = require('./model.js')
var dreamsView = require('./view.js')
var queryString = require('query-string')

var controller = {
  init: function () {
    environment.init()
    environment.render()
    Auth.validateToken().then(function () {
      dreamsView.setNavBarSignedIn()
    }).fail(function () {
      dreamsView.setNavBarSignedOut()
    })
    dreamsModel.getDreams('all')
  },
  bindEventListeners: function () {
    // change dream collections
    $('#dreamscape-tab').on('click', function(e) {
      e.preventDefault()
      $(this).addClass('active')
      $('#my-dreams-tab').removeClass('active')
      dreamsModel.getDreams('all')
    })

    $('#my-dreams-tab').on('click', function(e) {
      e.preventDefault()
      $(this).addClass('active')
      $('#dreamscape-tab').removeClass('active')
      dreamsModel.getDreams('forUser')
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

    $('#login-form').on('submit', function(e) {
      e.preventDefault()
      var $form = $(this)
      var formParams = queryString.parse($form.serialize())
      dreamsModel.emailSignIn(formParams)
    })

    $('#log-out-btn').on('click', function(e) {
      e.preventDefault()
      Auth.signOut()
      dreamsView.setNavBarSignedOut()
      dreamsModel.getDreams('all')
    })

    // create new account modal
    $('#create-account-btn').on('click', function (e) {
      e.preventDefault()
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

    // TODO: refactor and move into view
    $('#login-dropdown-btn').on('click', function (e) {
      e.preventDefault()
      var $dropdown = $(this).parent()
      if ($dropdown.attr('data-state') === 'open') {
        $dropdown.attr('data-state', 'closed')
        $dropdown.find('.dp-form-container').hide()
      } else {
        $dropdown.attr('data-state', 'open')
        $dropdown.find('#login-dp-form-container').show()
      }
    })

    // three.js stuff

    environment.renderer.domElement.addEventListener('mousedown', function () {
      var dreamIndex = environment.objectUnderMouse
      if (dreamIndex >= 0) {
        // make the modal appear with the correct dream data
        var dream = dreamsModel.dreamData[dreamIndex]
        if (dream) {
          dreamsModel.getTagsForDream(dream)
          if (!dream.viewed) { dreamsModel.markDreamAsViewed(dream) }
        }
      }
    })

    $(document).on('click', '.tag', function(e) {
      e.preventDefault()
      var tag = this.id
      $('#dreamReadModal').modal('hide');
      dreamsModel.getDreams({tag: tag})
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
