'use strict';

const prefixCollection = global.config.web.db.prefixCollection || '';
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var slug = require('slug');
/**
 * Banner Schema
 */
var BannerSchema = new Schema({
    page: {
        type: String,
        enum: ['home', 'category'],
        default: 'home',
        trim: true
    },
    position: {
        type: String,
        enum: ['top', 'bottom'],
        default: 'home',
        trim: true
    },
    type: {
        type: String,
        enum: ['slide', 'item'],
        required: true,
        default: 'slide'
    },
    order: {
        type: Number,
        default: 1
    },
    status: {
        type: Boolean,
        default: true
    },
    style: {
        type: String,
        default: ''
    },
    link: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    category: { //Slug in parent category + highlight page
        type: String,
    }
}, {
        collection: prefixCollection + 'banner',
        timestamps: true
    });
BannerSchema.index({ slug: 1 });

module.exports = mongoose.model('Banner', BannerSchema);
