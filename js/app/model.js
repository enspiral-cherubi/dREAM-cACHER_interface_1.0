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
      dreamsView.showLoginError()
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

  getDreams: function (fetchType) {
    var self = this
    this.fetchDreams(fetchType).then(function () {
      self.fetchViews().always(function () {
        environment.clearScene()
        dreamsView.populateDreamscape(self.dreamData)
      })
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
      fetchType = $('#my-dreams-tab').hasClass('active') ? 'forUser' : 'all'
      self.getDreams(fetchType)
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

  // private

  pathForFetchType: function (fetchType) {
    if (typeof fetchType === 'object' && fetchType.tag) {
      return '/tag/dreams?tag=' + fetchType.tag
    } else if (fetchType === 'forUser') {
      return '/user/dreams'
    } else {
      return '/dreams'
    }
  },

  fetchViews: function () {
    var self = this
    var $deferred = $.Deferred()
    $.get(global.apiUrl + '/views').then(function (views) {
      var orderedViewData = {}
      views.forEach(function (view) { orderedViewData[view.dream_id] = view })
      self.dreamData.forEach(function (dream) {
        if (orderedViewData[dream.id]) { dream.viewed = true }
      })
      $deferred.resolve()
    }).fail(function (err) {
      console.log('err: ', err)
      $deferred.reject()
    })
    return $deferred.promise()
  },

  fetchDreams: function (fetchType) {
    var self = this
    var $deferred = $.Deferred()

    var apiPath = this.pathForFetchType(fetchType)
    $.get(global.apiUrl + apiPath).then(function (dreams) {
      self.dreamData = dreams
      self.dreamData.forEach(function (dream, i) { dream.objectId = i })
      $deferred.resolve()
    }).fail(function (err) {
      console.log('err: ', err)
      $deferred.reject()
    })
    return $deferred.promise()
  }
}

module.exports = dreamsModel
