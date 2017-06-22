'use strict';

const mongoose = require('mongoose');
const Config = mongoose.model('Config');

module.exports = {
    getById,
}

/**
 * Middleware
 */
function getById(request, reply) {
    const id = request.params.id || request.payload.id;
    let promise = Config.findOne({ _id: id });
    promise.then(function (config) {
        reply(config);

    }).catch(function (err) {
        request.log(['error'], err);
        return reply.continue();
    })


}
