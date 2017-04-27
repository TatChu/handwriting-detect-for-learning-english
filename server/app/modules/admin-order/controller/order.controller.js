'use strict';
const Boom = require('boom');
const Joi = require('joi');
const mongoose = require('mongoose');
const _ = require('lodash');
const fs = require('fs');
const util = require('util');
const moment = require('moment');
const async = require('async');
const ErrorHandler = require(BASE_PATH + '/app/utils/error.js');
const orderHelper = require(BASE_PATH + '/app/modules/api-order/util/order.js');

const Order = mongoose.model('Order');
const Product = mongoose.model('Product');
const ShippingFee = mongoose.model('ShippingFee');
const User = mongoose.model('User');
const Coupon = mongoose.model('Coupon');
const Config = mongoose.model('Config');

module.exports = {
    getAll,
    add,
    create,
    edit,
    update,
    delete: del,
    isFirstOrder,
    checkCoupon,
    isFirstOrderCreate
};

function getAll(request, reply) {
    let config = request.server.configManager;
    let page = parseInt(request.query.page) || 1;
    let itemsPerPage = parseInt(request.query.limit) || config.get('web.paging.itemsPerPage');

    let filters = [];

    if (request.query.type) {
        filters.push({
            type: request.query.type
        });
    }

    if (request.query.status) {
        filters.push({
            status: request.query.status
        });
    }

    if (request.query.coupon) {
        filters.push({
            id_coupon: request.query.coupon
        });
    }

    if (request.query.customer_name) {
        let opt_cus = [];
        let re = new RegExp(request.query.customer_name, 'i');
        opt_cus = [
            {
                'payment_info.info.full_name': re
            },
            {
                'payment_info.info.email': re
            },
            {
                'payment_info.info.phone': re
            },
        ];
        let id_order_num = request.query.customer_name
        if (!isNaN(id_order_num)) {
            opt_cus.push({
                id_order: id_order_num
            });
            opt_cus.push({
                old_increment_id: id_order_num
            })
        }
        filters.push({
            $or: opt_cus
        });
    }

    if (request.query.user_id) {
        filters.push({
            'payment_info.info.user_id': request.query.user_id
        });
    }

    if (request.query.date) {
        let date = request.query.date.split(' - ');
        let startDate = moment(date[0], 'DD/MM/YYYY');
        let endDate = moment(date[1], 'DD/MM/YYYY');

        filters.push({
            createdAt: {
                $gte: startDate,
                $lte: endDate,
            }
        });
    }
    let opt_id_order = {};

    if (request.query.min_order || request.query.max_order) {
        if (request.query.min_order) {
            opt_id_order = _.extend(opt_id_order, {
                $gte: parseInt(request.query.min_order)
            });
        }

        if (request.query.max_order) {
            opt_id_order = _.extend(opt_id_order, {
                $lte: parseInt(request.query.max_order)
            });
        }
        filters.push({
            id_order: opt_id_order
        });
    }

    let options = {};
    if (filters.length > 0) {
        options = { $and: filters };
    }


    let promise = Order.find(options)
        .populate('shipping_fee payment_info.info.user_id')
        .populate({
            path: 'order_detail.product',
            populate: {
                path: 'unit'
            }
        })
        .sort('-createdAt').lean()
        .paginate(page, itemsPerPage, function (err, items, total) {
            let list_func = [];
            items.forEach(function (item) {
                list_func.push(function (callback) {
                    let userId = item.payment_info.info.user_id;
                    let orderId = item._id;

                    if (!userId) {
                        callback(null, _.extend(item, { is_first_order: false }));
                    }
                    else {
                        orderHelper.checkFirstOrderOfUser(userId._id).then(function () {
                            item.is_first_order = false;
                            callback(null, _.extend(item, { is_first_order: false }));
                        }).catch(function (err) {
                            if (err.message == item._id) {
                                item.is_first_order = true;
                                callback(null, _.extend(item, { is_first_order: true }));
                            }
                            else {
                                item.is_first_order = false;
                                callback(null, _.extend(item, { is_first_order: false }));
                            }
                        })
                    }
                })
            })

            async.parallel(list_func, function (err, result) {
                let totalPage = Math.ceil(total / itemsPerPage);
                let dataSend = {
                    totalItems: total,
                    totalPage: totalPage,
                    currentPage: page,
                    itemsPerPage: itemsPerPage,
                    items: result,
                    listCoupon: request.pre.getListCoupon,
                    filters
                };
                reply(dataSend);
            })
        });
}

function add(request, reply) {
    reply({
        listShippingFee: request.pre.getListShippingFee,
        listProduct: request.pre.getListProduct,
        listUser: request.pre.getListUser,
        listCoupon: request.pre.getListCoupon,
        configNT: request.pre.getConfigNT,
        configNGT: request.pre.getConfigNGT,
        configBC: request.pre.getConfigBC,
        configDT: request.pre.getConfigDT,
    });
}

