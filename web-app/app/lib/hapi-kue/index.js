'use strict'
var kue = require('kue-scheduler');

let internals = {};
var queue;

exports.register = function (server, options, next) {

    const config = server.configManager;
    var settings = config.get('web.redisOptions');
    var queue = kue.createQueue({ prefix: 'q', redis: settings });
    server.decorate('server', 'kue', queue);
    server.decorate('request', 'kue', queue);
    server.expose('queue', queue);

    server.expose('createJob', function (jobName, data, callback) {
        var job = queue.create(jobName, data).save(callback);
        return job;
    });
    server.expose('processJob', function (jobName, callback) {
        if (queue) {
            queue.process(jobName, callback);
        }

    });

    next();

}
exports.register.attributes = {
    name: 'hapi-kue'
};