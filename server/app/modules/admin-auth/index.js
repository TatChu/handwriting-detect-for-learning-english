'use strict';

const AuthController = require('./controller/auth.controller.js');

exports.register = function (server, options, next) {

    server.route({
        method: 'GET',
        path: '/signin',
        handler: AuthController.login,
        config: {
            auth: {
                strategy: 'jwt',
                mode: 'try',
                scope: ['super-admin', 'admin', 'guest', 'user', 'student']
            }
        }
    });

    next();
};

exports.register.attributes = {
    name: 'admin-auth'
};
