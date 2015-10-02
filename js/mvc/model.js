// makes ajax calls
// calls view methods
var dreamsModel = {

  emailSignIn: function(email, password) {
    $.auth.emailSignIn({
      email: email,
      password: password
    }).then( function (user) {
      dreamsView.updateNavBar()
      console.log($.auth.user)
    }).fail(function(resp) {
      alert('Authentication failure: ' + resp.errors.join(' '));
    });
  },

  getDreamsForUser: function() {
    $.ajax({
      url: "http://localhost:3000/user/dreams",
      type: 'GET',
      success: function (dreams){
        dreamData = dreams
        dreamsView.clearScene()
        dreamsView.populateDreamscape(dreams)
      },
      error: function (err){
        console.log("Error: ", err);
      }
    })
  },

  getAllDreams: function () {
    var self = this
    var returnValue = null
    $.ajax({
      url: "http://localhost:3000/dreams",
      type: 'GET',
      success: function (dreams){
        dreamData = dreams
        dreamsView.clearScene()
        dreamsView.populateDreamscape(dreams)
        dreamsView.updateNavBar()
      },
      error: function (err){
        console.log("Error: ", err);
      }
    })
  },

  saveDream: function (dream) {
    var formData = {dream: dream}; //Array

    console.log(formData)

    $.ajax({
      url : "http://localhost:3000/dreams",
      type: "POST",
      data : formData,
      success: function(data, textStatus, jqXHR)
      {
        console.log(data)
      },
      error: function (jqXHR, textStatus, errorThrown)
      {
        console.log(errorThrown)
      }
    });

  }




}