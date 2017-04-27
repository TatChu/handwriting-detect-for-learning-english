'use strict';

const mongoose = require('mongoose');
const Certificate = mongoose.model('Certificate');

module.exports = {
    getById,
}

/**
 * Middleware
 */

function getById(request, reply) {
    const id = request.params.id || request.payload.id;
    let promise = Certificate.findOne({ '_id': id });
    promise.then(function (certificate) {
        reply(certificate);
    }).catch(function (err) {
        request.log(['error'], err);
        return reply(err);
    });
}