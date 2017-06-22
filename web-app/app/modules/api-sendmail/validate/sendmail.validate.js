"use strict";

var Joi = require('joi');

function SendmailValidate() { };
SendmailValidate.prototype = (function () {
	return {
		sendmail: {
            payload: {
                from: { name: Joi.string().required(), address: Joi.string().email().required() },
                to: Joi.array().items({ name: Joi.string(), address: Joi.string().email().required() }),
                cc: Joi.array().items({ name: Joi.string(), address: Joi.string().email() }),
                //bcc: [{ name: Joi.string().required(), address: Joi.string().email().required() }],
                //reply: [{ name: Joi.string().required(), address: Joi.string().email().required() }],
                subject: Joi.string().required(),
                html: Joi.any(),
                template: {name: Joi.any().optional(), context: Joi.any().optional()}  ,
                text: Joi.any().optional()
            }
		}
	};
})();

var sendmailValidate = new SendmailValidate();
module.exports = sendmailValidate;