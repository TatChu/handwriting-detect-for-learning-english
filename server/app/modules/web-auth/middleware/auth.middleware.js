'use strict';

const mongoose = require('mongoose');
const User = mongoose.model('User');

module.exports = {
    getByResetPasswordToken
}

/**
 * Middleware
 */

function getByResetPasswordToken(request, reply) {
    let resetPasswordToken = request.params.token;
    let promise = User.findOne({ resetPasswordToken: resetPasswordToken });
    promise.then(function (user) {
        reply(user);

    }).catch(function (err) {
        request.log(['error'], err);
        return reply.continue();
    })
}