'use strict';

const UserController = require('./controller/user.controller.js');
const UserHelper = require(BASE_PATH + '/app/modules/api-user/util/user.js');
const ApiUser = require(BASE_PATH + '/app/modules/api-user/middleware/auth.middleware.js');
const UserValidate = require('./validate/user.validate.js');
const UserMiddleware = require('./middleware/user.middleware.js');
const AclMiddleware = require(BASE_PATH + '/app/utils/middleware/Acl.mdw.js');

exports.register = function (server, options, next) {

    server.route({
        method: 'POST',
        path: '/user',
        handler: UserController.create,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            pre: [
                { method: UserHelper.getUserByPhone, assign: 'userByPhone' },
                { method: ApiUser.getUserByEmail, assign: 'userByEmail' },
                { method: AclMiddleware.acl('user', ['view', 'add']) }
            ],
            validate: UserValidate.create
        }
    });

    server.route({
        method: 'PUT',
        path: '/user/{id}',
        handler: UserController.update,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            pre: [
                { method: UserHelper.getById, assign: 'user' },
                { method: ApiUser.getUserByEmail, assign: 'userByEmail' },
                { method: UserMiddleware.getRoles, assign: 'roles' },
                { method: AclMiddleware.acl('user', ['view', 'add', 'edit']) }
            ],
            validate: UserValidate.update
        }
    });

    server.route({
        method: 'GET',
        path: '/roles',
        handler: UserController.getAllRole,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            pre: [
                { method: UserMiddleware.getRoles, assign: 'roles' }
            ]
        }
    });

    next();
};

exports.register.attributes = {
    name: 'admin-user'
};