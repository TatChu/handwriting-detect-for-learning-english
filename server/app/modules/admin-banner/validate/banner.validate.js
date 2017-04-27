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
                    page: Joi.string().required().description('Page'),
                    position: Joi.string().required().description('Position'),
                    type: Joi.string().required().description('Type'),
                    order: Joi.number().required().description('Order'),
                    status: Joi.boolean().default(true).description('Status'),
                    style: Joi.string().required().description('Style'),
                    link: Joi.string().required().description('Link'),
                    image: Joi.string().required().description('Image'),
                    imgsDel: Joi.any().description('Image list delete'),
                    category: Joi.any().description('Category')
                },
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
