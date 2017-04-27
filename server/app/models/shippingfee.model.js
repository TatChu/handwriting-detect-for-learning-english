'use strict';
const prefixCollection = global.config.web.db.prefixCollection || '';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var ShippingFeeSchema = new Schema({
    type: {
        type: String,
        trim: true
    },
    district: {
        type: String,
        unique: true,
        trim: true
    },
    fee: {
        type: Number,
        default: 0
    }
}, {
    collection: prefixCollection + 'shipping_fee',
    timestamps: true
});

let ShippingFee = mongoose.model('ShippingFee', ShippingFeeSchema);

module.exports = ShippingFee;