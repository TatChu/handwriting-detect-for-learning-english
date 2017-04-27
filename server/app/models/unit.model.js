'use strict';
const prefixCollection = global.config.web.db.prefixCollection || '';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


var UnitSchema = new Schema({
    index_unit: {
        type: Number,
        require: true
    },
    name: {
        type: String,
        trim: true,
        unique: 'Unit already exists',
        require: true
    },
    short_description: {
        type: String,
        trim: true,
    },
    long_description: {
        type: String,
        trim: true,
    },
    status: {
        type: Boolean,
        default: true
    },
    classes: {
        type: String,
        trim: true,
        require: true,
        default: '4'
    }
}, {
        collection: prefixCollection + 'unit',
        timestamps: true
    });

module.exports = mongoose.model('Unit', UnitSchema);
