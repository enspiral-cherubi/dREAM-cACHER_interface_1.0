var $ = require('jquery')
var dreamsView = require('./view.js')
var AuthInterface = require('./../services/auth-interface')
var environment = global.environment

var dreamsModel =  {
  dreamData: undefined,

  emailSignIn: function(email, password) {
    AuthInterface.emailSignIn({
      email: email,
      password: password
    }).then( function (user) {
      dreamsView.updateNavBar()
    }).fail(function(resp) {
      alert('Authentication failure: ' + (resp.errors && resp.errors.join(' ')));
    });
  },

  emailSignUp: function (email, password, confirmPassword) {
    // TODO: refactor
    AuthInterface.emailSignUp({
      email: email,
      password: password,
      password_confirmation: confirmPassword
    }).then( function (user) {
      // validate token, as AuthInterface.user wasnt showing the current user
      AuthInterface.validateToken().then(function() {
        dreamsView.updateNavBar()
      }).fail(function(resp) {
        // TODO: refactor these errors into AuthInterface
        alert('Authentication failure: ' + (resp.errors &&  resp.errors.join(' ')))
      })
    }).fail(function(resp) {
      alert('Authentication failure: ' + (resp.errors &&  resp.errors.join(' ')))
    })
  },

  getDreamsForUser: function() {
    var self = this
    $.ajax({
      url: "http://104.236.175.6/user/dreams",
      type: 'GET',
      success: function (dreams){
        self.dreamData = dreams
        environment.clearScene()
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
      url: "http://104.236.175.6/dreams",
      type: 'GET',
      success: function (dreams){
        self.dreamData = dreams
        environment.clearScene()
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
      url : "http://104.236.175.6/dreams",
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

  },

  getTagsForDream: function (dream) {
    var data = {dream_id: dream.id}
    $.ajax({
      url: "http://104.236.175.6/dream/tags",
      type: 'GET',
      data: data,
      success: function (tags){
        dreamsView.showDreamModal(dream, tags)
      },
      error: function (err){
        console.log("Error: ", err);
      }
    })
  },

  getDreamsForTag: function (tag) {
    var self = this
    var data = {tag: tag}
    $.ajax({
      url: "http://104.236.175.6/tag/dreams",
      type: 'GET',
      data: data,
      success: function (dreams){
        self.dreamData = dreams
        environment.clearScene()
        dreamsView.populateDreamscape(dreams)
      },
      error: function (err){
        console.log("Error: ", err);
      }
    })
  }

}

module.exports = dreamsModel
