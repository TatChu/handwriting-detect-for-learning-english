'use strict';

const BlogController = require('./controller/blog.controller.js');
const BlogValidate = require('./validate/blog.validate.js');
const BlogMiddleware = require('./middleware/blog.middleware.js');

const AclMiddleware = require(BASE_PATH + '/app/utils/middleware/Acl.mdw.js');

var Joi = require('joi');

exports.register = function (server, options, next) {
    var configManager = server.configManager;

    server.route({
        method: 'GET',
        path: '/blog',
        handler: BlogController.getAll,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            pre: [
                { method: AclMiddleware.acl('blog', 'view') }
            ]
        }
    });

    server.route({
        method: ['GET'],
        path: '/blog/{slug}',
        handler: BlogController.edit,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },

            pre: [
                { method: AclMiddleware.acl('blog', 'view') },
                { method: BlogMiddleware.getBySlug, assign: 'blog' }
            ],
            validate: BlogValidate.edit
        }
    });

    server.route({
        method: ['DELETE'],
        path: '/blog/{slug}',
        handler: BlogController.deleteItem,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },

            pre: [
                { method: AclMiddleware.acl('blog', 'delete') },
                { method: BlogMiddleware.getBySlug, assign: 'blog' }
            ],
            validate: BlogValidate.deleteItem
        }
    });

    server.route({
        method: 'POST',
        path: '/blog',
        handler: BlogController.save,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },

            pre: [
                { method: AclMiddleware.acl('blog', ['add']) },
            ],
            validate: BlogValidate.save
        }
    });

    server.route({
        method: ['PUT', 'POST'],
        path: '/blog/{slug}',
        handler: BlogController.update,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },

            pre: [
                { method: AclMiddleware.acl('blog', ['add', 'edit']) },
                { method: BlogMiddleware.getBySlug, assign: 'blog' }
            ],
            validate: BlogValidate.update
        }
    });

    server.route({
        method: ['GET'],
        path: '/blog-tag',
        handler: BlogController.getAllTag,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },

            pre: [
                { method: AclMiddleware.acl('blog', ['add', 'edit']) },
            ],
        }
    });

    next();
};

exports.register.attributes = {
    name: 'admin-blog'
};
