'use strict';
const prefixCollection = global.config.web.db.prefixCollection || '';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('slug');
const _ = require('lodash');

const PromotionSchema = new Schema({
    name:{
        type: String,
        required: 'Please fill name'
    },
    desc:{
        type: String,
    },
    type:{
        type: String,
        enum: ['PC', 'MN'],// Theo % hay tiền
        default: 'PC',
    },
    value:{
        type: Number,
        min: 0
    },
    status:{
        type: Boolean,
        default: true
    }
}, {
    collection: prefixCollection + 'promotion',
    timestamps: true,
    toJSON: {
        virtuals: true
    }
});

/******************************************************************
Virtual Populate
*******************************************************************/

// Virtual Unit
PromotionSchema.virtual('product',{
    ref: 'Product',
    localField: '_id',
    foreignField: 'id_promotion',
});

let Promotion = mongoose.model('Promotion', PromotionSchema);

module.exports = Promotion;