'use strict';
const _ = require('lodash');
const mongoose = require('mongoose');
const Product = mongoose.model('Product');
const User = mongoose.model('User');
const Joi = require('joi');
const Order = mongoose.model('Order');
const ShippingFee = mongoose.model('ShippingFee');
const Coupon = mongoose.model('Coupon');
const Config = mongoose.model('Config');
const asyncC = require('async');

var numeral = require('numeral');
const async = require('asyncawait/async');
const await = require('asyncawait/await');

const orderHelper = require(BASE_PATH + '/app/modules/api-order/util/order.js');

const Boom = require('boom');
const ErrorHandler = require(BASE_PATH + '/app/utils/error.js');

module.exports = {
    completeOrder,
    applyCoupon,

    getCart,

    setQuantity,
    deleteProductInCart,
    deleteCart,

    getListShippingFee,
    getListShippingAddress,
    addProductToCart,

    getConfigFreeShip,
    getConfigTextOrder,
    cfOrderAffernoon,

    checkFirstOrderOfUser,
};

function addProductToCart(request, reply) {
    let product_id = request.params.product_id;
    let quantity = request.params.quantity;

    if (parseInt(quantity) < 0)
        return reply({
            success: false,
            message: 'Không thể đặt số lượng âm'
        });

    Product.findOne({ _id: product_id }, function (err, product) {
        if (err)
            return reply({
                success: false,
                message: 'Không tìm thấy sản phẩm trên hệ thống'
            });

        if (product == null)
            return reply({
                success: false,
                message: 'Không tìm thấy sản phẩm trên hệ thống'
            });

        if (product.qty_in_stock < quantity)
            return reply({
                success: false,
                message: 'Kho không đủ số lượng hàng đặt',
                data: {
                    qty_in_stock: product.qty_in_stock
                }
            });

        if (product.due_date) {
            if (product.due_date.end_date < Date.now())
                return reply({
                    success: false,
                    message: 'Sản phẩm hết hạn, chưa nhập kho'
                });
        }

        let Cart = request.server.plugins['service-cart'];
        Cart.addItem(request.auth.credentials.id, product_id, quantity).then(function (resp) {
            return Cart.getCart(request.auth.credentials.id).then(function (cart) {
                let total = 0, total_quantity = 0;

                // Tính tổng tiền đơn hàng
                cart.items.forEach((val, index) => {
                    let price = val.product.id_promotion == null ? val.product.price : (val.product.id_promotion.type == 'PC' ? (val.product.price - (val.product.price * (val.product.id_promotion.value / 100)))
                        : (val.product.price - val.product.id_promotion.value))

                    total += val.quantity * price;
                    total_quantity += val.quantity;
                });

                return reply({ success: true, message: 'Thêm thành công', data: resp.data, cart: { items: cart.items, total: total, total_quantity: total_quantity } });
            }).catch(function (err) {
                return reply({ success: true, message: 'Thêm thành công', data: resp.data, cart: null });
            }) // end catch get cart
        }).catch(function (err) {
            return reply({
                success: false,
                message: '' + err
            });
        }); // end catch add item
    });
}

function getCart(request, reply) {
    if (!request.auth.credentials) return reply.redirect('/');
    let dataReply = {
        success: false,
        cart: {
            id: null,
            items: [],
            total: 0,
            total_quantity: 0
        }
    };

    let Cart = request.server.plugins['service-cart'];
    Cart.getCart(request.auth.credentials.id).then(function (cart) {
        cart.items.forEach((val, index) => {
            let price = val.product.id_promotion == null ? val.product.price : (val.product.id_promotion.type == 'PC' ? (val.product.price - (val.product.price * (val.product.id_promotion.value / 100)))
                : (val.product.price - val.product.id_promotion.value))

            dataReply.cart.total += val.quantity * price;
            dataReply.cart.total_quantity += val.quantity;
        });
        dataReply.cart.id = cart.id;
        dataReply.cart.items = cart.items;
        dataReply.success = true;
        return reply(dataReply);
    }).catch(function (err) {
        return reply(dataReply);
    }) // end catch
}

