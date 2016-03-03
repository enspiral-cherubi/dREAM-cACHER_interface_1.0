var apiUrl

switch (process.env.NODE_ENV) {
  case 'production':
    apiUrl = 'http://104.236.175.6'
    break
  case 'development':
    apiUrl = 'http://localhost:3000'
    break
}

module.exports = apiUrl
