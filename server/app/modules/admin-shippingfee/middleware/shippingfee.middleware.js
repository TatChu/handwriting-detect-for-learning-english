'use strict';

const mongoose = require('mongoose');
const ShippingFee = mongoose.model('ShippingFee');

module.exports = {
    getById,
}

/**
 * Middleware
 */

function getById(request, reply) {
    const id = request.params.id || request.payload.id;
    let promise = ShippingFee.findOne({ '_id': id });
    promise.then(function (shippingfee) {
        reply(shippingfee);
    }).catch(function (err) {
        request.log(['error'], err);
        return reply.continue();
    })
}