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

  fetchDreams: function (fetchType) {
    var $deferred = $.Deferred()
    var apiPath = fetchType === 'forUser' ? '/user/dreams' : '/dreams'
    $.get(global.apiUrl + apiPath).then(function (dreams) {
      self.dreamData = dreams
      self.dreamData.forEach(function (dream, i) { dream.objectId = i })
      $deferred.resolve(self.dreamData)
    }).fail(function (err) {
      console.log('err: ', err)
      $deferred.reject()
    })
    return $deferred.promise()
  },

  getDreams: function () {
    var self = this
    fetchType = $('#my-dreams-tab').hasClass('active') ? 'forUser' : 'all'
    this.fetchDreams(fetchType).then(function (dreams) {
      self.dreamData = dreams
      environment.clearScene()
      dreamsView.populateDreamscape(dreams)
    })
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

  markDreamAsViewed: function (dream) {
    Auth.validateToken().then(function () {
      $.post(global.apiUrl + '/views', {view: {dream_id: dream.id}}).then(function () {
        dream.viewed = true
        environment.markDreamAsViewed(dream.objectId)
      })
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
