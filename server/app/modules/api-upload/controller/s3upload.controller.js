'use strict';

const Boom = require('boom');
const Joi = require('joi');
const Moment = require('moment');
const async = require("async");
const _ = require('lodash');
const Mongoose = require('mongoose');
const ErrorHandler = require(BASE_PATH + '/app/utils/error.js');
const UserHelper = require(BASE_PATH + '/app/modules/api-user/util/user.js');
// const mdwAuth = require(BASE_PATH + '/app/utils/middleware/auth.js');

module.exports = {
	uploadPDF: uploadPDF,
};

function uploadPDF(){
	return {
		auth: 'jwt',
		// pre: [
		// { method: getById, assign: 'saleContact' }
		// ],
		handler: function(request, reply) {
			if(request.payload.file && request.payload.file != 'null'){
				console.log('ccc', request.payload);
			}
			return reply(request.payload);
		}
	};
}

/******************************************************************
Middleware
*******************************************************************/
