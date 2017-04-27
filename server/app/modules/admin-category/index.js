'use strict';

const CategoryController = require('./controller/category.controller.js');
const CategoryValidate = require('./validate/category.validate.js');
const CategoryMiddleware = require('./middleware/category.middleware.js');

const AclMiddleware = require(BASE_PATH + '/app/utils/middleware/Acl.mdw.js');


exports.register = function (server, options, next) {
    var configManager = server.configManager;

    server.route({
        method: 'GET',
        path: '/category',
        handler: CategoryController.getAll,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            pre: [
                { method: AclMiddleware.acl('category', 'view') }
            ]
        }
    });
    server.route({
        method: ['GET'],
        path: '/category/{slug}',
        handler: CategoryController.edit,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            pre: [
                { method: AclMiddleware.acl('category', 'view') },
                { method: CategoryMiddleware.getBySlug, assign: 'categories' }
            ],
            validate: CategoryValidate.edit
        }
    });
    server.route({
        method: ['GET'],
        path: '/category_id/{id}',
        handler: CategoryController.getOneById,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            pre: [
                { method: AclMiddleware.acl('category', 'view') },
                { method: CategoryMiddleware.getById, assign: 'categories' }
            ],
            validate: CategoryValidate.getOneById
        }
    });

    server.route({
        method: ['GET'],
        path: '/category_child/{parrentId}',
        handler: CategoryController.getAllChild,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            pre: [
                { method: AclMiddleware.acl('category', 'view') },
            ]
        }

    });
    server.route({
        method: ['DELETE'],
        path: '/category/{id}',
        handler: CategoryController.deleteItem,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            pre: [
                { method: AclMiddleware.acl('category', 'delete') },
                { method: CategoryMiddleware.getById, assign: 'categories' }
            ],
            validate: CategoryValidate.deleteItem
        }

    });
    server.route({
        method: 'POST',
        path: '/category',
        handler: CategoryController.save,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            pre: [
                { method: AclMiddleware.acl('category', 'add') },
            ],
            validate: CategoryValidate.save
        }
    });
    server.route({
        method: ['PUT', 'POST'],
        path: '/category/{id}',
        handler: CategoryController.update,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            pre: [
                { method: AclMiddleware.acl('category', ['edit', 'add']) },
                { method: CategoryMiddleware.getById, assign: 'categories' }
            ],
            validate: CategoryValidate.update
        }
    });
    next();
};

exports.register.attributes = {
    name: 'admin-category'
};
