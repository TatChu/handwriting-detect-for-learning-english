'use strict';
const Boom = require('boom');
const util = require('util');
const Joi = require('joi');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Order = mongoose.model('Order');
const _ = require('lodash');

module.exports = {
    info,
    favoriteProduct,
    recognitionMyData,
    order,
    changePass
};

function info(request, reply) {
    const Meta = request.server.plugins['service-meta'];
    var meta = JSON.parse(JSON.stringify(Meta.getMeta('user-info')));
    let uid = request.auth.credentials.uid;

    if (!uid) {
        return reply.redirect('/');
    }
    let promise = User.findOne({ _id: uid });
    promise.then(function (user) {
        return reply.view('web-user/view/client/info/view', { data: user, meta: meta }, { layout: 'web/layout' });
    });

}


function favoriteProduct(request, reply) {
    let uid = request.auth.credentials.uid;
    const Meta = request.server.plugins['service-meta'];
    var meta = JSON.parse(JSON.stringify(Meta.getMeta('user-note')));
    if (!uid) {
        return reply.redirect('/');
    }
    let promise = User.findOne({ _id: uid }).populate({
        path: 'favorite_product',
        populate: [
            {
                path: 'id_promotion'
            }
        ]
    });
    promise.then(function (user) {
        return reply.view('web-user/view/client/favorite-product/view', { data: user.favorite_product, meta: meta }, { layout: 'web/layout' });
    });
}


function recognitionMyData(request, reply) {
    let uid = request.auth.credentials.uid;
    const Meta = request.server.plugins['service-meta'];
    var meta = JSON.parse(JSON.stringify(Meta.getMeta('user-recognition')));
    if (!uid) {
        return reply.redirect('/');
    }
    let userFolder = request.pre.userFolder;
    let promise = User.findOne({ _id: uid }).populate('customer.shipping_address.id_shipping_fee');
    promise.then(function (user) {
        return reply.view('web-user/view/client/recognition/recognition', { userFolder, meta: meta }, { layout: 'web/layout' });
    });
}


function order(request, reply) {
    let uid = request.auth.credentials.uid;
    const Meta = request.server.plugins['service-meta'];
    var meta = JSON.parse(JSON.stringify(Meta.getMeta('user-order')));
    if (!uid) {
        return reply.redirect('/');
    }
    let promise = Order.find({
        'payment_info.info.user_id': {
            $in: [uid]
        }
    }).sort('-id_order').populate('order_detail.product');
    promise.then(function (order) {
        return reply.view('web-user/view/client/order/view', { data: order, meta: meta }, { layout: 'web/layout' });
    });
}


function changePass(request, reply) {
    let uid = request.auth.credentials.uid;
    const Meta = request.server.plugins['service-meta'];
    var meta = JSON.parse(JSON.stringify(Meta.getMeta('user-change-pass')));
    if (!uid) {
        return reply.redirect('/');
    }
    let promise = User.findOne({ _id: uid });
    promise.then(function (user) {
        return reply.view('web-user/view/client/change-pass/view', { data: "", meta: meta }, { layout: 'web/layout' });
    });
}
