'use strict';
const prefixCollection = global.config.web.db.prefixCollection || '';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var TestSchema = new Schema({
    name: {
        type: String
    },
    decs: {
        type: String
    }
}, {
    collection: prefixCollection + 'test',
    timestamps: true
});

let Test = mongoose.model('Test', TestSchema);

module.exports = Test;