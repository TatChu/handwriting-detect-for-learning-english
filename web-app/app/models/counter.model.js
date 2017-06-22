'use strict';

const prefixCollection = global.config.web.db.prefixCollection || '';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CountersSchema = new Schema({
    collection_name:{
        type: String,
        required: true,
    },
    sequence_value:{
        type: Number,
        default: 1,
        min: 1
    }
}, {
    collection: prefixCollection + 'counters',
});

module.exports = mongoose.model('Counters', CountersSchema);