function applyCoupon(request, reply) {

    let coupon = request.params.coupon;
    let order = request.pre.order;
    let userId = request.auth.credentials.uid;

    if (!order) return reply({ code: 'Order', message: 'Vui lòng nhập thông tin giao hàng trước' });

    return orderHelper.checkCoupon({
        codeCoupon: coupon,
        order: order,
        userId: userId
    }).then(function (resp) {
        return reply({ success: true, coupon: resp.coupon, money_coupon: resp.money_coupon });
    }).catch(function (resp) {
        let err = { success: false, code: resp.message, message: '' };
        if (err.code === 'Not found')
            err.message = 'Mã khuyến mãi không tồn tại';

        if (err.code === 'Internal')
            err.message = 'Thời gian khuyến mãi không hợp lệ';

        if (err.code === 'Category')
            err.message = 'Mã khuyến mãi không được áp dụng cho sản phẩm trong đơn hàng';

        if (err.code === 'District')
            err.message = 'Mã áp dụng không được áp dụng cho địa chỉ giao hàng';

        if (err.code === 'Total')
            err.message = 'Tổng tiền không đủ điều kiện áp dụng khuyến mãi';

        if (err.code === 'Count')
            err.message = 'Mã khuyến mãi này đã hết số lần sử dụng';

        if (err.code === 'Money coupon equal 0')
            err.message = 'Mã khuyến mãi không có tác dụng với đơn hàng của bạn';

        if (err.code === 'Must be login')
            err.message = 'Vui lòng đăng nhập để sử dụng mã giảm giá này';

        if (err.code === 'Limit')
            err.message = 'Bạn chỉ được sử dụng mã khuyến mãi này 1 lần';

        return reply(err);
    });
}

function setQuantity(request, reply) {
    let product_id = request.params.product;
    let quantity = request.params.quantity;
    if (!product_id)
        return reply({
            success: false,
            message: 'Xảy ra lỗi với sản phẩm. Vui lòng thử lại'
        })
    if (!quantity)
        return reply({
            success: false,
            message: 'Xảy ra lỗi với số lượng. Vui lòng thử lại'
        })

    Product.findOne({ _id: product_id }, function (err, product) {
        if (err)
            return reply({
                success: false,
                message: 'Không tìm thấy sản phẩm trên hệ thống'
            });

        if (product == null)
            return reply({
                success: false,
                message: 'Không tìm thấy sản phẩm trên hệ thống'
            });

        if (product.qty_in_stock < quantity)
            return reply({
                success: false,
                message: 'Kho hết hàng',
                data: {
                    qty_in_stock: product.qty_in_stock
                }
            });

        if (product.due_date) {
            if (product.due_date.end_date < Date.now())
                return reply({
                    success: false,
                    // message: 'Sản phẩm hết hạn, chưa nhập kho'
                    message: 'Sản phẩm chưa nhập kho'
                });
        }
        let Cart = request.server.plugins['service-cart'];
        Cart.setQuantity(request.auth.credentials.id, product_id, quantity).then(function (resp) {
            return Cart.getCart(request.auth.credentials.id).then(function (cart) {
                let total = 0, total_quantity = 0;
                cart.items.forEach((val, index) => {
                    let price = val.product.id_promotion == null ? val.product.price : (val.product.id_promotion.type == 'PC' ? (val.product.price - (val.product.price * (val.product.id_promotion.value / 100)))
                        : (val.product.price - val.product.id_promotion.value))

                    total += val.quantity * price;
                    total_quantity += val.quantity;
                });
                resp.cart = { items: cart.items, total: total, total_quantity: total_quantity };
                return reply(resp);
            }).catch(function (err) {
                resp.cart = null;
                return reply(resp);
            }) // end catch get cart
        }).catch(function (err) {
            return reply({
                success: false,
                message: 'Cart does not exits'
            })
        })

    });
}

function deleteCart() {
    return {
        handler: function (request, reply) {
            let Cart = request.server.plugins['service-cart'];
            Cart.deleteCart(request.auth.credentials.id).then(function (resp) {
                return reply(resp);
            }).catch(function (err) {
                return reply({ success: false, message: 'Session does not exits' });
            }) // end catch
        },
        description: 'delete Cart',
    };
}

