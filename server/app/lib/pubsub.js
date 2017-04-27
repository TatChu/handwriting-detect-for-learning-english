'use strict'

const ascoltatori = require('ascoltatori');

exports.register = function (server, options, next) {
    var configManager = server.configManager;
    var settings = {
        type: 'mongo',
        url: configManager.get('web.db.uri'),
        pubsubCollection: configManager.get('web.db.prefixCollection')+'pubsub',
        mongo: configManager.get('web.db.options') // mongo specific options
    };

    ascoltatori.build(settings, function (err, ascoltatore) {
        server.expose('pubsub', ascoltatore);
        return next();
    });
};

exports.register.attributes = {
    name: 'app-pubsub'
};