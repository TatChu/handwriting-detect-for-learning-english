"use strict";

var Joi = require('joi');

function ShippingFeeValidate() { };
ShippingFeeValidate.prototype = (function () {
	return {
		save: {
            payload: {
                type: Joi.string().required(),
                district: Joi.string().required(),
                fee: Joi.number()
            }
		},
		update: {
			payload: {
                type: Joi.string().required(),
                district: Joi.string().required(),
                fee: Joi.number().min(0),
                _id: Joi.string().description('MongoID'),
                updatedAt: Joi.date().allow('').description('Updated'),
                createdAt: Joi.date().allow('').description('Created'),
                __v: Joi.any().optional().description('Version Key'),
            }
		}
	};
})();

var shippingfeeValidate = new ShippingFeeValidate();
module.exports = shippingfeeValidate;
