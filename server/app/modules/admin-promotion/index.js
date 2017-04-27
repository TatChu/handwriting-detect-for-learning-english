'use strict';

const PromotionController = require('./controller/promotion.controller.js');
const PromotionMiddleware = require('./middleware/promotion.middleware.js');
const PromotionValidate = require('./validate/promotion.validate.js');
const User = require('../api-user/util/user');
const AclMiddleware = require(BASE_PATH + '/app/utils/middleware/Acl.mdw.js');

exports.register = function (server, options, next) {

    server.route({
        method: 'GET',
        path: '/promotion',
        handler: PromotionController.getAll,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            pre: [
                { method: AclMiddleware.acl('promotion', 'view') },
            ],
            validate: {

            },
            tags: ['api'],
            description: 'List Promotion'
        },
    });

    server.route({
        method: 'GET',
        path: '/promotion-add',
        handler: PromotionController.add,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            pre: [
                { method: AclMiddleware.acl('promotion', 'view') },
                { method: PromotionMiddleware.getAllPromotion, assign: 'getAllPromotion' },
                { method: PromotionMiddleware.getListProduct('add'), assign: 'getListProduct' }
            ],
            validate: {

            },
            tags: ['api'],
            description: 'Add Promotion'
        },
    });

    server.route({
        method: ['POST', 'PUT'],
        path: '/promotion',
        handler: PromotionController.create,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            pre: [
                { method: AclMiddleware.acl('promotion', 'add') },
                { method: PromotionMiddleware.getAllPromotion, assign: 'getAllPromotion' },
                { method: User.getAuthUser, assign: 'getAuthUser' },
            ],
            validate: PromotionValidate.save,
            tags: ['api'],
            description: 'Add Promotion'
        },
    });

    server.route({
        method: ['GET'],
        path: '/promotion/{id}',
        handler: PromotionController.edit,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            pre: [
                { method: AclMiddleware.acl('promotion', 'view') },
                { method: PromotionMiddleware.getAllPromotion, assign: 'getAllPromotion' },
                { method: PromotionMiddleware.getListProduct('edit'), assign: 'getListProduct' }
            ],
            validate: {},
            tags: ['api'],
            description: 'Edit Promotion'
        },
    });

    server.route({
        method: ['POST'],
        path: '/promotion/{id}',
        handler: PromotionController.update,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            pre: [
                { method: AclMiddleware.acl('promotion', 'edit') },
                { method: User.getAuthUser, assign: 'getAuthUser' },
                { method: PromotionMiddleware.getPromotionById('payload'), assign: 'getPromotionById' }
            ],
            validate: {},
            tags: ['api'],
            description: 'Update Promotion'
        },
    });

    server.route({
        method: ['DELETE'],
        path: '/promotion/{id}',
        handler: PromotionController.delete,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            pre: [
                { method: AclMiddleware.acl('promotion', 'delete') },
                { method: PromotionMiddleware.getPromotionById('params'), assign: 'getPromotionById' },
                { method: User.getAuthUser, assign: 'getAuthUser' },
            ],
            validate: {},
            tags: ['api'],
            description: 'Delete Promotion'
        },
    });

    next();
};

exports.register.attributes = {
    name: 'admin-promotion'
};