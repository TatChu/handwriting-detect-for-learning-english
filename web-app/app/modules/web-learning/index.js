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
    
    server.route({
        method: 'GET',
        path: '/hoc-bai/luyen-tu-vung-dang-1',
        handler: LearningController.exercise_1,
        config: {
        },
    });


server.route({
        method: 'GET',
        path: '/hoc-bai/luyen-tap-mau-cau/{unit}',
        handler: LearningController.exercise_2,
        config: {
        },
    });

    next();
};

exports.register.attributes = {
    name: 'web-learning'
};
