$.ajaxSetup({
    beforeSend: function(xhr, settings) {
      // append outbound auth headers
      $.auth.appendAuthHeaders(xhr, settings);
    }
});

// $.auth.configure({
//   apiUrl: 'http://104.236.175.6'
// });


$.auth.configure({
  apiUrl: 'http://104.236.175.6',
  forceHardRedirect: true,
  authProviderPaths: {
    facebook: '/auth/facebook' // <-- note that this is different than what was set with github
  }
});
