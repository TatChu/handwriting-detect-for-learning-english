'use strict';

const AuditLogController = require('./controller/audit_log.controller.js');
const User = require('../api-user/util/user');
const AclMiddleware = require(BASE_PATH + '/app/utils/middleware/Acl.mdw.js');

exports.register = function (server, options, next) {

    server.route({
        method: 'GET',
        path: '/log',
        handler: AuditLogController.getAll,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            tags: ['api'],
        },
    });

    next();
};

exports.register.attributes = {
    name: 'admin-log'
};