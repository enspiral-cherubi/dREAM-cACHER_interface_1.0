$.ajaxSetup({
    beforeSend: function(xhr, settings) {
      // append outbound auth headers
      $.auth.appendAuthHeaders(xhr, settings);
    }
});

$.auth.configure({
  apiUrl: 'http://localhost:3000'
});




// $('#logincatch').on("submit", function(e) {
//   alert(event)
//   e.preventDefault();
//   e.stopPropagation();
// });

// $('#sign-in-catch').on("click", function(event) {
//   event.preventDefault()

//   var email = $('#login-nav').find('input[type="email"]').val()
//   var password = $('#login-nav').find('input[type="password"]').val()

//   $.auth.emailSignIn({
//     email: email,
//     password: password
//   }).then( function (user) {
//     dreamsView.updateNavBar()

//     // this is where we do stuff after a user signs in
//     // add the button to see personal dreamscape ($.auth.user)
//     // before action in the controller to protect data for specific controller action

//     // make login disappear

//     // make 'my dreams' appear
//     // make 'logout' appear

//     console.log($.auth.user)
//     console.log('user: ', user)
//   }).fail(function(resp) {
//     alert('Authentication failure: ' + resp.errors.join(' '));
//   });
// })

// $('#dreamscape-tab').on('click', function(e) {
//   e.preventDefault()
//   $(this).addClass('active')
//   $('#my-dreams-tab').removeClass('active')
// })

// $('#my-dreams-tab').on('click', function(e) {
//   e.preventDefault()
//   $(this).addClass('active')
//   $('#dreamscape-tab').removeClass('active')
//   getDreamsForUser()



// })

// function getDreamsForUser () {
//     var self = this
//     var returnValue = null
//     $.ajax({
//       url: "http://localhost:3000/user/dreams",
//       type: 'GET',
//       success: function (dreams){
//         // dreamData = dreams
//         populateDreamscape(dreams)
//         console.log(dreams.length)
//       },
//       error: function (err){
//         console.log("Error: ", err);
//       }
//     })
//   }

$('#log-out-tab').on('click', function(e) {
  e.preventDefault()
  $.auth.signOut()
  dreamsView.updateNavBar()

  // make the logout disappear
  // make the 'my dreamsc tab disappear'

})

// function updateNavBar () {
//   console.log($.auth.user)
//   if ($.auth.user['id']) {
//     $('#login-dropdown').hide()
//     $('#dreamscape-tab').show()
//     $('#my-dreams-tab').show()
//     $('#log-out-tab').show()
//   } else {
//     $('#login-dropdown').show()
//     $('#dreamscape-tab').hide()
//     $('#my-dreams-tab').hide()
//     $('#log-out-tab').hide()
//   }

// }



