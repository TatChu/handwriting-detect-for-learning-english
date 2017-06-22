'use strict';
const prefixCollection = global.config.web.db.prefixCollection || '';
const _ = require('lodash');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


var ConfigSchema = new Schema({
    name: {
        type: String,
        trim: true,
        unique: 'Config name already exists',
        require: true
    },
    value: {
        type: Number,
        require: true
    },
    type: {
        type: String,
        enum: ['PC', 'MN', ''],
        default: ''
    },
    description: {
        type: String,
        trim: true,
    },
    status: {
        type: Boolean,
        default: true
    }
}, {
        collection: prefixCollection + 'config',
        timestamps: true
    });

module.exports = mongoose.model('Config', ConfigSchema);
