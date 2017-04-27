'use strict';
const apiOrderCtrl = require('./controller/api_order.controller.js');
const apiOrderMiddleware = require('./middleware/api_order.middleware.js');

exports.register = function (server, options, next) {

    // submit order
    server.route({
        method: 'POST',
        path: '/order',
        handler: apiOrderCtrl.completeOrder,
        config: {
            pre: [
                { method: apiOrderMiddleware.createOrder, assign: 'order' }
            ]
        }
    });

    // add or set quantity product cart
    server.route({
        method: 'GET',
        path: '/order/set-quantity/{product}/{quantity}',
        handler: apiOrderCtrl.setQuantity
    });

    // delete product in cart
    server.route({
        method: ['DELETE', 'GET'],
        path: '/order/delete-product/{product}',
        handler: apiOrderCtrl.deleteProductInCart
    });

    // remove cart
    server.route({
        method: ['DELETE', 'GET'],
        path: '/order/delete-cart',
        handler: apiOrderCtrl.deleteCart
    });

    // check apply coupon
    server.route({
        method: ['GET', 'POST'],
        path: '/order/apply-coupon/{coupon}',
        handler: apiOrderCtrl.applyCoupon,
        config: {
            pre: [
                { method: apiOrderMiddleware.createOrder, assign: 'order' }
            ]
        }
    });

    // get list shipping fee
    server.route({
        method: ['GET'],
        path: '/order/list-shiping-fee',
        handler: apiOrderCtrl.getListShippingFee
    });

    server.route({
        method: ['GET'],
        path: '/order/shiping-address-user',
        handler: apiOrderCtrl.getListShippingAddress
    });

    // get cart currently
    server.route({
        method: ['GET'],
        path: '/order/cart',
        handler: apiOrderCtrl.getCart
    });

    server.route({
        method: ['GET'],
        path: '/order/{product_id}/{quantity}',
        handler: apiOrderCtrl.addProductToCart
    });

    server.route({
        method: ['GET'],
        path: '/order/is-first-order/{userId}',
        handler: apiOrderCtrl.checkFirstOrderOfUser
    });

    server.route({
        method: ['GET'],
        path: '/order/config-text',
        handler: apiOrderCtrl.getConfigTextOrder
    });

    server.route({
        method: ['GET'],
        path: '/order/config-free-ship',
        handler: apiOrderCtrl.getConfigFreeShip
    });

    server.route({
        method: ['GET'],
        path: '/order/cf-order-affternoon',
        handler: apiOrderCtrl.cfOrderAffernoon
    });


    next();
};

exports.register.attributes = {
    name: 'api-order'
};