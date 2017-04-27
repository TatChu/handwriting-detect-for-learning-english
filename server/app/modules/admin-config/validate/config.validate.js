"use strict";

var Joi = require('joi');

function ConfigValidate() { };
ConfigValidate.prototype = (function () {

    return {
        edit: {
            params: {
                id: Joi.string().description('ID')
            }
        },
        save: {
            payload: {
                name: Joi.string().required().description('Name'),
                value: Joi.number().required().description('Value'),
                description: Joi.string().allow('').description('Description'),
                status: Joi.boolean().description('Status'),
                type: Joi.string().allow(''),

                updatedAt: Joi.date().allow('').description('Updated'),
                createdAt: Joi.date().allow('').description('Created'),
            }
        },
        update: {
            payload: {
                name: Joi.string().required().description('Name'),
                value: Joi.number().required().description('Value'),
                description: Joi.string().allow('').description('Description'),
                status: Joi.boolean().description('Status'),
                updatedAt: Joi.date().allow('').description('Updated'),
                createdAt: Joi.date().allow('').description('Created'),
                type: Joi.string().allow(''),

                __v: Joi.any().optional().description('Version Key'),
                _id: Joi.string().description('MongoID')
            }
        },
        deleteItem: {
            params: {
                id: Joi.string().required().description('ID'),
            }
        }
    };
})();

var configValidate = new ConfigValidate();
module.exports = configValidate;
