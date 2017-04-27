"use strict";

var Joi = require('joi');

function CertificateValidate() { };
CertificateValidate.prototype = (function () {
	return {
        edit: {
            params: {
                id: Joi.string().description('Id')
            }
        },
		save: {
            payload: {
                name: Joi.string().required().description('Name'),
                description: Joi.any().description('Description'),
                images: Joi.array().items(Joi.object().keys({
                    url: Joi.string().allow('')
                })).description('List Images'),
            }
		},
		update: {
			payload: {
                name: Joi.string().required().description('Name'),
                description: Joi.allow("").description('Description'),
                images: Joi.array().items(Joi.object().keys({
                    url: Joi.string().allow('')
                })).description('List Images'),

                _id: Joi.string().description('MongoID'),
                created: Joi.allow(""),
                updatedAt: Joi.date().allow('').description('Updated'),
                createdAt: Joi.date().allow('').description('Created'),
                __v: Joi.any().optional().description('Version Key')
            }
		}
	};
})();

var certificateValidate = new CertificateValidate();
module.exports = certificateValidate;
