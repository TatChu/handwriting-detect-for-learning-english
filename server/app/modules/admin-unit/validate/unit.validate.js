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
                index_unit: Joi.number().required().description('Name'),
                name: Joi.string().required().description('Name'),
                short_description: Joi.string().allow('').description('Short Description'),
                classes: Joi.string().allow('').description('Class'),
                long_description: Joi.string().allow('').description('Long Description'),
                status: Joi.boolean().description('Status'),
                updatedAt: Joi.date().allow('').description('Updated'),
                createdAt: Joi.date().allow('').description('Created'),
            }
        },
        update: {
            payload: {
                index_unit: Joi.number().required().description('Name'),
                name: Joi.string().required().description('Name'),
                short_description: Joi.string().allow('').description('Short Description'),
                classes: Joi.string().allow('').description('Class'),
                long_description: Joi.string().allow('').description('Long Description'),
                status: Joi.boolean().description('Status'),
                updatedAt: Joi.date().allow('').description('Updated'),
                createdAt: Joi.date().allow('').description('Created'),
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
