'use strict';

const RecognitionCtrl = require('./controller/recogniton.controller.js');

exports.register = function (server, options, next) {
    server.route({
        method: 'POST',
        path: '/update-json',
        handler: RecognitionCtrl.updateJson,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            pre: [
            ]
        }
    });

    next();
};

exports.register.attributes = {
    name: 'admin-recogniton'
};