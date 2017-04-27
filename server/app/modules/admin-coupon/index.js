'use strict';

const CouponController = require('./controller/coupon.controller.js');
const CouponMiddleware = require('./middleware/coupon.middleware.js');
const CouponValidate = require('./validate/coupon.validate.js');

const AclMiddleware = require(BASE_PATH + '/app/utils/middleware/Acl.mdw.js');

exports.register = function (server, options, next) {
    var configManager = server.configManager;

    server.route({
        method: 'GET',
        path: '/coupon',
        handler: CouponController.getAll,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            pre: [
                { method: AclMiddleware.acl('coupon', 'view') },
            ],
        }
    });

    server.route({
        method: ['GET'],
        path: '/coupon/{id}',
        handler: CouponController.edit,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            pre: [
                { method: AclMiddleware.acl('coupon', 'view') },
                { method: CouponMiddleware.getById, assign: 'coupon' }
            ],
            validate: CouponValidate.edit
        }
    });

    server.route({
        method: ['GET'],
        path: '/coupon-code/{code}',
        handler: CouponController.getByCode,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            pre: [
                { method: AclMiddleware.acl('coupon', 'view') },
                { method: CouponMiddleware.getCouponByCode, assign: 'couponByCode' },
            ]
        }
    });

    server.route({
        method: ['DELETE'],
        path: '/coupon/{id}',
        handler: CouponController.del,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            pre: [
                { method: AclMiddleware.acl('coupon', 'delete') },
                { method: CouponMiddleware.getById, assign: 'coupon' }
            ]
        }
    });
    server.route({
        method: 'POST',
        path: '/coupon',
        handler: CouponController.save,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            pre: [
                { method: AclMiddleware.acl('coupon', 'add') },
                { method: CouponMiddleware.getCouponByCode, assign: 'couponByCode' },
            ],
            validate: CouponValidate.save
        }
    });
    server.route({
        method: ['PUT'],
        path: '/coupon/{id}',
        handler: CouponController.update,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            pre: [
                { method: AclMiddleware.acl('coupon', ['edit', 'add']) },
                { method: CouponMiddleware.getById, assign: 'coupon' },
                { method: CouponMiddleware.getCouponByCode, assign: 'couponByCode' },
            ],
            validate: CouponValidate.update
        }
    });
    next();
};

exports.register.attributes = {
    name: 'admin-coupon'
};