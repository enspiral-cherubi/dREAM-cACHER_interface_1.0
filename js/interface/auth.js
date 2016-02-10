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

// window.location function to change url.... query params, clear them out.
// broadcasting libriry. pusbsub, jtoker


PubSub.subscribe('auth.oAuthSignIn.success', function(ev, msg) {
  alert('Welcome' + $.auth.user.name + '!');
});
