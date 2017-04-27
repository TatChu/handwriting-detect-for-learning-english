'use strict';

const mongoose = require('mongoose');
const Supplier = mongoose.model('Supplier');

module.exports = {
    getById,
}

/**
 * Middleware
 */
function getById(request, reply) {
    const id = request.params.id || request.payload.id;
    let promise = Supplier.findOne({ _id: id });
    promise.then(function (supplier) {
        reply(supplier);

    }).catch(function (err) {
        request.log(['error'], err);
        return reply.continue();
    })
}