function create(request, reply) {
    if (request.payload.data.id_coupon === '') {
        request.payload.data.id_coupon = null;
    }
    let orderCreate = new Order(request.payload.data);
    let coupon = request.payload.coupon;
    let codeCoupon = coupon ? coupon.code : null;
    let user = request.pre.getAuthUser;

    let promise = orderCreate.save();
    promise.then(function (order) {

        // update product has been order
        Config.findOne({ name: 'ProductBalance' }, function (err, cfProductBalance) {
            if (err || cfProductBalance == null)
                cfProductBalance.value = 1;
            order.order_detail.forEach(function (detail, index) {
                Product.findById(detail.product, function (err, product) {
                    product.qty_in_stock -= detail.order_quantity;
                    if (product.qty_in_stock <= 0)
                        product.qty_in_stock = 0;
                    if (product.qty_in_stock <= cfProductBalance.value)
                        product.status = 'SHH'; // Change status: Sắp hết hàng
                    product.save();
                })
            })
        })

        // Create auditLog
        request.auditLog.logEvent(
            user._id.toString(),
            'mongoose',
            'create',
            'order',
            JSON.stringify({ new: order }),
            'Tạo đơn hàng'
        );

        return reply({ success: true });
    }).catch(function (err) {
        return reply({ err: err });
    });
}

function edit(request, reply) {
    let promise = Order.findOne({ id_order: request.params.id }).populate('shipping_fee order_detail.product');
    promise.then(function (resp) {
        reply({
            order: resp,
            listShippingFee: request.pre.getListShippingFee,
            listProduct: request.pre.getListProduct,
            listUser: request.pre.getListUser,
            listCoupon: request.pre.getListCoupon
        });
    }).catch(function (err) {
        reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
    });
}

function update(request, reply) {
    if (request.payload.order.id_coupon === '') {
        request.payload.order.id_coupon = null;
    }
    let orderOld = request.pre.getOrderById;
    let orderDetailOld = orderOld.order_detail;
    let orderNew = request.payload.order;
    let orderDetailNew = orderNew.order_detail;
    let user = request.pre.getAuthUser;
    let productBalance = request.pre.getConfig;
    // return reply({ orderDetailOld });

    // Create auditLog
    request.auditLog.logEvent(
        user._id.toString(),
        'mongoose',
        'update',
        'order',
        JSON.stringify({ new: orderNew, old: orderOld }),
        'Chỉnh sửa đơn hàng'
    );
    let orderUpdate = _.extend(orderOld, orderNew);
    let promise = orderUpdate.save();
    promise.then(function (order) {
        // update product has been order
        Config.findOne({ name: 'ProductBalance' }, function (err, cfProductBalance) {
            if (err || cfProductBalance == null)
                cfProductBalance.value = 1;
            // Start:Restore status, quantity product list
            let list_func_restore = [];
            orderDetailOld.forEach(function (item) {
                list_func_restore.push(function (callback) {
                    Product.findById(item.product, function (err, product) {
                        product.qty_in_stock += item.order_quantity;
                        if (product.qty_in_stock <= 0)
                            product.qty_in_stock = 0;
                        if (product.qty_in_stock <= cfProductBalance.value)
                            product.status = 'SHH'; // Change status: Shắp hết hàng
                        let promise = product.save();
                        promise.then(function (resp) {
                            callback(null);
                        })
                    })
                })
            })
            // End: Restore status, quantity product list

            // Start:Update status, quantity product list
            async.parallel(list_func_restore, function (err, result) {
                if (err) {
                    return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
                }
                let list_func_update = [];
                order.order_detail.forEach(function (item) {
                    list_func_update.push(function (callback) {
                        Product.findById(item.product, function (err, product) {
                            product.qty_in_stock -= item.order_quantity;
                            if (product.qty_in_stock <= 0)
                                product.qty_in_stock = 0;
                            if (product.qty_in_stock <= cfProductBalance.value)
                                product.status = 'SHH'; // Change status: Sắp hết hàng
                            let promise = product.save();
                            promise.then(function (resp) {
                                callback(null);
                            })
                        })
                    })
                })
                async.parallel(list_func_update, function (err, result) {
                    if (err) {
                        return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
                    }
                    return reply({ success: true });
                })
            })
            // Start:Restore status, quantity product list
        })
        // End update product has been order

    }).catch(function (err) {
        return reply({ err: err });
    });
}

