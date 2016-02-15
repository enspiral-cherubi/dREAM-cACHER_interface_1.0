$.ajaxSetup({
  beforeSend: function(xhr, settings) {
    // append outbound auth headers
    $.auth.appendAuthHeaders(xhr, settings);
  }
});

$.auth.configure({
  apiUrl: 'http://104.236.175.6'
});
