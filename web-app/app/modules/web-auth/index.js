'use strict';

const AuthController = require('./controller/auth.controller.js');
const AuthMiddleware = require('./middleware/auth.middleware.js');

exports.register = function (server, options, next) {
    // server.route({
    //     method: 'GET',
    //     path: '/signin',
    //     handler: AuthController.login,
    //     config: {
    //         // auth: {
    //         //     strategy: 'jwt',
    //         //     mode: 'try',
    //         //     scope: ['super-admin', 'admin', 'guest']
    //         // },
    //     }
    // });
    server.route({
        method: 'GET',
        path: '/hoc-vien/dat-lai-mat-khau/{token}',
        handler: AuthController.resetPass,
        config: {
            pre: [
                { method: AuthMiddleware.getByResetPasswordToken, assign: 'userByToken' }
            ]
        }
    });

    next();
};

exports.register.attributes = {
    name: 'admin-auth'
};
