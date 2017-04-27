"use strict";

var Joi = require('joi');

function OrderValidate() { };
OrderValidate.prototype = (function () {
    return {
        edit: {

        },
        save: {
            payload: {
                data: {
                    id_shipping_fee: Joi.string().required().description('Shipping fee'),
                    id_coupon: Joi.any().optional().description('Shipping fee'),
                    total: Joi.number().required().description('Total order'),
                    payment_method: Joi.string().required().description('Payment method'),
                    status: Joi.string().required().description('Status'),
                    delivery_type: Joi.string().required().description('Delivery type'),
                    type: Joi.string().required().description('Type'),
                    delivery_time: Joi.string().required().description('Delivery time'),
                    payment_info: Joi.object().keys({
                        info: Joi.object().keys({
                            user_id: Joi.any(),
                            id_shipping_address: Joi.string().required(),
                            full_name: Joi.string().required(),
                            vocative: Joi.any().description("Vocative"),
                            phone: Joi.string().required(),
                            email: Joi.string().required(),
                            address: Joi.string().required(),
                            district: Joi.string().required(),
                            shipping_fee: Joi.number(),
                        })
                    }).description('Payment info'),
                    order_detail: Joi.array().items(Joi.object().keys({
                        product: Joi.string().required(),
                        product_obj: Joi.any(),
                        order_quantity: Joi.number().required().min(0),
                        price: Joi.number().required().min(0),
                        total: Joi.number().required().min(0),
                        id_promote: Joi.any()
                    })).description('List Images'),
                    total_pay: Joi.number().required().min(0),
                    note: Joi.string(),
                    shiper: Joi.string().required(),
                    ship_date: Joi.date().description('Date shipping'),
                    coupon: Joi.any().description('Coupon')
                },
                coupon: Joi.any()
            }
        },
        update: {

        },
        deleteItem: {

        }
    };
})();

var orderValidate = new OrderValidate();
module.exports = orderValidate;
