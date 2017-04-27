'use strict';
const prefixCollection = global.config.web.db.prefixCollection || '';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('slug');

const ImportProductSchema = new Schema({
    id_product: {
        type: Schema.ObjectId,
        ref: 'Product',
        required: 'Product is required'
    },
    id_user: {
        type: Schema.ObjectId,
        ref: 'User',
        required: 'User is required'
    },
    qty_before: {
        type: Number,
        min: 0,
        default: 0
    },
    qty_after: {
        type: Number,
        min: 0,
        default: 0
    },
    total_money_after: {
        type: Number,
        min: 0,
        default: 0
    },
    price_old: {
        type: Number,
        min: 0,
        default: 0
    },
    price_new: {
        type: Number,
        min: 0,
        default: 0
    },
    id_supplier: {
        type: Schema.ObjectId,
        ref: 'Supplier'
    },
}, {
        collection: prefixCollection + 'import_product',
        timestamps: true,
        toJSON: {
            virtuals: true
        }
    });

/******************************************************************
Virtual Populate
*******************************************************************/

// Virtual Product
ImportProductSchema.virtual('product', {
    ref: 'Product',
    localField: 'id_product',
    foreignField: '_id',
    justOne: true
});

// Virtual User
ImportProductSchema.virtual('user', {
    ref: 'User',
    localField: 'id_user',
    foreignField: '_id',
    justOne: true
});

// Virtual Supplier
ImportProductSchema.virtual('supplier', {
    ref: 'Supplier',
    localField: 'id_supplier',
    foreignField: '_id',
    justOne: true
});

let ImportProduct = mongoose.model('ImportProduct', ImportProductSchema);

module.exports = ImportProduct;