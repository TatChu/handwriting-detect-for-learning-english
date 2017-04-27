'use strict';

const mongoose = require('mongoose');
const Coupon = mongoose.model('Coupon');

module.exports = {
    getById,
    getCouponByCode,
}

/**
 * Middleware
 */

function getById(request, reply) {
    const id = request.params.id || request.payload.id;
    let promise = Coupon.findOne({ '_id': id });
    promise.then(function (coupon) {
        reply(coupon);
    }).catch(function (err) {
        request.log(['error'], err);
        return reply(err);
    })
}

function getCouponByCode(request, reply) {
    const code = request.params.code || request.payload.code;

    Coupon.findOne({
        code: code
    }, function (err, coupon) {
        if (err) {
            request.log(['error'], err);
        }
        return reply(coupon);
    });
}