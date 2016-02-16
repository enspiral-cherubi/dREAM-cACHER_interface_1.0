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
    }).then(function (user) {
      dreamsView.updateNavBar()
    }).fail(function(resp) {
      alert('Authentication failure: ' + (resp.errors && resp.errors.join(' ')));
    });
  },

  emailSignUp: function (formParams) {
    AuthInterface.emailSignUp(formParams).then(function (user) {
      // TODO: AuthInterface.user seems not to be defined post-sign-up, may
      // have to set AuthInterface as a global variable, or might have to
      // validateToken like what was being done before
      dreamsView.updateNavBar()
    }).fail(function (resp) {
      alert('Authentication failure: ' + (resp.errors &&  resp.errors.join(' ')))
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
      dreamsView.updateNavBar()
    }).fail(function (err){
      console.log("Error: ", err)
    })
  },

  saveDream: function (dream) {
    var formData = {dream: dream}
    $.ajax({
      url : global.apiUrl + "/dreams",
      type: "POST",
      data : formData
    }).then(function (data, textStatus, jqXHR) {
      console.log(data)
    }).fail(function (jqXHR, textStatus, errorThrown) {
      console.log(errorThrown)
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
      console.log("Error: ", err);
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
      console.log("Error: ", err);
    })
  }

}

module.exports = dreamsModel
