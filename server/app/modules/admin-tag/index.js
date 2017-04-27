'use strict';

const TagController = require('./controller/tag.controller.js');
const TagMiddleware = require('./middleware/tag.middleware.js');
const TagValidate = require('./validate/tag.validate.js');

const AclMiddleware = require(BASE_PATH + '/app/utils/middleware/Acl.mdw.js');

exports.register = function(server, options, next) {
    var configManager = server.configManager;

    server.route({
        method: 'GET',
        path: '/tag',
        handler: TagController.getAll,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            pre:[
                { method: AclMiddleware.acl('tag','view') }
            ]
        }
    });
    server.route({
        method: ['GET'],
        path: '/tag/{id}',
        handler: TagController.edit,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            pre: [
                { method: AclMiddleware.acl('tag','view') },
                { method: TagMiddleware.getById, assign: 'tag' }
            ]
        }

    });
    server.route({
        method: ['DELETE'],
        path: '/tag/{id}',
        handler: TagController.del,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            pre: [
                { method: AclMiddleware.acl('tag','delete') },
                { method: TagMiddleware.getById, assign: 'tag' }
            ]
        }
    });
    server.route({
        method: 'POST',
        path: '/tag',
        handler: TagController.save,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            pre: [
                { method: AclMiddleware.acl('tag','add') }
            ],
            validate : TagValidate.save
        }

    });
    server.route({
        method: ['PUT'],
        path: '/tag/{id}',
        handler: TagController.update,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            pre: [
                { method: AclMiddleware.acl('tag', ['edit', 'add']) },
                { method: TagMiddleware.getById, assign: 'tag' }
            ],
            validate : TagValidate.update
        }

    });
    
    server.route({
        method: ['GET'],
        path: '/product/{id}',
        handler: TagController.getProductById,
    });

    server.route({
        method: ['GET'],
        path: '/tagProduct/{id}/{type}',
        handler: TagController.getProductByTag,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            pre: [
                { method: AclMiddleware.acl('tag','view') },
            ]
        }
    });

    
    server.route({
        method: ['GET'],
        path: '/listProduct/{id}/{type}',
        handler: TagController.listProduct,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            pre: [
                { method: AclMiddleware.acl('tag','view') },
            ]
        }
        
    });
    next();
};

exports.register.attributes = {
    name: 'admin-tag'
};