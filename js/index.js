require('./config')
global.environment = require('./app/environment')

var controller = require('./app/controller')
controller.init()
controller.bindEventListeners()
