'use strict'
const mongoose = require('mongoose');

exports.register = function (server, options, next) {
    const config = server.plugins['hapi-kea-config'];
    // global.db = config.get('web.db');
    // global.prefixCollection = config.get('web.db.prefixCollection');

    mongoose.connect(config.get('web.db.uri'));
    // mongoose.connect(config.get('web.db.uri'), config.get('web.db.options'));
    mongoose.Promise = require('bluebird');
    require('mongoose-pagination');
    console.log('Register Mongo');

    next();
};

exports.register.attributes = {
    name: 'app-mongo'
};