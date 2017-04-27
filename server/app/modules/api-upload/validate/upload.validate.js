"use strict";

var Joi = require('joi');

function UploadApiValidate() { };
UploadApiValidate.prototype = (function () {
    return {
        validate: {
            payload: Joi.any().required().meta({ swaggerType: 'file' }).description('File'),
        },
        payload: {
            maxBytes: 10048576,
            parse: true,
            allow: ['application/json', 'image/jpeg', 'multipart/form-data', 'application/pdf'],
            output: 'stream'
        },
        uploadBase64: {
            payload: {
                image: Joi.string().min(8).required(),
                directory: Joi.string().description('Description'),
            }
        }
    };
})();

var uploadApiValidate = new UploadApiValidate();
module.exports = uploadApiValidate;
