'use strict';

const mongoose = require('mongoose');
const Unit = mongoose.model('Unit');

module.exports = {
    getById,
}

/**
 * Middleware
 */
function getById(request, reply) {
    const id = request.params.id || request.payload.id;
    let promise = Unit.findOne({ _id: id });
    promise.then(function (unit) {
        reply(unit);
    }).catch(function (err) {
        request.log(['error'], err);
        return reply.continue();
    })


}
