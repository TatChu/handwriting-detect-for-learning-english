'use strict';

const UnitController = require('./controller/vocabulary.controller.js');
const UnitValidate = require('./validate/vocabulary.validate.js');
const UnitMiddleware = require('./middleware/vocabulary.middleware.js');
const AclMiddleware = require(BASE_PATH + '/app/utils/middleware/Acl.mdw.js');

exports.register = function (server, options, next) {
    var configManager = server.configManager;

    server.route({
        method: 'GET',
        path: '/vocabulary',
        handler: UnitController.getAll,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            pre: [
                { method: AclMiddleware.acl('vocabulary', 'view') }
            ]
        }
    });
    server.route({
        method: ['GET'],
        path: '/vocabulary/{id}',
        handler: UnitController.edit,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            pre: [
                { method: AclMiddleware.acl('vocabulary', 'view') },
                { method: UnitMiddleware.getById, assign: 'vocabulary' }
            ],
            validate: UnitValidate.edit
        }
    });
    server.route({
        method: ['DELETE'],
        path: '/vocabulary/{id}',
        handler: UnitController.deleteItem,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            pre: [
                { method: AclMiddleware.acl('vocabulary', 'delete') },
                { method: UnitMiddleware.getById, assign: 'vocabulary' }
            ],
            validate: UnitValidate.deleteItem
        }
    });
    server.route({
        method: 'POST',
        path: '/vocabulary',
        handler: UnitController.save,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            pre: [
                { method: AclMiddleware.acl('vocabulary', 'add') },
            ],
            validate: UnitValidate.update
        }

    });
    server.route({
        method: ['PUT', 'POST'],
        path: '/vocabulary/{id}',
        handler: UnitController.update,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            pre: [
                { method: AclMiddleware.acl('vocabulary', ['edit', 'add']) },
                { method: UnitMiddleware.getById, assign: 'vocabulary' }
            ],
            validate: UnitValidate.update
        }
    });

    server.route({
        method: ['GET'],
        path: '/unit-by-class/{classes}',
        handler: UnitController.getUnitsByClasses,
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
    name: 'admin-vocabulary'
};
