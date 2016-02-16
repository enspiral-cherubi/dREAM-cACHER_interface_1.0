global.apiUrl = process.env.NODE_ENV === 'production' ? 'http://104.236.175.6' : 'http://localhost:3000'
global.environment = require('./app/environment')

var controller = require('./app/controller')

controller.init()
controller.bindEventListeners()
