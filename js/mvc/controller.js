// adds the event listners
USER_VALIDATED_FACEBOOK = false

$(document).ready( function () {

  init3dInterface();

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
    var dream = $('#dream-entry-modal').find('textarea[type="dream"]').val()
    $('#new-dream-tab').removeClass('active')
    if (dream.length > 10) { dreamsModel.saveDream(dream) } else {
      alert('you must enter a dream :-)')
      setTimeout( function () {
        dreamsView.showDreamEntryModal()
      }, 1000)
    }
  })

  // closing the dream entry modal
  $('#dream-entry-modal').on('hidden.bs.modal', function () {
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

  $('.btn-fb').on('click', function(e) {
    e.preventDefault()
    dreamsModel.faceBookSignUp()
  })

  PubSub.subscribe('auth.validation.success', function(ev, msg) {
    if ( USER_VALIDATED_FACEBOOK === false && $.auth.user.provider === 'facebook' ) {
      window.history.pushState("", "Logged in with facebook", "/")
      $.auth.validateToken().then(function (user) {
        console.log(user)
      })
      USER_VALIDATED_FACEBOOK = true
    }
  });

  PubSub.subscribe('auth.validation.error', function(ev, msg) {
    // dreamsView.restorePublicInterface()
    $.removeCookie('authHeaders')
    console.log('validation error signal fired.')
  });

  $('.btn-tw').on('click', function(e) {
    e.preventDefault()
    alert('twitter!')
    // $.auth.authenticate({provider: 'github'})
  })

  $('.btn-gh').on('click', function(e) {
    e.preventDefault()
    alert('github!!!')
    // $.auth.authenticate({provider: 'github'})
  })

  $('.btn-gl').on('click', function(e) {
    e.preventDefault()
    alert('google!')
    // $.auth.authenticate({provider: 'github'})
  })

  $('#log-out-tab').on('click', function(e) {
    e.preventDefault()
    $.auth.signOut().then(function () {
      dreamsView.restorePublicInterface()
    })
  })



  // create new account modal
  $('#create-account-catch').on('click', function (e) {
    e.preventDefault()
    $('#login-dropdown').removeClass('open')
    // $('#login-dropdown').hide()
    $('#login-dropdown-toggle').attr('aria-expanded', 'false')

    showCreateAccount()
  })

  $('#submit-account-catch').on("click", function(e) {
    e.preventDefault()
    var email = $('#signup-dropdown').find('input[type="email"]').val()
    var password = $('#signup-dropdown').find('input[type="password"]').val()
    var confirmPassword = $('#confirm-password').find('input[type="password"]').val()

    if ( authentication(email, password, confirmPassword) ) {
      dreamsModel.emailSignUp( email, password, confirmPassword )
    } else { alert(authenticationError) }
  })



  // three.js stuff

  renderer.domElement.addEventListener('mousedown', function () {
    if (objectUnderMouse >= 0) {
      // make the modal appear with the correct dream data
      var dream = dreamData[objectUnderMouse]
      dreamsModel.getTagsForDream(dream)
    }
  })


})


// helper functions

function dreamModalListners () {
  $('.tag').on('click', function(e) {
    e.preventDefault()
    var tag = this.id
    $('#dreamReadModal').modal('hide');
    dreamsModel.getDreamsForTag(tag)
    $('#dreamscape-tab').removeClass('active')
    $('#my-dreams-tab').removeClass('active')
  })
}

function showCreateAccount() {
  setTimeout( function () {
    $('.signup-dropdown-toggle').attr('aria-expanded', 'true')
    $('#signup-dropdown').show()
    $('#signup-dropdown').addClass('open')
    $('.signup-dropdown-toggle').hide()
    $('#login-dropdown').show()
  }, 1)
}

var authenticationError = null
function authentication(email, password, confirmPassword) {
  if (password === confirmPassword) {
    if (password.length > 7) {
        if (email) {
          return true
        } else { authenticationError = 'email must be a real email' ; showCreateAccount() ; return false }
      } else { authenticationError = 'password must be atleast 8 characters' ; showCreateAccount() ; return false }
  } else { authenticationError = 'passwords do not match!' ; showCreateAccount() ; return false }
}