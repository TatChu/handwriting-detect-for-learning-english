"use strict";

var Joi = require('joi');

function SupplierValidate() { };
SupplierValidate.prototype = (function () {

    return {
        edit: {
            params: {
                id: Joi.string().description('Id')
            }
        },
        save: {
            payload: {
                name: Joi.string().required().description('Name'),
                phone: Joi.string().description('Phone'),
                // fax: Joi.string().allow('').description('Fax'),
                tax_code: Joi.string().allow('').description('Tax code'),
                bank_info: Joi.object().description('Account info').keys({
                    name: Joi.string().description('Name Account'),
                    account_number: Joi.string().description('Account Number'),
                    bank_name: Joi.string().description('Name Bank'),
                }),
                email: Joi.string().email().required().description('Email'),
                website: Joi.string().allow('').description('Website'),
                address: Joi.string().allow('').description('Address'),
                deputy: Joi.object().description('Deputy').keys({
                    name: Joi.string().allow('').description('Name Deputy'),
                    phone: Joi.string().allow('').description('Phone Deputy'),
                    email: Joi.string().allow('').email().description('Email')
                }),

                status: Joi.boolean().description('Status'),
                updatedAt: Joi.date().allow('').description('Updated'),
                createdAt: Joi.date().allow('').description('Created'),
            }
        },
        update: {
            payload: {
                name: Joi.string().required().description('Name'),
                phone: Joi.string().description('Phone'),
                fax: Joi.string().allow('').description('Fax'),//This field will be deleted on server live
                tax_code: Joi.string().allow('').description('Tax code'),
                bank_info: Joi.object().description('Account info').keys({
                    name: Joi.string().description('Name Account'),
                    account_number: Joi.string().description('Account Number'),
                    bank_name: Joi.string().description('Name Bank'),
                }),
                email: Joi.string().email().required().description('Email'),
                website: Joi.string().allow('').description('Website'),
                address: Joi.string().allow('').description('Address'),
                deputy: Joi.object().description('Deputy'),
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

var supplierValidate = new SupplierValidate();
module.exports = supplierValidate;
