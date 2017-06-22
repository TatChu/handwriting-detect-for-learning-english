'use strict';

const PermissionCtrl = require('./controller/permission.controller.js');
const PermissionValidate = require('./validate/permission.validate.js');
const AclMiddleware = require(BASE_PATH + '/app/utils/middleware/Acl.mdw.js');

exports.register = function (server, options, next) {

    server.route({
        method: 'POST',
        path: '/permission',
        handler: PermissionCtrl.create,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            validate: PermissionValidate.create
        }
    });

    server.route({
        method: 'GET',
        path: '/permission',
        handler: PermissionCtrl.getAll,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
        }
    });

    server.route({
        method: 'DELETE',
        path: '/delete-role/{role}',
        handler: PermissionCtrl.removeRole,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
        }
    });

    server.route({
        method: 'DELETE',
        path: '/delete-resource/{role}/{resource}',
        handler: PermissionCtrl.removeResource,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
        }
    });

    server.route({
        method: 'PUT',
        path: '/permission/{role}/{resource}',
        handler: PermissionCtrl.updatePermission,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
        }
    });

    server.route({
        method: 'GET',
        path: '/resources/{role}',
        handler: PermissionCtrl.getResourceRole,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
        }
    });

    server.route({
        method: 'PUT',
        path: '/add-resource/{role}',
        handler: PermissionCtrl.addResource,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
        }
    });

    next();
};

exports.register.attributes = {
    name: 'admin-permission'
};
