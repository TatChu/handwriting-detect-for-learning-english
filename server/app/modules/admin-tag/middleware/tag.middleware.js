'use strict';

const mongoose = require('mongoose');
const Tag = mongoose.model('Tag');

module.exports = {
    getById,
}

/**
 * Middleware
 */

function getById(request, reply) {
    const id = request.params.id || request.payload.id;
    let promise = Tag.findOne({ '_id': id });
    promise.then(function (tag) {
        reply(tag);
    }).catch(function (err) {
        request.log(['error'], err);
        return reply(err);
    })
}