function deleteProductInCart(request, reply) {
    let product_id = request.params.product || request.payload.product;
    if (!product_id) return reply({
        success: false,
        message: 'Occurs error with product'
    });

    let Cart = request.server.plugins['service-cart'];
    Cart.deleteItem(request.auth.credentials.id, product_id).then(function (resp) {
        return Cart.getCart(request.auth.credentials.id).then(function (cart) {
            let total = 0, total_quantity = 0;
            cart.items.forEach((val, index) => {
                let price = val.product.id_promotion == null ? val.product.price : (val.product.id_promotion.type == 'PC' ? (val.product.price - (val.product.price * (val.product.id_promotion.value / 100)))
                    : (val.product.price - val.product.id_promotion.value))

                total += val.quantity * price;
                total_quantity += val.quantity;
            });
            resp.cart = { items: cart.items, total: total, total_quantity: total_quantity };
            return reply(resp);
        }).catch(function (err) {
            resp.cart = null;
            return reply({ resp, cart: null });
        }) // end catch get cart
    }).catch(function (err) {
        if (err) return reply({
            success: false,
            message: 'Can not find cart because session does not exits'
        })
    });
}

function getListShippingFee(request, reply) {
    let query = ShippingFee.find({}).lean();
    query.exec(function (err, res) {
        if (res) return reply({
            success: true,
            data: res
        });

        return reply({
            success: false,
            data: []
        });
    })
}

function getListShippingAddress(request, reply) {
    let dataReply = {
        success: false,
        userId: null,
        list_shipping_address: []
    };
    dataReply.userId = request.auth.credentials.uid == '' ? '' : request.auth.credentials.uid

    if (dataReply.userId == '') return reply(dataReply);

    var query = User.findOne({ _id: dataReply.userId });
    query.select('customer');
    query.populate(' customer.shipping_address.id_shipping_fee ');

    query.exec(function (err, user_address) {
        if (user_address) {
            dataReply.success = true;
            dataReply.list_shipping_address = user_address.customer.shipping_address;
            return reply(dataReply);
        }
        else
            return reply(dataReply);
    });
}

