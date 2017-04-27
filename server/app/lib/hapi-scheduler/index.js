'use strict'
var kue = require('kue-scheduler');


exports.register = function (server, options, next) {

    const config = server.configManager;
    var settings = config.get('web.redisOptions');
    var KueScheduler = kue.createQueue({prefix: 'q',redis:  settings});
    server.decorate('server', 'KueScheduler', KueScheduler);
    server.decorate('request', 'KueScheduler', KueScheduler);
    server.expose('KueScheduler', KueScheduler);
    
    next();

}
exports.register.attributes = {
    name: 'hapi-kuescheduler'
};
