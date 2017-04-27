'use strict';

const TestCtrl = require('./controller/test.controller.js');

exports.register = function (server, options, next) {

    server.route({
        method: 'POST',
        path: '/resize-img',
        handler: TestCtrl.testResizeImg,
        config: {
            auth: false
        },
    });

    next();
};

exports.register.attributes = {
    name: 'admin-test'
};