function completeOrder(request, reply) {
    let order = request.pre.order;


    if (!order) {
        return reply(Boom.badRequest('Giỏ hàng không tồn tại. Vui lòng thử lại'));
    }
    if (order.payment_info.info.full_name === '') {
        return reply(Boom.badRequest('Vui lòng nhập tên quý khách'));
    }
    if (order.payment_info.info.phone === '') {
        return reply(Boom.badRequest('Vui lòng nhập số điện thoại để tiếp tục'));
    }
    if (order.id_shipping_fee == null) {
        return reply(Boom.badRequest('Vui lòng chọn quận huyện để tiếp tục'));
    }
    if (order.payment_info.info.address === '') {
        return reply(Boom.badRequest('Vui lòng nhập địa chỉ giao hàng chi tiết để hoàn tất'));
    }
    if (order.order_detail.length == 0) {
        return reply(Boom.badRequest('Vui lòng thêm sản phẩm vào đơn hàng của bạn'));
    }

    asyncC.each(order.order_detail, function (detail, callback) {
        Product.findById(detail.product, function (err, product) {
            if (product.qty_in_stock < detail.order_quantity)
                callback(product);
            else callback();
        })
    },
        function (err) {
            if (err) {
                return reply(Boom.badRequest('Sản phẩm ' + err.name + ' vượt quá số lượng còn trong kho'));
            }
            else {
                // Out of error range
                //save and reply
                var saveAndReply = function () {

                    //save to db
                    let promise = order.save();
                    return promise.then(function (resp) {

                        resp.populate({
                          path: 'order_detail.product',
                          // select: 'name picture'
                        }, function(err, doc) {
                            // Exec function asynchronous
                            // update product 
                            updateProduct();

                            //set log 
                            let user_id = request.auth.credentials.uid == "" ? "guest" : request.auth.credentials.uid;
                            request.auditLog.logEvent(
                                user_id,
                                'mongoose',
                                'completeOrder',
                                'api-order',
                                JSON.stringify({ new: doc, old: null }),
                                'user ordering'
                            );

                            //email
                            orderHelper.mailOrderSuccess(doc, request);


                            return reply(doc);
                        });

                        
                    })
                        .catch(function (err) {
                            // console.log('ERROR1: ->>>: ', err);
                            request.log(['error', 'order'], err)
                            return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
                        }); //end save
                } // End save and reply


                // Add shipping address for user if user logined and ship to new address
                let addShippingAddress = function () {
                    if (!order.payment_info.info.id_shipping_address && order.payment_info.info.user_id != null) {
                        var shipping_address = {
                            name: order.payment_info.info.full_name,
                            phone: order.payment_info.info.phone,
                            address_detail: order.payment_info.info.address,
                            id_shipping_fee: order.id_shipping_fee,
                            vocative: order.payment_info.info.vocative
                        };
                        return User.findById(order.payment_info.info.user_id).exec().then(function (user) {
                            if (user) {
                                user.customer.shipping_address.push(shipping_address);
                                return user.save(function (er, us) {
                                    let user_id = request.auth.credentials.uid == "" ? "guest" : request.auth.credentials.uid;
                                    request.auditLog.logEvent(
                                        user_id,
                                        'mongoose',
                                        'completeOrder',
                                        'api-order',
                                        JSON.stringify({ new: us, old: user }),
                                        'auto add shipping address for user'
                                    );
                                    order.payment_info.info.id_shipping_address = us.customer.shipping_address[us.customer.shipping_address.length - 1]._id;
                                    return saveAndReply();
                                });
                            }
                            else {
                                return saveAndReply();
                            }
                        }).catch(function (err) {
                            request.log(['error', 'order'], err);
                            return saveAndReply();
                        });
                    }
                    else {
                        return saveAndReply();
                    }
                }

                // Update product: quantity in stock and label
                function updateProduct() {
                    Config.findOne({ name: 'ProductBalance' }, function (err, cfProductBalance) {
                        if (err)
                            cfProductBalance.value = 1;
                        order.order_detail.forEach(function (detail, index) {
                            Product.findById(detail.product, function (err, product) {
                                product.qty_in_stock -= detail.order_quantity;
                                if (product.qty_in_stock <= 0)
                                    product.qty_in_stock = 0;
                                if (product.qty_in_stock <= cfProductBalance.value)
                                    product.status = 'SHH'; // Change status: Sắp hết hàng

                                product.save(function (err, p) {
                                    let user_id = request.auth.credentials.uid == "" ? "guest" : request.auth.credentials.uid;
                                    request.auditLog.logEvent(
                                        user_id,
                                        'mongoose',
                                        'completeOrder',
                                        'api-order',
                                        JSON.stringify({ new: p, old: product }),
                                        'auto update quantity in stock and status for Product'
                                    );
                                });
                            })
                        })
                    })

                }
                // Exec function asynchronous
                // updateProduct();

                // set shipping fee
                var setShippingFee = function (configs) {
                    // Tính fee ship sau khi tru các khuyến mãi
                    return ShippingFee.findById(order.id_shipping_fee).exec().then(function (shipping_fee) {
                        order.payment_info.info.shipping_fee = shipping_fee.fee;

                        if ((shipping_fee.type == 1 || shipping_fee == '1') && order.total_pay > configs.FreeShipConfig.Urban.value) //noi thanh
                            order.payment_info.info.shipping_fee = 0;
                        if ((shipping_fee.type == 2 || shipping_fee == '2') && order.total_pay > configs.FreeShipConfig.Suburb.value) //ngoai thanh
                            order.payment_info.info.shipping_fee = 0;

                        order.total_pay += order.payment_info.info.shipping_fee;

                        if (order.total_pay <= 0) {
                            return reply(Boom.badRequest('Không thể áp dụng quá nhiều khuyến mãi. Vui lòng mua thêm hàng hoặc huỷ mã giảm giá'))
                        };

                        return addShippingAddress();
                    }).catch(function (err) {
                        return reply(Boom.badRequest('Địa chỉ giao hàng không hợp lệ. Vui lòng thử lại'))
                    })
                }

                //set total pay
                var setTotalPay = function (money_coupon) {
                    order.total_pay = order.total;
                    order.total_pay -= money_coupon;

                    // order.total_pay += order.payment_info.info.shipping_fee;

                    return orderHelper.getConfigs().then(function (configs) {
                        if (order.delivery_time == 'CHIEU') {
                            if (configs.OrderDeleveryOnAffernoon.status) {
                                if (configs.OrderDeleveryOnAffernoon.type == "MN") {
                                    // tru tien
                                    order.total_pay -= configs.OrderDeleveryOnAffernoon.value;
                                } else { //PC 
                                    order.total_pay -= ((configs.OrderDeleveryOnAffernoon.value / 100) * order.total);
                                }
                            }
                        }

                        return orderHelper.checkFirstOrderOfUser(order.payment_info.info.user_id).then(function (resp) {
                            if (resp.success) {
                                if (configs.FirstOrder.status) {
                                    if (configs.FirstOrder.type == "MN") { // tien
                                        order.total_pay -= configs.FirstOrder.value;
                                    }
                                    else { // phan tram
                                        order.total_pay -= order.total * (configs.FirstOrder.value / 100);
                                    }
                                }
                            }

                            return setShippingFee(configs);

                        }).catch(function (err) {
                            return setShippingFee(configs);
                        })
                    }); // end get config
                }// End set total pay

                // caculating total pay
                if (order.id_coupon) {
                    return Coupon.findOne({ _id: order.id_coupon, status: 'active' }, function (err, coupon) {
                        let money_coupon = 0;
                        if (coupon) {
                            return orderHelper.checkCoupon({ order: order, codeCoupon: coupon.code, userId: request.auth.credentials.uid }).then(function (resp) {
                                money_coupon = resp.money_coupon;

                                // set coupon's info static to order
                                order.coupon.code = coupon.code;
                                order.coupon.name = coupon.name;
                                order.coupon.value = resp.money_coupon;
                                order.coupon.type = coupon.type;

                                coupon.used_times_count += 1;
                                coupon.save(); // update used_times_count coupon
                                // Shipping Fee 
                                return setTotalPay(money_coupon);
                            }).catch(function (err) {
                                // console.log(err);
                                return reply(Boom.badRequest('Error code: ' + err.code + '. Đơn hàng và mã khuyến mãi không hợp lệ'));
                            });
                        }
                        if (err) {
                            return reply(Boom.badRequest('Mã khuyến mãi không tồn tại! Hãy thử lại!'));
                        }
                    }); //end coupon
                }
                else {
                    // Shipping Fee 
                    return setTotalPay(0);
                } // End caculating total pay

            } // End else order
        })
}


