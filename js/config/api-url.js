var apiUrl;

if (process.env.NODE_ENV === 'production') {
  apiUrl = 'http://104.236.175.6'
} else {
  apiUrl = 'http://localhost:3000'
}

module.exports = apiUrl
