'use strict';

const SupplierController = require('./controller/supplier.controller.js');
const SupplierValidate = require('./validate/supplier.validate.js');
const SupplierMiddleware = require('./middleware/supplier.middleware.js');
const AclMiddleware = require(BASE_PATH + '/app/utils/middleware/Acl.mdw.js');

exports.register = function (server, options, next) {
    var configManager = server.configManager;

    server.route({
        method: 'GET',
        path: '/supplier',
        handler: SupplierController.getAll,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            pre: [
                { method: AclMiddleware.acl('supplier', 'view') }
            ]
        }
    });
    server.route({
        method: ['GET'],
        path: '/supplier/{id}',
        handler: SupplierController.edit,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            pre: [
                { method: AclMiddleware.acl('supplier', 'view') },
                { method: SupplierMiddleware.getById, assign: 'supplier' }
            ],
            validate: SupplierValidate.edit
        }

    });
    server.route({
        method: ['DELETE'],
        path: '/supplier/{id}',
        handler: SupplierController.deleteItem,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            pre: [
                { method: AclMiddleware.acl('supplier', 'delete') },
                { method: SupplierMiddleware.getById, assign: 'supplier' }
            ],
            validate: SupplierValidate.deleteItem
        }
    });
    server.route({
        method: 'POST',
        path: '/supplier',
        handler: SupplierController.save,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            pre: [
                { method: AclMiddleware.acl('supplier', 'add') },
            ],
            validate: SupplierValidate.save
        }

    });
    server.route({
        method: ['PUT', 'POST'],
        path: '/supplier/{id}',
        handler: SupplierController.update,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            pre: [
                { method: AclMiddleware.acl('supplier', ['edit', 'add']) },
                { method: SupplierMiddleware.getById, assign: 'supplier' }
            ],
            validate: SupplierValidate.update
        }
    });
    next();
};

exports.register.attributes = {
    name: 'admin-supplier'
};
