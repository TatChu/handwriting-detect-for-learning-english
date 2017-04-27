'use strict';
const prefixCollection = global.config.web.db.prefixCollection || '';
const _ = require('lodash');
const elasticsearch = require('elasticsearch');
const Bluebird = require('bluebird');
const mongoosastic = require('mongoosastic');
const auditLog = require('audit-log');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Bcrypt = require('bcrypt');

var CertificateSchema = new Schema({
    name: {
        type: String,
        unique: "Đã tồn tại",
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    images: [{
        _id: false,
        url: {
            type: 'String',
        }
    }],
}, {
    collection: prefixCollection + 'certificate',
    timestamps: true
});

let Certificate = mongoose.model('Certificate', CertificateSchema);

module.exports = Certificate;