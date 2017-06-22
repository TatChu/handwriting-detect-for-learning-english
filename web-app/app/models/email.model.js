'use strict';

const prefixCollection = global.config.web.db.prefixCollection || '';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const emailModel = new Schema({
	from: { 
		name: {
			type: String,
			// required: true,
			trim: true
		},
		address: {
			type: String,
			required: true,
			trim: true
		}
	},
	to: [
	{
		name: {
			type: String,
			// required: true,
			trim: true
		},
		address: {
			type: String,
			// required: true,
			trim: true
		}
	}
	],
	cc: [
	{
		name: {
			type: String,
			default: '',
			trim: true
		},
		address: {
			type: String,
			default: '',
			trim: true
		}
	}
	],
	bcc: [
	{
		name: {
			type: String,
			default: '',
			trim: true
		},
		address: {
			type: String,
			default: '',
			trim: true
		}
	}
	],
	subject:{
		type: String,
		required: true,
		trim: true
	},
	html: { type: String},
	text: { type: String, default: '' },
	status: { type: Number, default: 0 },
	context: { type: String},
},{
	collection: prefixCollection + 'emails',
	timestamps: true
});

module.exports = mongoose.model('Email', emailModel);