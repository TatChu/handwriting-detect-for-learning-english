'use strict';
const Boom = require('boom');
const util = require('util');
const Joi = require('joi');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const _ = require('lodash');


module.exports = {
    // login,
    resetPass
};

// function login(request, reply) {
//     let cookieOptions = request.server.configManager.get('web.cookieOptions');

//     /*Xóa token khi bị sai token*/
//     if (request.auth.error && request.auth.error.output.payload.message == 'Invalid credentials') {
//         return reply.view('admin-auth/view/login', null, { layout: 'admin/layout-admin-login' }).header("Authorization", '').unstate('token', cookieOptions);
//     }
//     if (request.auth.isAuthenticated && request.auth.credentials.scope.includes('admin')) {
//         return reply.redirect('/');
//     }

//     reply.view('admin-auth/view/login', null, { layout: 'admin/layout-admin-login' });
// }


function resetPass(request, reply) {
    let user = request.pre.userByToken;
    const Meta = request.server.plugins['service-meta'];
    var meta = JSON.parse(JSON.stringify(Meta.getMeta('user-resset-pass')));
    if (!user || user.resetPasswordExpires < Date.now()) {
        return reply.redirect('/');
    }
    return reply.view('web-auth/view/client/reset-pass/view', { data: user, meta: meta }, { layout: 'web/layout' });
}







