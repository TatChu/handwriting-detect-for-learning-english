'use strict';

const RecognitionController = require('./controller/recognition.controller.js');

exports.register = function (server, options, next) {

    server.route({
        method: 'POST',
        path: '/recognition',
        handler: RecognitionController.recognition,
        config: {
        },
    });

    server.route({
        method: 'POST',
        path: '/process-img',
        handler: RecognitionController.processImg,
        config: {
        },
    });

     server.route({
        method: 'POST',
        path: '/auto-crop-img',
        handler: RecognitionController.autoCropImg,
        config: {
        },
    });

    next();
};

exports.register.attributes = {
    name: 'api-recognition'
};
