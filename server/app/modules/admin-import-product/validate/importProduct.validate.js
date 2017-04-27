"use strict";

var Joi = require('joi');

function ImportProductValidate() { };
ImportProductValidate.prototype = (function () {
    return {
        edit: {

        },
        save: {
            payload: {
                data: {
                    id_product: Joi.string().required().description('Product ID'),
                    price_new: Joi.number().required().description('New Price'),
                    price_old: Joi.number().required().description('Old Price'),
                    qty_after: Joi.number().required().description('Old Quantity'),
                    qty_before: Joi.number().required().description('New Quantity'),
                    total_money_after: Joi.number().required(),
                    id_supplier: Joi.string().required().description('Product ID'),
                },
                product: Joi.any()
            }
        },
        update: {

        },
        deleteItem: {

        }
    };
})();

var importProductValidate = new ImportProductValidate();
module.exports = importProductValidate;
