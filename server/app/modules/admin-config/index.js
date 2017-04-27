'use strict';

const ConfigController = require('./controller/config.controller.js');
const ConfigValidate = require('./validate/config.validate.js');
const ConfigMiddleware = require('./middleware/config.middleware.js');
const AclMiddleware = require(BASE_PATH + '/app/utils/middleware/Acl.mdw.js');

exports.register = function (server, options, next) {
    var configManager = server.configManager;

    server.route({
        method: 'GET',
        path: '/config',
        handler: ConfigController.getAll,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            pre: [
                { method: AclMiddleware.acl('config', 'view') }
            ]
        }
    });

    server.route({
        method: ['GET'],
        path: '/config/{id}',
        handler: ConfigController.edit,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            pre: [
                { method: AclMiddleware.acl('config', 'view') },
                { method: ConfigMiddleware.getById, assign: 'config' }
            ],
            validate: ConfigValidate.edit
        }
    });

    server.route({
        method: ['DELETE'],
        path: '/config/{id}',
        handler: ConfigController.deleteItem,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            pre: [
                { method: AclMiddleware.acl('config', 'delete') },
                { method: ConfigMiddleware.getById, assign: 'config' }
            ],
            validate: ConfigValidate.deleteItem
        }
    });

    server.route({
        method: 'POST',
        path: '/config',
        handler: ConfigController.save,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            pre: [
                { method: AclMiddleware.acl('config', 'add') },
            ],
            validate: ConfigValidate.save
        }
    });
    server.route({
        method: ['PUT', 'POST'],
        path: '/config/{id}',
        handler: ConfigController.update,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            pre: [
                { method: AclMiddleware.acl('config', ['edit', 'add']) },
                { method: ConfigMiddleware.getById, assign: 'config' }
            ],
            validate: ConfigValidate.update
        }
    });

    server.route({
        method: ['GET'],
        path: '/configs',
        handler: ConfigController.getConfigsCustom,
    });
    next();
};

exports.register.attributes = {
    name: 'admin-config'
};
