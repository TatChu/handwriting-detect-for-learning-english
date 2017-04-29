'use strict';

const LearningController = require('./controller/learning.controller.js');

exports.register = function (server, options, next) {

    server.route({
        method: 'GET',
        path: '/hoc-bai',
        handler: LearningController.listUnit,
        config: {
        },
    });

    server.route({
        method: 'GET',
        path: '/hoc-bai/{unit}',
        handler: LearningController.learning,
        config: {
        },
    });
    
    next();
};

exports.register.attributes = {
    name: 'web-learning'
};
