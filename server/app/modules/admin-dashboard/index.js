'use strict';

const DashboardController = require('./controller/dashboard.controller.js');
const AclMiddleware = require(BASE_PATH + '/app/utils/middleware/Acl.mdw.js');

exports.register = function (server, options, next) {
    server.route({
        method: 'GET',
        path: '/',
        handler: DashboardController.index,
        config: {
            auth: {
                strategy: 'jwt',
                // mode: 'try',
                scope: ['admin']
            },
            pre: [
                { method: AclMiddleware.acl('dashboard', '*') },
            ]
        }
    });

    server.route({
        method: 'GET',
        path: '/dashboard',
        handler: DashboardController.dashboard,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            pre: [
                { method: AclMiddleware.acl('dashboard', '*') },
            ]
        }
    });

    next();
};

exports.register.attributes = {
    name: 'admin-dashboard'
};
