$.ajaxSetup({
    beforeSend: function(xhr, settings) {
      // append outbound auth headers
      $.auth.appendAuthHeaders(xhr, settings);
    }
});

// $.auth.configure({
//   apiUrl: 'http://localhost:3000'
// });


$.auth.configure({
  apiUrl: 'http://localhost:3000',
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
