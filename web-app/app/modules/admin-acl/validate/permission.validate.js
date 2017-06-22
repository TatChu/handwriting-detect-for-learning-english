"use strict";

var Joi = require('joi');

function PermissionValidate() { };
PermissionValidate.prototype = (function () {

    return {
        create: {
            payload: {
                role: Joi.string().required().description('Name'),
                permission: Joi.array().required().description('List permission'),
                resource: Joi.array().required().description('List resource'),

                updatedAt: Joi.date().allow('').description('Updated'),
                createdAt: Joi.date().allow('').description('Created'),
            }
        }
    };
})();

var permissionValidate = new PermissionValidate();
module.exports = permissionValidate;
