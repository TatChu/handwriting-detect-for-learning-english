'use strict';

const mongoose = require('mongoose');
const _ = require('lodash');
const Order = mongoose.model('Order');
const ShippingFee = mongoose.model('ShippingFee');
const orderHelper = require(BASE_PATH + '/app/modules/api-order/util/order.js');

module.exports = {
    createOrder,
}

/**
 * Middleware
 */
function createOrder(request, reply) {
    if (request.payload.coupon === '') {
        request.payload.coupon = null;
    }
    let dataOrder = {
        id_shipping_fee: request.payload.id_shipping_fee != '' ? request.payload.id_shipping_fee : null,
        id_coupon: request.payload.coupon,
        delivery_time: request.payload.delivery_time,
        delivery_type: 'CN',
        status: 'PROCCESS',
        total: 0,
        payment_method: request.payload.payment_method,
        note: request.payload.note,
        total_pay: 0,
        payment_info: {
            info: {
                id_shipping_address: request.payload.shipping_address.id != "" ? request.payload.shipping_address.id : null,
                user_id: request.auth.credentials.uid == '' ? null : request.auth.credentials.uid,
                full_name: request.payload.shipping_address.name,
                email: request.payload.email,
                phone: request.payload.shipping_address.phone,
                district: request.payload.shipping_address.district || '',
                shipping_fee: 0,
                address: request.payload.shipping_address.address_detail,
                vocative: request.payload.shipping_address.vocative
            }
        },
        order_detail: []
    }

    let Cart = request.server.plugins['service-cart'];
    let promise_shipingFee = ShippingFee.findById(dataOrder.id_shipping_fee).exec();

    return Cart.getCart(request.auth.credentials.id).then(function (resp) {
        resp.items.forEach(function (item, index) {
            if (item.quantity > 0) {
                let total_temp = item.product.price * item.quantity;
                let promotion_temp = {
                    id: null,
                    name: '',
                    value: 0,
                    type: 'PC'
                };

                if (item.product.id_promotion) {
                    promotion_temp = _.extend(promotion_temp, {
                        id: item.product.id_promotion._id,
                        name: item.product.id_promotion.name,
                        value: item.product.id_promotion.value,
                        type: item.product.id_promotion.type,
                    });

                    if (item.product.id_promotion.type == "MN")
                        total_temp = total_temp - (item.quantity * item.product.id_promotion.value);
                    if (item.product.id_promotion.type == "PC")
                        total_temp = total_temp - (item.quantity * item.product.price * (item.product.id_promotion.value / 100));
                }
                let details = {
                    product: item.id_product,
                    order_quantity: item.quantity,
                    price: item.product.price,
                    total: total_temp,
                    id_promote: promotion_temp,
                }

                dataOrder.order_detail.push(details);
                dataOrder.total += details.total;
            }
        });
        let order = new Order(dataOrder);
        return reply(order);

    }).catch(function (err) {
        return reply.continue();
    })
}
