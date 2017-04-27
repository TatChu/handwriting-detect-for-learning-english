'use strict';

const prefixCollection = global.config.web.db.prefixCollection || '';
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var slug = require('slug');
/**
 * Blog Schema
 */
var BlogSchema = new Schema({
    name: {
        type: String,
        default: '',
        required: 'Please fill name',
        trim: true
    },
    slug: {
        type: String,
        unique: true,
        index: true,
        default: '',
        trim: true
    },
    type: {
        type: String,
        enum: ['GB', 'CS', 'BN', 'MV'], // Góc bếp | Chính sách | Banner | Mẹo vặt
        default: 'GB'
    },
    meta_title: {
        type: String,
        default: '',
        trim: true
    },
    meta_keywords: {
        type: String,
        default: '',
        trim: true
    },
    meta_description: {
        type: String,
        default: '',
        trim: true
    },
    short_description: {
        type: String,
        default: '',
        trim: true
    },
    auth_id: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    publisher_id: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    content: {
        type: String,
        default: '',
        required: 'Please fill content',
        trim: true
    },
    featured_image: [{
        _id: false,
        url: {
            type: 'String',
        }

    }],
    tags: [{
        _id: false,
        type: Schema.ObjectId,
        ref: 'Tag'
    }],
    status: {
        type: Boolean,
        default: true
    },
    views: {
        type: Number,
        default: 0
    }
}, {
        collection: prefixCollection + 'blog',
        timestamps: true
    });
BlogSchema.index({ slug: 1 });

module.exports = mongoose.model('Blog', BlogSchema);
