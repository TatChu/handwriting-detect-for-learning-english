'use strict';

const SearchController = require('./controller/search.controller.js');
const SearchMiddleware = require('./middleware/search.middleware.js');
const SearchValidate = require('./validate/search.validate.js');
const User = require('../api-user/util/user');
const AclMiddleware = require(BASE_PATH + '/app/utils/middleware/Acl.mdw.js');

exports.register = function (server, options, next) {

    server.route({
        method: 'GET',
        path: '/search',
        handler: SearchController.getAll,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            pre: [
                { method: AclMiddleware.acl('search', 'view') },
            ],
            validate: {

            },
            tags: ['api'],
            description: 'List Search'
        },
    });

    server.route({
        method: ['POST', 'PUT'],
        path: '/search',
        handler: SearchController.create,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            pre: [
                { method: AclMiddleware.acl('search', 'add') },
                { method: SearchMiddleware.getSearch('payload'), assign: 'getByKeyword' },
            ],
            validate: SearchValidate.save,
            tags: ['api'],
            description: 'Create Search'
        },
    });

    server.route({
        method: 'GET',
        path: '/search/{id}',
        handler: SearchController.edit,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            pre: [
                { method: AclMiddleware.acl('search', 'view') },
                { method: SearchMiddleware.getSearch('params'), assign: 'getById' },
            ],
            validate: {

            },
            tags: ['api'],
            description: 'Edit Search'
        },
    });

    server.route({
        method: 'POST',
        path: '/search/{id}',
        handler: SearchController.update,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            pre: [
                { method: AclMiddleware.acl('search', 'edit') },
                { method: SearchMiddleware.getSearch('params'), assign: 'getById' },
                { method: SearchMiddleware.getSearch('payload'), assign: 'getByKeyword' },
                { method: User.getAuthUser, assign: 'getAuthUser' }
            ],
            validate: {

            },
            tags: ['api'],
            description: 'Update Search'
        },
    });

    server.route({
        method: 'DELETE',
        path: '/search/{id}',
        handler: SearchController.del,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            pre: [
                { method: AclMiddleware.acl('search', 'delete') },
                { method: SearchMiddleware.getSearch('params'), assign: 'getById' },
                { method: User.getAuthUser, assign: 'getAuthUser' }
            ],
            validate: {

            },
            tags: ['api'],
            description: 'Delete Search'
        },
    });

    server.route({
        method: 'GET',
        path: '/search-active/{id}',
        handler: SearchController.active,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            pre: [
                { method: AclMiddleware.acl('search', 'update') },
                { method: SearchMiddleware.getSearch('params'), assign: 'getById' },
                { method: User.getAuthUser, assign: 'getAuthUser' }
            ],
            validate: {

            },
            tags: ['api'],
            description: 'Active/Unactive search'
        },
    });

    next();
};

exports.register.attributes = {
    name: 'admin-search'
};