'use strict';
const prefixCollection = global.config.web.db.prefixCollection || '';
const _ = require('lodash');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var slug = require('slug');

var CategorySchema = new Schema({
    name: {
        type: String,
        trim: true,
        unique: 'Category name already exists',
        require: true
    },
    slug: {
        type: 'String',
        trim: true,
        index: true,
        unique: 'Slug already exists',
    },
    description: {
        type: 'String',
        trim: true
    },
    images: [
        {
            _id: false,
            url: {
                type: 'String',
            }

        }
    ],
    parrent_id: {
        type: Schema.ObjectId,
        ref: 'Category'
    },
    top: [
        {
            _id: false,
            type: Schema.ObjectId,
            ref: 'Category'
        }
    ],
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
        collection: prefixCollection + 'category',
        timestamps: true
    });

CategorySchema.index({ slug: 1 });

CategorySchema.pre('update', function (next) {
    if (!this.slug) {
        this.slug = slug(this.slug);
    }
    this.slug = this.slug.toLowerCase();
    next();
});
CategorySchema.pre('save', function (next) {
    if (!this.slug) {
        this.slug = slug(this.name);
    }
    this.slug = this.slug.toLowerCase();
    next();
});


// Virtual Category
// Get sub category
CategorySchema.virtual('sub_category', {
    ref: 'Category',
    localField: '_id',
    foreignField: 'parrent_id',
});

CategorySchema.virtual('parent_category', {
    ref: 'Category',
    localField: 'parrent_id',
    foreignField: '_id',
    justOne: true
});

module.exports = mongoose.model('Category', CategorySchema);
