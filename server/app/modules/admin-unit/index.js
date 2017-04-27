'use strict';

const UnitController = require('./controller/unit.controller.js');
const UnitValidate = require('./validate/unit.validate.js');
const UnitMiddleware = require('./middleware/unit.middleware.js');
const AclMiddleware = require(BASE_PATH + '/app/utils/middleware/Acl.mdw.js');

exports.register = function (server, options, next) {
    var configManager = server.configManager;

    server.route({
        method: 'GET',
        path: '/unit',
        handler: UnitController.getAll,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            pre: [
                { method: AclMiddleware.acl('unit', 'view') }
            ]
        }
    });
    server.route({
        method: ['GET'],
        path: '/unit/{id}',
        handler: UnitController.edit,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            pre: [
                { method: AclMiddleware.acl('unit', 'view') },
                { method: UnitMiddleware.getById, assign: 'unit' }
            ],
            validate: UnitValidate.edit
        }
    });
    server.route({
        method: ['DELETE'],
        path: '/unit/{id}',
        handler: UnitController.deleteItem,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            pre: [
                { method: AclMiddleware.acl('unit', 'delete') },
                { method: UnitMiddleware.getById, assign: 'unit' }
            ],
            validate: UnitValidate.deleteItem
        }
    });
    server.route({
        method: 'POST',
        path: '/unit',
        handler: UnitController.save,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            pre: [
                { method: AclMiddleware.acl('unit', 'add') },
            ],
            validate: UnitValidate.save
        }

    });
    server.route({
        method: ['PUT', 'POST'],
        path: '/unit/{id}',
        handler: UnitController.update,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            pre: [
                { method: AclMiddleware.acl('unit', ['edit', 'add']) },
                { method: UnitMiddleware.getById, assign: 'unit' }
            ],
            validate: UnitValidate.update
        }
    });
    next();
};

exports.register.attributes = {
    name: 'admin-unit'
};
