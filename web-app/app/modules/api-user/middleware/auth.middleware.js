'use strict';

const mongoose = require('mongoose');
const User = mongoose.model('User');

module.exports = {
    getAuthUser,
    getById,
    getUserByEmail,
    getUserByPhone
}

/**
 * Middleware
 */

function getAuthUser(request, reply) {
    let id = request.auth.credentials.uid;
    let promise = User.findOne({ '_id': id }).populate('customer.shipping_address.id_shipping_fee');

    return promise.then(function (user) {
        return reply(user);
    }).catch(function (err) {
        return reply.continue();
    })
}

function getById(request, reply) {
    const id = request.params.id || request.payload.id;
    let promise = User.findOne({ '_id': id }).populate('customer.shipping_address.id_shipping_fee');

    return promise.then(function (user) {
        let acl = request.acl;
        return acl.userRoles('' + user._id, function (err, roles) {
            user = user.toObject();
            user.roles = roles;
            return reply(user);
        })
    }).catch(function (err) {
        request.log(['error'], err);
        return reply.continue();
    })
}

function getUserByEmail(request, reply) {
    const email = request.payload.email;
    let acl = request.acl;
    User.findOne({
        email: email
    }, function (err, user) {
        if (err) {
            request.log(['error'], err);
        }
        return reply(user);
    });
}

function getUserByPhone(request, reply) {
    const phone = request.payload.phone;
    let acl = request.acl;

    User.findOne({
        phone: phone
    }, function (err, user) {
        if (err) {
            request.log(['error'], err);
        }
        acl.userRoles('' + user._id, function (err, roles) {
            user = user.toObject();
            user.roles = roles;
            return reply(user);
        })
    });
}