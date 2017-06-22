'use strict';

const prefixCollection = global.config.web.db.prefixCollection || '';
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
/**
 * AuditlogSchema Schema
 */

var AuditlogSchema = new Schema({
    actor: { type: String },
    date: { type: Date },
    origin: { type: String },
    action: { type: String },
    label: { type: String },
    object: { type: String },
    description: { type: String }
}, {
        collection: prefixCollection + 'auditlogs',
    });

module.exports = mongoose.model('Auditlog', AuditlogSchema);
