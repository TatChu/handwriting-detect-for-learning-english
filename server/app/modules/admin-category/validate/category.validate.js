"use strict";

var Joi = require('joi');

function CategoryValidate() { };
CategoryValidate.prototype = (function () {

    return {
        edit: {
            params: {
                slug: Joi.string().description('Slug')
            }
        },
        save: {
            payload: {
                name: Joi.string().required().description('Name'),
                slug: Joi.string().allow('').description('Slug'),
                active: Joi.boolean().description('Active'),
                description: Joi.string().allow('').description('Description'),
                images: Joi.array().items(Joi.object().keys({
                    url: Joi.string().allow('')
                })).description('List Images'),
                parrent_id: Joi.any().description('Categories parrent'),
                top: Joi.array().description('Top categories show in frontend view'),

                status: Joi.boolean().description('Status'),
                updatedAt: Joi.date().allow('').description('Updated'),
                createdAt: Joi.date().allow('').description('Created'),
            }
        },
        update: {
            payload: {
                name: Joi.string().required().description('Name'),
                slug: Joi.string().allow('').description('Slug'),
                active: Joi.boolean().description('Active'),
                description: Joi.string().allow('').description('Description'),
                images: Joi.array().items(Joi.object().keys({
                    url: Joi.string().allow('')
                })).description('List Images'),
                parrent_id: Joi.any().description('Categories parrent'),
                top: Joi.array().description('Top categories show in frontend view'),
                status: Joi.boolean().description('Status'),
                updatedAt: Joi.date().allow('').description('Updated'),
                createdAt: Joi.date().allow('').description('Created'),

                __v: Joi.any().optional().description('Version Key'),
                _id: Joi.string().description('MongoID')
            }
        },
        deleteItem: {
            params: {
                id: Joi.string().required().description('ID'),
            }
        },
        getOneById: {
            params: {
                id: Joi.string().description('Id')
            }
        }
    };
})();

var categoryValidate = new CategoryValidate();
module.exports = categoryValidate;
