'use strict';

const mongoose = require('mongoose');
const ShippingFee = mongoose.model('ShippingFee');

module.exports = {
    getAllShipping
}

/**
 * Middleware
 */



function getAllShipping (request, reply) {
    let promise = ShippingFee.find({});
    promise.then(function (shippingfee) {
        reply(shippingfee);
    }).catch(function (err) {
        request.log(['error'], err);
        return reply.continue();
    })
}