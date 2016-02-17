var $ = require('jquery')
var Auth = require('j-toker')

module.exports = function (apiUrl) {
  $.ajaxSetup({
    beforeSend: function(xhr, settings) {
      Auth.appendAuthHeaders(xhr, settings);
    }
  })

  Auth.configure({
    apiUrl: apiUrl
  })

  return Auth
  // return {
  //   emailSignUp: function (formParams) {
  //     Auth.emailSignUp(formParams).then()
  //   }
  // }
}
