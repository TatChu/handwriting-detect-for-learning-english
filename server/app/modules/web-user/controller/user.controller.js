'use strict';
const Boom = require('boom');
const util = require('util');
const Joi = require('joi');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const _ = require('lodash');

module.exports = {
    info,
    recognitionMyData,
    changePass,
    favoriteUnit
};

function info(request, reply) {
    const Meta = request.server.plugins['service-meta'];
    var meta = JSON.parse(JSON.stringify(Meta.getMeta('user-info')));
    let uid = request.auth.credentials.uid;

    if (!uid) {
        return reply.redirect('/');
    }
    let promise = User.findOne({ _id: uid });
    promise.then(function (user) {
        return reply.view('web-user/view/client/info/view', { data: user, meta: meta }, { layout: 'web/layout' });
    });

}


function favoriteUnit(request, reply) {
    const Meta = request.server.plugins['service-meta'];
    var meta = JSON.parse(JSON.stringify(Meta.getMeta('user-info')));
    let uid = request.auth.credentials.uid;

    if (!uid) {
        return reply.redirect('/');
    }
    let promise = User.findOne({ _id: uid });
    promise.then(function (user) {
        return reply.view('web-user/view/client/info/view', { data: user, meta: meta }, { layout: 'web/layout' });
    });

}





function recognitionMyData(request, reply) {
    let uid = request.auth.credentials.uid;
    const Meta = request.server.plugins['service-meta'];
    var meta = JSON.parse(JSON.stringify(Meta.getMeta('user-recognition')));
    if (!uid) {
        return reply.redirect('/');
    }
    let userFolder = request.pre.userFolder;
    let promise = User.findOne({ _id: uid }).populate('customer.shipping_address.id_shipping_fee');
    promise.then(function (user) {
        return reply.view('web-user/view/client/recognition/recognition', { userFolder, meta: meta }, { layout: 'web/layout' });
    });
}



function changePass(request, reply) {
    let uid = request.auth.credentials.uid;
    const Meta = request.server.plugins['service-meta'];
    var meta = JSON.parse(JSON.stringify(Meta.getMeta('user-change-pass')));
    if (!uid) {
        return reply.redirect('/');
    }
    let promise = User.findOne({ _id: uid });
    promise.then(function (user) {
        return reply.view('web-user/view/client/change-pass/view', { data: "", meta: meta }, { layout: 'web/layout' });
    });
}
