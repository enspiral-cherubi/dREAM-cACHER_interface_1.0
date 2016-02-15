global.environment = require('./interface/environment')

var controller = require('./mvc/controller')

controller.init()
controller.bindEventListeners()
