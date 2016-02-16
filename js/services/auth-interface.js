var $ = require('jquery')
var Auth = require('j-toker')

$.ajaxSetup({
  beforeSend: function(xhr, settings) {
    // append outbound auth headers
    $.auth.appendAuthHeaders(xhr, settings);
  }
})

Auth.configure({
  apiUrl: global.apiUrl
})

var AuthInterface = {
  user: Auth.user,

  emailSignIn: function (params) {
    return Auth.emailSignIn(params)
  },

  emailSignUp: function (params) {
    return Auth.emailSignUp(params)
  },

  validateToken: function () {
    return Auth.validateToken()
  },

  signOut: function () {
    return Auth.signOut()
  }
}

module.exports = AuthInterface
