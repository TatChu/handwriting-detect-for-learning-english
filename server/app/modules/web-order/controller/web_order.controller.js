'use strict';
const _ = require('lodash');
const mongoose = require('mongoose');
const Product = mongoose.model('Product');
const User = mongoose.model('User');
const Joi = require('joi');
const Order = mongoose.model('Order');
const ShippingFee = mongoose.model('ShippingFee');
const Coupon = mongoose.model('Coupon');

const orderHelper = require(BASE_PATH + '/app/modules/api-order/util/order.js');

const Boom = require('boom');
const ErrorHandler = require(BASE_PATH + '/app/utils/error.js');

module.exports = {
    viewOrder,
    orderCompeleted
};

function viewOrder(request, reply) {
    const Meta = request.server.plugins['service-meta'];
    var meta = JSON.parse(JSON.stringify(Meta.getMeta('checkout')));

    if (!request.auth.credentials) return reply.redirect('/');

    let Cart = request.server.plugins['service-cart'];
    Cart.getCart(request.auth.credentials.id).then(function (cart) {
        if (cart.items.length == 0)
            return reply.redirect('/');
        else {
            return reply.view('web-order/view/client/checkout-step-1/checkout', {
                class: { body_class: 'page-checkout checkout-mb' },
                meta,
                nameTracking: 'Checkout'
            }, { layout: 'web/layout' });
        }
    }).catch(function (err) {
        return reply.redirect('/');
    }) // end catch
}

function orderCompeleted(request, reply) {
    const Meta = request.server.plugins['service-meta'];
    var meta = JSON.parse(JSON.stringify(Meta.getMeta('checkout-success')));
    let orderID = request.params.orderID;
    if (!orderID)
        return reply.redirect('/error404');
    let order = Order.findOne({ id_order: orderID }).populate('order_detail.product').lean().exec(function (err, order) {
        if (err || !order)
            return reply.redirect('/error404');

        let Cart = request.server.plugins['service-cart'];
        Cart.deleteCart(request.auth.credentials.id).then(function (resp) {
            return reply.view('web-order/view/client/checkout-success/view',
                {
                    class: { body_class: 'page-checkout checkout-mb' },
                    order: order,
                    orderID: orderID,
                    nameTracking: 'CheckoutSuccess'
                }, {
                    layout: 'web/layout'
                })
        }).catch(function (err) {
            return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        })
    })

}