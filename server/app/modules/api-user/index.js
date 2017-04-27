'use strict';

const AuthController = require('./controller/auth.controller.js');
const AuthMiddleware = require('./middleware/auth.middleware.js');
const AuthValidate = require('./validate/auth.validate.js');
const UserHelper = require('./util/user.js');

const AclMiddleware = require(BASE_PATH + '/app/utils/middleware/Acl.mdw.js');

exports.register = function (server, options, next) {
    var configManager = server.configManager;

    server.route({
        method: 'GET',
        path: '/user',
        handler: AuthController.find,
        config: {
            auth: 'jwt',
            tags: ['api'],
            description: 'Get all users',
            pre: [{ method: AclMiddleware.acl('user', ['view']) }]
        }
    });

    server.route({
        method: 'GET',
        path: '/user/{id}',
        handler: AuthController.findOne,
        config: {
            tags: ['api'],
            description: 'Get user',
            pre: [
                { method: AuthMiddleware.getById, assign: 'user' },
                { method: AclMiddleware.acl('user', ['view']) }
            ]
        }
    });

    server.route({
        method: 'POST',
        path: '/user',
        handler: AuthController.create,
        config: {
            pre: [
                { method: AuthMiddleware.getUserByPhone, assign: 'userByPhone' }
            ],
            validate: AuthValidate.create
        }
    });

    server.route({
        method: 'PUT',
        path: '/user/{id}',
        handler: AuthController.update,
        config: {
            pre: [
                { method: AuthMiddleware.getUserByEmail, assign: 'userByEmail' },
                { method: UserHelper.getById, assign: 'user' },
                { method: UserHelper.getUserByPhone, assign: 'userByPhone' },
            ],
            validate: AuthValidate.update
        }
    });

    server.route({
        method: 'DELETE',
        path: '/user/{id}',
        handler: AuthController.destroy,
        config: {
            auth: 'jwt',
        }
    });
    server.route({
        method: 'POST',
        path: '/user/register',
        handler: AuthController.register,
        config: {
            pre: [
                { method: AuthMiddleware.getUserByEmail, assign: 'userByEmail' },
                { method: UserHelper.getUserByPhone, assign: 'userByPhone' }
            ],
        }
    });
    server.route({
        method: 'POST',
        path: '/user/login',
        handler: AuthController.login,
        config: {
            validate: AuthValidate.login
        }
    });

    server.route({
        method: ['GET', 'POST'],
        path: '/user/logout',
        handler: AuthController.logout,
        config: {
            auth: 'jwt',
        }
    });

    server.route({
        method: 'POST',
        path: '/user/verify-email',
        handler: AuthController.verifyEmail,
        config: {
            pre: [
                { method: AuthMiddleware.getUserByEmail, assign: 'userByEmail' }
            ]
        }
    });

    server.route({
        method: 'POST',
        path: '/user/active',
        handler: AuthController.active,
        config: {
            validate: AuthValidate.active,

        }
    });

    server.route({
        method: 'POST',
        path: '/user/facebook-login',
        handler: AuthController.facebookLogin,
        config: {
            pre: [
                { method: AuthMiddleware.getUserByEmail, assign: 'userByEmail' }
            ],
            validate: AuthValidate.facebookLogin
        }
    });

    server.route({
        method: 'POST',
        path: '/user/google-login',
        handler: AuthController.googleLogin
    });

    server.route({
        method: 'POST',
        path: '/user/forgot-password',
        handler: AuthController.fogotPassword,
        config: {
            validate: AuthValidate.fogotPassword,

        }
    });

    server.route({
        method: 'POST',
        path: '/user/reset-password',
        handler: AuthController.resetPassword,
        config: {
            validate: AuthValidate.resetPassword,

        }
    });

    server.route({
        method: 'POST',
        path: '/user/change-password',
        handler: AuthController.changePassword,
        config: {
            pre: [
                { method: AuthMiddleware.getAuthUser, assign: 'user' }
            ],
            validate: AuthValidate.changePassword,

        }
    });

    server.route({
        method: ['GET'],
        path: '/user/profile/{id?}',
        handler: AuthController.profile,
        config: {
            pre: [
                { method: AuthMiddleware.getAuthUser, assign: 'user' }
            ],
        }
    });

    server.route({
        method: 'PUT',
        path: '/user-favorite-product/{id}',
        handler: AuthController.updateFavoriteProduct,
        config: {
            pre: [
                { method: UserHelper.getById, assign: 'user' },
            ]
        }
    });

    // Extend
    // server.route({
    //     method: 'GET',
    //     path: '/user/saleman',
    //     handler: AuthController.findSaleman
    // });

    next();
};

exports.register.attributes = {
    name: 'api-auth'
};