function checkFirstOrderOfUser(request, reply) {
    let userId = request.params.userId || request.auth.credentials.uid;
    if (!userId || userId == '')
        return reply(Boom.badRequest('Error request params'));

    return orderHelper.checkFirstOrderOfUser(userId).then(function (resp) {
        return orderHelper.getConfigs().then(function (cfs) {
            return reply({
                success: true,
                message: 'This is first order for user',
                config: cfs.FirstOrder
            })
        });
    }).catch(function (err) {
        return reply({ success: false, message: err.message });
    })
}

function getConfigTextOrder(request, reply) {
    let dataReply = {
        data: [{
            name: 'text1',
            description: ''
        }]
    }
    let getcf = async(function () {
        let onSale_order_NT = await(Config.findOne({ name: 'onSale_order_NT' }).exec());
        if (onSale_order_NT)
            dataReply.data[0].description += 'Miễn phí giao hàng nội thành cho đơn hàng trên ' + numeral(onSale_order_NT.value).format('0,0') + ' ₫';

        let onSale_order_NGT = await(Config.findOne({ name: 'onSale_order_NGT' }).exec());
        if (onSale_order_NGT)
            dataReply.data[0].description += ' và ngoại thành cho đơn hàng trên ' + numeral(onSale_order_NGT.value).format('0,0') + ' ₫';

        let onSale_order_BC = await(Config.findOne({ name: 'onSale_order_BC' }).exec());
        if (onSale_order_BC)
            dataReply.data.push(onSale_order_BC);

        return dataReply;
    });

    getcf().then(function (dataReply) {
        return reply(dataReply);
    })

}


function cfOrderAffernoon(request, reply) {
    orderHelper.getConfigs().then(function (resp) {
        return reply(resp.OrderDeleveryOnAffernoon);
    }).catch(function (data) {
        return reply(Boom.badRequest('Error unknown!'));
    });
}


function getConfigFreeShip(request, reply) {
    orderHelper.getConfigs().then(function (resp) {
        return reply(resp.FreeShipConfig);
    }).catch(function () {
        return reply(Boom.badRequest('Error unknown!'));
    })
}