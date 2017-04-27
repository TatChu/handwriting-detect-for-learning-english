const mongoose = require('mongoose');
const Order = mongoose.model('Order');
const Product = mongoose.model('Product');
const ShippingFee = mongoose.model('ShippingFee');
const User = mongoose.model('User');
const Coupon = mongoose.model('Coupon');
const Config = mongoose.model('Config');

module.exports = {
    getOrderById,
    getListShippingFee,
    getListProduct,
    getListCoupon,
    getListUser,
    getConfig
}

function getOrderById(type) {
    return function (request, reply) {
        if (type == 'payload') var id = request.payload.order._id;
        if (type == 'params') var id = request.params.id;
        // let promise = Order.findById(id).populate('order_detail.product_obj').lean();
        let promise = Order.findById(id).populate('order_detail.product_obj');
        promise.then(function (data) {
            reply(data);
        });
    }
}

function getListShippingFee(request, reply) {
    let promise = ShippingFee.find();
    promise.then(function (data) {
        reply(data);
    });
}

function getListProduct(option) {
    return function (request, reply) {
        let promise = Product.find(option).populate('unit_stock unit_order').populate({
            path: 'promotion',
            match: {
                status: true
            }
        }).select('id_promotion name qty_in_stock price email thumb promotion').lean();
        promise.then(function (data) {
            reply(data);
        });
    }
}

function getListCoupon(request, reply) {
    let promise = Coupon.find({
        status: 'active'
    });
    promise.then(function (data) {
        reply(data);
    });
}

function getListUser(request, reply) {
    let promise = User.find({}).populate('customer.shipping_address.id_shipping_fee')
    .select('name phone customer vocative email deletedAt').lean();
    promise.then(function (data) {
        reply(data);
    });
}

function getConfig(option) {
    return function (request, reply) {
        let promise = Config.findOne(option);
        promise.then(function (resp) {
            reply(resp);
        });
    }
}