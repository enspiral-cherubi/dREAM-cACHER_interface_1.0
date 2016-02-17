var Auth = global.Auth
var environment = global.environment
var $ = require('jquery')
var dreamsView = require('./view.js')

var dreamsModel =  {
  dreamData: undefined,
  emailSignIn: function(formParams) {
    Auth.emailSignIn(formParams).then(function (user) {
      dreamsView.setNavBarSignedIn()
      dreamsView.clearLoginForm()
    }).fail(function(resp) {
      alert('Authentication failure: ' + (resp.errors && resp.errors.join(' ')))
      dreamsView.setNavBarSignedOut()
    })
  },

  emailSignUp: function (formParams) {
    Auth.emailSignUp(formParams).then(function (user) {
      dreamsView.setNavBarSignedIn()
      dreamsView.clearSignUpForm()
    }).fail(function (resp) {
      alert('Authentication failure: ' + (resp.errors &&  resp.errors.join(' ')))
      dreamsView.setNavBarSignedOut()
    })
  },

  getDreamsForUser: function() {
    var self = this
    $.ajax({
      url: global.apiUrl + "/user/dreams",
      type: 'GET'
    }).then(function (dreams) {
      self.dreamData = dreams
      environment.clearScene()
      dreamsView.populateDreamscape(dreams)
    }).fail(function (err) {
      console.log("Error: ", err)
    })
  },

  getAllDreams: function () {
    var self = this
    var returnValue = null
    $.ajax({
      url: global.apiUrl + "/dreams",
      type: 'GET'
    }).then(function (dreams){
      self.dreamData = dreams
      environment.clearScene()
      dreamsView.populateDreamscape(dreams)
    }).fail(function (err){
      console.log("Error: ", err)
    })
  },

  getDreams: function () {
    if ($('#my-dreams-tab').hasClass('active')) {
      this.getDreamsForUser()
    } else {
      this.getAllDreams()
    }
  },

  saveDream: function (dream) {
    var self = this
    var formData = {dream: dream}
    $.ajax({
      url : global.apiUrl + "/dreams",
      type: "POST",
      data : formData
    }).then(function () {
      self.getDreams()
    }).fail(function (err) {
      console.log('err: ', err)
    })
  },

  getTagsForDream: function (dream) {
    var data = {dream_id: dream.id}
    $.ajax({
      url: global.apiUrl + "/dream/tags",
      type: 'GET',
      data: data
    }).then(function (tags) {
      dreamsView.showDreamModal(dream, tags)
    }).fail(function (err) {
      console.log("Error: ", err)
    })
  },

  getDreamsForTag: function (tag) {
    var self = this
    var data = {tag: tag}
    $.ajax({
      url: global.apiUrl + "/tag/dreams",
      type: 'GET',
      data: data
    }).then(function (dreams) {
      self.dreamData = dreams
      environment.clearScene()
      dreamsView.populateDreamscape(dreams)
    }).fail(function (err) {
      console.log("Error: ", err)
    })
  }

}

module.exports = dreamsModel
