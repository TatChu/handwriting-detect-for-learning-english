'use strict';
const prefixCollection = global.config.web.db.prefixCollection || '';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


var UnitSchema = new Schema({
    name: {
        type: String,
        trim: true,
        unique: 'Unit already exists',
        require: true
    },
    description: {
        type: String,
        trim: true,
    },
    status: {
        type: Boolean,
        default: true
    },
    modified: {
        type: Date
    },
    created: {
        type: Date
    }
}, {
    collection: prefixCollection + 'unit',
    timestamps: true
});

/******************************************************************
Pre Action
*******************************************************************/
// UnitSchema.pre('update', function(next) {
    
//     this.modified = Date.now();
//     next();
// });
// UnitSchema.pre('save', function(next) {
    
//     if(this.isNew){ 
//         this.created = Date.now();
//     }
//     this.modified = Date.now();
//     next();
// });

module.exports = mongoose.model('Unit', UnitSchema);
