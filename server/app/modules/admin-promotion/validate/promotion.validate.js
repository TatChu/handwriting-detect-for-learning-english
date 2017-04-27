"use strict";

var Joi = require('joi');

function PromotionValidate() { };
PromotionValidate.prototype = (function () {
    return {
        edit: {

        },
        save: {
            payload: {
                data: {
                    name: Joi.string().required().description('Name'),
                    desc: Joi.string().description('Description'),
                    type: Joi.string().description('Type'),
                    value: Joi.number().required().min(0).description('Value'),
                    status: Joi.boolean().required().description('Status'),
                },
                product_apply: Joi.any()
            }
        },
        update: {

        },
        deleteItem: {

        }
    };
})();

var promotionValidate = new PromotionValidate();
module.exports = promotionValidate;
