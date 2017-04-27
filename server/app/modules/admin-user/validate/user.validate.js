"use strict";

var Joi = require('joi');

function UserValidate() { };
UserValidate.prototype = (function () {

    return {
        create: {
            payload: {
                name: Joi.string().required().description('Name'),
                phone: Joi.string().required().description('Phone'),
                email: Joi.string().email().allow("").default(null).description('Email'),
                password: Joi.string().description('Password'),
                cfpassword: Joi.string(),
                status: Joi.boolean(),
                vocative: Joi.string().allow(''),
                avatar: Joi.string().allow(''),
                provider_id: Joi.allow(''),
                favorite_product: Joi.array().items(Joi.object().keys({
                    url: Joi.string().allow('')
                })).description('List Favorite Product'),
                dob: Joi.date().allow('').description('Date of birthday'),
                roles: Joi.any().description('Roles'),
                saleman: Joi.object()
            }
        },
        update: {
            payload: {
                _id: Joi.string().description('MongoID'),
                name: Joi.string().required().description('Name'),
                phone: Joi.string().required().description('Phone'),
                email: Joi.allow(),
                password: Joi.string().description('Password'),
                cfpassword: Joi.string(),
                status: Joi.boolean(),
                roles: Joi.any().description('Roles'),
                saleman: Joi.object(),
                customer: Joi.allow(),
                vocative: Joi.string().allow(''),
                avatar: Joi.string().allow(''),
                provider_id: Joi.allow(''),
                favorite_product: Joi.array().items(Joi.string()).description('List Favorite Product'),
                dob: Joi.date().allow('').description('Date of birthday'),
                updatedAt: Joi.date().allow('').description('Updated'),
                createdAt: Joi.date().allow('').description('Created'),
                resetPasswordExpires: Joi.allow('').description('resetPasswordExpires'),
                resetPasswordToken: Joi.allow('').description('resetPasswordToken'),
                deletedAt: Joi.allow('').description('DeletedAt'),

                old_id: Joi.allow('').description('old user id site'),
            }
        }
    };
})();

var userValidate = new UserValidate();
module.exports = userValidate;
