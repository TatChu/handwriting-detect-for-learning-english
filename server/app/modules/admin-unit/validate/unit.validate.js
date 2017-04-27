"use strict";

var Joi = require('joi');

function UnitValidate() { };
UnitValidate.prototype = (function () {

    return {
        edit: {
            params: {
                id: Joi.string().description('Id')
            }
        },
        save: {
            payload: {
                id: Joi.string().description('Id'),
                name: Joi.string().required().description('Name'),
                description: Joi.string().allow('').description('Description'),
                status: Joi.boolean().description('Status'),
                updatedAt: Joi.date().allow('').description('Updated'),
                createdAt: Joi.date().allow('').description('Created'),
            }
        },
        update: {
            payload: {
                name: Joi.string().required().description('Name'),
                description: Joi.string().allow('').description('Description'),
                status: Joi.boolean().description('Status'),
                updatedAt: Joi.date().allow('').description('Updated'),
                createdAt: Joi.date().allow('').description('Created'),
                modified: Joi.date().allow('').description('Modified'),

                __v: Joi.any().optional().description('Version Key'),
                _id: Joi.string().description('MongoID')
            }
        },
        deleteItem: {
            params: {
                id: Joi.string().required().description('ID')
            }
        }
    };
})();

var unitValidate = new UnitValidate();
module.exports = unitValidate;
