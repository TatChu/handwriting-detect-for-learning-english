'use strict';

const BannerController = require('./controller/banner.controller.js');
const BannerMiddleware = require('./middleware/banner.middleware.js');
const BannerValidate = require('./validate/banner.validate.js');

const AclMiddleware = require(BASE_PATH + '/app/utils/middleware/Acl.mdw.js');
const User = require('../api-user/util/user');

exports.register = function (server, options, next) {
    var configManager = server.configManager;

    server.route({
        method: 'GET',
        path: '/banner',
        handler: BannerController.getAll,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            pre: [
                { method: AclMiddleware.acl('banner', 'view') }
            ]
        }
    });

    server.route({
        method: ['POST', 'PUT'],
        path: '/banner',
        handler: BannerController.create,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            pre: [
                { method: User.getAuthUser, assign: 'getAuthUser' },
                { method: AclMiddleware.acl('banner', 'add') }
            ],
            validate: BannerValidate.save,
        }
    });

    server.route({
        method: 'POST',
        path: '/banner/{id}',
        handler: BannerController.update,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            pre: [
                { method: User.getAuthUser, assign: 'getAuthUser' },
                { method: AclMiddleware.acl('banner', 'edit') },
                { method: BannerMiddleware.getBanner('params'), assign: 'getBanner' }
            ]
        }
    });

    server.route({
        method: 'DELETE',
        path: '/banner/{id}',
        handler: BannerController.del,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            pre: [
                { method: User.getAuthUser, assign: 'getAuthUser' },
                { method: AclMiddleware.acl('banner', 'delete') },
                { method: BannerMiddleware.getBanner('params'), assign: 'getBanner' }
            ]
        }
    });

    next();
};

exports.register.attributes = {
    name: 'admin-banner'
};