function del(request, reply) {
    let order = request.pre.getOrderById;
    let orderDelete = Order.remove({ _id: request.params.id });
    let user = request.pre.getAuthUser;

    orderDelete.then(function (resp) {
        // Create auditLog
        request.auditLog.logEvent(
            user._id.toString(),
            'mongoose',
            'delete',
            'order',
            JSON.stringify({ old: order, new: null }),
            'Xóa đơn hàng'
        );
        reply({ success: true });
    });
}


function isFirstOrder(request, reply) {
    let userId = request.params.userId;
    let orderId = request.params.orderId;

    if (!userId || !orderId) return reply(Boom.badRequest('Params does not match'));

    orderHelper.checkFirstOrderOfUser(userId).then(function () {
        return reply({
            success: false,
            message: 'User have no order'
        });
    }).catch(function (err) {
        if (err.message == orderId) {
            return reply({ success: true, first_order: err.message });
        }
        return reply({ success: false, message: err.message });
    })
}

function isFirstOrderCreate(request, reply) {
    let userId = request.params.user_id;

    let promise = Order.findOne({ 'payment_info.info.user_id': userId });
    promise.then(function (resp) {
        if (resp) {
            return reply({ isFirstOrder: false });
        }
        return reply({ isFirstOrder: true });
    })
}


function checkCoupon(request, reply) {

    let coupon = request.params.coupon;
    let order = request.payload;
    let userId = order.payment_info.info.user_id || '';

    if (!order) return reply({ code: 'Order', message: 'Vui lòng nhập thông tin giao hàng trước' });

    return orderHelper.checkCoupon({
        codeCoupon: coupon,
        order: order,
        userId: userId
    }).then(function (resp) {
        return reply({ success: true, coupon: resp.coupon, money_coupon: resp.money_coupon });
    }).catch(function (err) {
        let message = err.message;
        if (err.message === 'Not found')
            message = 'Mã khuyến mãi không tồn tại';

        if (err.message === 'Internal')
            message = 'Thời gian khuyến mãi không hợp lệ';

        if (err.message === 'Category')
            message = 'Mã khuyến mãi không được áp dụng cho sản phẩm trong đơn hàng';

        if (err.message === 'District')
            message = 'Mã áp dụng không được áp dụng cho địa chỉ giao hàng';

        if (err.message === 'Total')
            message = 'Tổng tiền không đủ điều kiện áp dụng khuyến mãi';

        if (err.message === 'Count')
            message = 'Mã khuyến mãi đã hết số lần sử dụng';

        if (err.message === 'Money coupon equal 0')
            message = 'Mã khuyến mãi không có tác dụng với đơn hàng của bạn';

        if (err.message === 'Must be login')
            message = 'Cần phải chọn khách để áp dụng coupon';

        if (err.message === 'Limit')
            message = 'Coupon chỉ được sử dụng 1 lần cho mỗi khách hàng';

        return reply({
            success: false,
            err: {
                message: message
            }
        });
    });
}
// order.order_detail.forEach(function (detail, index) {
//     let flagCase = 0;
//     Product.findById(detail.product, function (err, product) {
//         // Trường hợp sản phẩm trong order mới thay đổi số lượng so với order cũ
//         orderDetailOld.forEach(function (old_detail, index) {
//             if (old_detail.product == detail.product) {
//                 console.log('--------------------------------------', 'up', detail.order_quantity, ' ', old_detail.order_quantity);
//                 flagCase = 1;
//                 product.qty_in_stock -= (detail.order_quantity - old_detail.order_quantity);
//             };
//         })

//         // Trường hợp sản phẩm dược thêm mới vào order
//         if (flagCase == 0) {
//             flagCase = 1;
//             console.log('--------------------------------------', 'middle', detail.order_quantity);
//             product.qty_in_stock -= detail.order_quantity;
//         }

//         if (product.qty_in_stock <= 0)
//             product.qty_in_stock = 0;
//         if (product.qty_in_stock <= cfProductBalance.value)
//             product.status = 'SHH'; // Change status: Shắp hết hàng
//         product.save();
//     })
// });

// // Trường hợp sản phẩm bị xoá khỏi order
// orderDetailOld.forEach(function (old_detail, index) {
//     let order_new_has_product = false;
//     // tìm trong order mới
//     order.order_detail.forEach(function (new_detail, index) {
//         if (new_detail.product == old_detail.product) {
//             order_new_has_product = true;
//         }
//     });
//     //order mới không có
//     if (!order_new_has_product) {
//         Product.findById(old_detail.product, function (err, product) {
//             console.log('---------------------------------------------------------------', 'down', old_detail.order_quantity);
//             product.qty_in_stock += old_detail.order_quantity;
//             if (product.qty_in_stock > cfProductBalance.value)
//                 product.status = 'CH'; // Change status: Còn hàng
//             product.save();
//         });
//     }

// });