'use strict';

const OrderController = require('./controller/order.controller.js');
const OrderMiddleware = require('./middleware/order.middleware.js');
const OrderValidate = require('./validate/order.validate.js');
const User = require('../api-user/util/user');
const AclMiddleware = require(BASE_PATH + '/app/utils/middleware/Acl.mdw.js');

exports.register = function (server, options, next) {

    server.route({
        method: 'GET',
        path: '/order',
        handler: OrderController.getAll,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            pre: [
                { method: AclMiddleware.acl('order', ['view', 'export']) },
                { method: OrderMiddleware.getListCoupon, assign: 'getListCoupon' },
            ],
            validate: {

            },
            tags: ['api'],
            description: 'List Order'
        },
    });

    server.route({
        method: 'GET',
        path: '/order-add',
        handler: OrderController.add,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            pre: [
                { method: AclMiddleware.acl('order', 'view') },
                { method: OrderMiddleware.getListShippingFee, assign: 'getListShippingFee' },
                { method: OrderMiddleware.getListProduct({ qty_in_stock: { $gt: 0 } }), assign: 'getListProduct' },
                { method: OrderMiddleware.getListUser, assign: 'getListUser' },
                { method: OrderMiddleware.getListCoupon, assign: 'getListCoupon' },
                { method: OrderMiddleware.getConfig({ name: 'onSale_order_NT' }), assign: 'getConfigNT' },
                { method: OrderMiddleware.getConfig({ name: 'onSale_order_NGT' }), assign: 'getConfigNGT' },
                { method: OrderMiddleware.getConfig({ name: 'onSale_order_BC' }), assign: 'getConfigBC' },
                { method: OrderMiddleware.getConfig({ name: 'onSale_order_DT' }), assign: 'getConfigDT' },
                { method: OrderMiddleware.getConfig({ name: 'onSale_order_DT' }), assign: 'getConfigDT' },
            ],
            validate: {

            },
            tags: ['api'],
            description: 'Add Order'
        },
    });

    server.route({
        method: ['PUT', 'POST'],
        path: '/order',
        handler: OrderController.create,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            pre: [
                { method: AclMiddleware.acl('order', 'add') },
                { method: User.getAuthUser, assign: 'getAuthUser' },
                { method: OrderMiddleware.getConfig({ name: 'onSale_order_DT' }), assign: 'getConfigDT' },
            ],
            validate: OrderValidate.save,
            tags: ['api'],
            description: 'Create Order'
        },
    });

    server.route({
        method: 'GET',
        path: '/order/{id}',
        handler: OrderController.edit,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            pre: [
                { method: AclMiddleware.acl('order', 'view') },
                { method: OrderMiddleware.getListShippingFee, assign: 'getListShippingFee' },
                { method: OrderMiddleware.getListProduct(), assign: 'getListProduct' },
                { method: OrderMiddleware.getListUser, assign: 'getListUser' },
                { method: OrderMiddleware.getListCoupon, assign: 'getListCoupon' },
            ],
            validate: {

            },
            tags: ['api'],
            description: 'Get Order'
        },
    });

    server.route({
        method: 'POST',
        path: '/order/{id}',
        handler: OrderController.update,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            pre: [
                { method: AclMiddleware.acl('order', 'edit') },
                { method: User.getAuthUser, assign: 'getAuthUser' },
                { method: OrderMiddleware.getOrderById('payload'), assign: 'getOrderById' },
            ],
            validate: {

            },
            tags: ['api'],
            description: 'Update Order'
        },
    });

    server.route({
        method: 'DELETE',
        path: '/order/{id}',
        handler: OrderController.delete,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            pre: [
                { method: AclMiddleware.acl('order', 'delete') },
                { method: User.getAuthUser, assign: 'getAuthUser' },
                { method: OrderMiddleware.getOrderById('params'), assign: 'getOrderById' }
            ],
            validate: {

            },
            tags: ['api'],
            description: 'Delete Order'
        },
    });


    server.route({
        method: 'GET',
        path: '/order/{userId}-{orderId}',
        handler: OrderController.isFirstOrder,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            pre: [
                { method: AclMiddleware.acl('order', 'view') },
            ],
            validate: {

            },
            tags: ['api'],
            description: 'Check order is first order or not'
        },
    });

    server.route({
        method: 'POST',
        path: '/check-coupon/{coupon}',
        handler: OrderController.checkCoupon,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            tags: ['api'],
            description: 'Check Order coupon'
        },
    });

    server.route({
        method: 'GET',
        path: '/is-first-order/{user_id}',
        handler: OrderController.isFirstOrderCreate,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            tags: ['api'],
            description: 'Check Order coupon'
        },
    });
    next();
};

exports.register.attributes = {
    name: 'admin-order'
};