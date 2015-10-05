$.ajaxSetup({
    beforeSend: function(xhr, settings) {
      // append outbound auth headers
      $.auth.appendAuthHeaders(xhr, settings);
    }
});

$.auth.configure({
  apiUrl: 'http://localhost:3000'
});


