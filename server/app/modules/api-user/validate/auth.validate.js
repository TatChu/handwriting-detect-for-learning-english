"use strict";

var Joi = require('joi');

function AuthValidate() { };
AuthValidate.prototype = (function () {
	return {
		create: {
            payload: {
                name: Joi.string().required().description('Name'),
                email: Joi.string().email().required().description('Email'),
                phone: Joi.string().required().description('Phone'),
                password: Joi.string().description('Password'),
                cfpassword: Joi.string(),
                status: Joi.boolean(),
                roles: Joi.any().description('Roles')
            }
		},
		update: {
            payload: {
                _id: Joi.string().description('MongoID'),
                name: Joi.string().required().description('Name'),
                phone: Joi.allow(),
                email: Joi.allow(),
                password: Joi.string().description('Password'),
                cfpassword: Joi.string(),
                status: Joi.boolean(),
                roles: Joi.any().description('Roles'),
                saleman: Joi.object().allow(''),
                customer: Joi.allow(),
                vocative: Joi.string().allow(''),
                avatar: Joi.string().allow(''),
                provider_id: Joi.allow(''),
                old_id: Joi.allow(''),
                favorite_product: Joi.array().items(Joi.string()).description('List Favorite Product'),
                dob: Joi.allow('').description('Date of birthday'),
                updatedAt: Joi.date().allow('').description('Updated'),
                createdAt: Joi.date().allow('').description('Created'),
                resetPasswordExpires: Joi.allow('').description('resetPasswordExpires'),
                resetPasswordToken: Joi.allow('').description('resetPasswordToken'),
                deletedAt: Joi.allow('').description('DeletedAt'),
                old_id: Joi.allow('').description('Used id olc'),
            }
        },
        login: {
            payload: {
                phone: Joi.string().required().description('Email'),
                password: Joi.string().required().description('Password'),
                isRegister: Joi.boolean().default(false),
                role: Joi.any().description('Scope')
            }
        },
        active: {
            query: {
                token: Joi.string().required().description('Token')
            }
        },
        facebookLogin: {
            payload: {
                email: Joi.string().required().description('Email get from Facebook'),
                provider_id: Joi.string().required().description('Facebook ID'),
                name: Joi.string().required().description('Facebook ID'),
                profile_picture: Joi.string().description('Facebook Avatar'),
                role: Joi.any().description('Scope')
            }
        },
        fogotPassword: {
            payload: {
                email: Joi.string().email().required().description('Email')
            }
        },
        resetPassword: {
            payload: {
                newPassword: Joi.string().required().description('New Password'),
                confirmNewPassword: Joi.string().required().description('Confirm Password'),
                token: Joi.string().required().description('Token')
             }
            // query: {
            //     token: Joi.string().required().description('Token')
            // }
        },
        changePassword: {
            payload: {
                currentPassword: Joi.string().required().description('Current Password'),
                newPassword: Joi.string().required().description('New Password'),
                confirmNewPassword: Joi.string().required().description('Confirm Password')
            }
        }
	};
})();

var authValidate = new AuthValidate();
module.exports = authValidate;
