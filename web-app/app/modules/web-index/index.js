'use strict';

const IndexController = require('./controller/index.controller.js');

exports.register = function (server, options, next) {

    server.route({
        method: 'GET',
        path: '/',
        handler: IndexController.index,
        config: {
        },
    });
    next();
};

exports.register.attributes = {
    name: 'web-index'
};
