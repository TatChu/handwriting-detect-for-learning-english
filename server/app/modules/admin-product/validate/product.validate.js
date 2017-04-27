"use strict";

var Joi = require('joi');

function ProductValidate() { };
ProductValidate.prototype = (function () {
    return {
        edit: {

        },
        save: {
            payload: {
                data: {
                    name: Joi.string().required().description('name'),
                    slug: Joi.string().required().description('slug'),
                    qty_in_stock: Joi.number().required().description('Status'),
                    price: Joi.number().required().description('Price'),
                    made_in: Joi.string().description('Made In'),
                    short_description: Joi.any().description('Short Description'),
                    detail_infor: Joi.any().description('Detail Information'),
                    vat: Joi.boolean().description('VAT'),
                    relative_product: Joi.array().items(Joi.string()).description('Related Product'),
                    category: Joi.array().items(Joi.string().required()).description('Category'),
                    certificates: Joi.array().items(Joi.string()).description('Certificates'),
                    active: Joi.boolean().description('Active'),
                    id_unit: Joi.string().required().description('ID unit'),
                    other_is: Joi.boolean().default(false).description('ID unit'),
                    other_price: Joi.string().description('Other price'),
                    view_unit: Joi.string().description('View Unit'),
                    images: Joi.array().items(Joi.object().keys({
                        url: Joi.string().required()
                    })).description('List Images'),
                    thumb: Joi.string().description('Thumb Image'),
                    videos: Joi.array().items(Joi.object().keys({
                        url: Joi.string().required()
                    })).description('List Videos'),
                    id_promotion: Joi.any().description('Promotion ID'),
                    tag_processing: Joi.array().items(Joi.object().keys({
                        id_tag: Joi.string().required()
                    })).description('Tag proccess'),
                    // tag: Joi.array(),
                    tag_processing: Joi.any().description('Tag Processing'),
                    status: Joi.string().default('HSV'),
                    due_date: Joi.object().keys({
                        start_date: Joi.date(),
                        end_date: Joi.date(),
                    }).description('Payment info'),
                    meta_title: Joi.string().description('Meta title'),
                    meta_keywords: Joi.string().description('Meta keywords'),
                    meta_description: Joi.string().description('Meta description')
                },
                imageDelete: Joi.any().description('Image list delete')
            }
        },
        update: {

        },
        deleteItem: {

        }
    };
})();

var productValidate = new ProductValidate();
module.exports = productValidate;
