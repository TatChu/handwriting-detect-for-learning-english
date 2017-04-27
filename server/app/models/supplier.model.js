'use strict';
const prefixCollection = global.config.web.db.prefixCollection || '';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


var SupplierSchema = new Schema({
    name: {
        type: String,
        trim: true,
        unique: 'Supplier already exists',
        require: true
    },
    phone: {
        type: String,
        trim: true,
    },
    // fax: {
    //     type: String,
    //     trim: true,
    // },
    tax_code: {
        type: String,
        trim: true,
    },
    bank_info: {
        _id: false,
        name: {
            type: String,
            trim: true,
        },
        account_number: {
            type: String,
            trim: true
        },
        bank_name: {
            type: String,
            trim: true
        }
    },
    email: {
        type: String,
        require: true,
        trim: true,
        unique: 'Email already exists',
        match: [/.+\@.+\..+/, 'Please fill a valid email address']
    },
    address: {
        type: String,
        trim: true,
    },
    website: {
        type: String,
        trim: true
    },
    deputy: {
        _id: false,
        name: {
            type: String,
            trim: true,
        },
        phone: {
            type: String,
            trim: true,
        },
        email: {
            type: String,
            trim: true,
            match: [/.+\@.+\..+/, 'Please fill a valid email address']
        }
    },
    status: {
        type: Boolean,
        default: true
    },
    updatedAt: {
        type: Date
    },
    createdAt: {
        type: Date
    }
}, {
        collection: prefixCollection + 'supplier',
        timestamps: true
    });

module.exports = mongoose.model('Supplier', SupplierSchema);
