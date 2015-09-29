// adds the event listners

$(document).ready( function () {

  init3dInterface();

  $('#sign-in-catch').on("click", function(e) {
    e.preventDefault()
    var email = $('#login-nav').find('input[type="email"]').val()
    var password = $('#login-nav').find('input[type="password"]').val()
    dreamsModel.emailSignIn(email, password)
  })


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

  $('#log-out-tab').on('click', function(e) {
    e.preventDefault()
    $.auth.signOut().then(function () {
      if ( $("#my-dreams-tab").hasClass("active") ) {
        dreamsModel.getAllDreams()
        $('#my-dreams-tab').removeClass('active')
        $('#dreamscape-tab').addClass('active')
      }
      dreamsView.updateNavBar()
    })

  })

  renderer.domElement.addEventListener('mousedown', function () {
    if (objectUnderMouse >= 0) {
      // make the modal appear with the correct dream data
      var dream = dreamData[objectUnderMouse]
      dreamsView.showDreamModal(dream)
    }
  })







})
