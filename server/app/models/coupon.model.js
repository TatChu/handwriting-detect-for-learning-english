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

var CouponSchema = new Schema({
    code: {
        type: String,
        required: true,
        unique: "Code is already exists",
        trim: true
    },

    name: {
        type: String,
        required: true,
        trim: true
    },

    status: {
        type: String,
        trim: true,
        enum: ['inactive', 'active'],
        default: 'active'
    },

    count: {
        type: Boolean,
        default: false
    },
    used_times_count: {
        type: Number,
        default: 0
    },
    internal: {
        is_internal: {
            type: Boolean
        },
        start_date: {
            type: Date,
            default: null
        },
        end_date: {
            type: Date,
            default: null
        }
    },

    sale: {
        is_money: {
            type: Boolean,
            default: false
        },
        money_value: {
            type: Number,
            default: 0
        },
        is_percent: {
            type: Boolean,
            default: false
        },
        percent_value: {
            type: Number,
            default: 0
        }
    },

    apply_district: {
        is_district: {
            type: Boolean,
            default: false
        },
        district: [{
            type: Schema.ObjectId,
            ref: 'ShippingFee'
        }]
    },

    apply_product: {
        is_product: {
            type: Boolean,
            default: false
        },
        products: [{
            type: Schema.ObjectId,
            ref: 'Category'
        }]
    },

    apply_order: {
        is_order: {
            type: Boolean,
            default: false
        },
        money: {
            type: Number,
            default: 0
        }
    }
}, {
        collection: prefixCollection + 'coupon',
        timestamps: true
    });

let Coupon = mongoose.model('Coupon', CouponSchema);

module.exports = Coupon;