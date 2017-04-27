'use strict';

const mongoose = require('mongoose');
const _ = require('lodash');
const Coupon = mongoose.model('Coupon');
const Product = mongoose.model('Product');
const Category = mongoose.model('Category');
const Order = mongoose.model('Order');
const User = mongoose.model('User');
const Config = mongoose.model('Config');
const Boom = require('boom');

const async = require('asyncawait/async');
const await = require('asyncawait/await');

const Promise = require("bluebird");

module.exports = {
    checkCoupon,
    checkFirstOrderOfUser,
    getConfigs,
    mailOrderSuccess,
};

function mailOrderSuccess (doc, request){
    // email
    let config = request.server.configManager;
    let context = doc.toObject();
    if(context && context.payment_method == 'COD')
        context.payment_method = "Thanh toán khi giao hàng (COD)";
    if(context && context.payment_method == 'CK')
        context.payment_method = "Thanh toán chuyển khoản";

    if(context && context.shiper == 'SPT')
        context.shiper = "SPT";
    if(context && context.shiper == 'GHN')
        context.shiper = "GHN";
    if(context && context.shiper == 'AHM')
        context.shiper = "Ahamove (AHM)";

    context.xxx = context.total+context.payment_info.info.shipping_fee - context.total_pay;
    context.khuyenmai = String(context.xxx.toFixed(2)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    context.total = String(context.total).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    context.total_pay = String(context.total_pay).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    context.payment_info.info.shipping_fee = String(context.payment_info.info.shipping_fee).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    for (let key in context.order_detail) {
        if (context.order_detail.hasOwnProperty(key)) {
            context.order_detail[key].total = String(context.order_detail[key].total).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
    }

    let emailData = {
        "from": config.get('web.email.from'),
        "to": { name: context.payment_info.info.full_name, address: context.payment_info.info.email },
        "bcc": [
        { name: 'Mua Hàng Việt', address: 'support@muahangviet.com.vn' },
        { name: 'Mua Hàng Việt', address: 'cs@chorus.vn' }
        ],
        "subject": "Đặt hàng thành công trên hệ thống Mua Hàng Việt, cho đơn hàng # "+context.id_order,
        "html": "Order Success",
        "template": {
            "name": "ordersuccess",
            "context": context
        },
        "text": ""
    };
    
    let pubsub = request.server.plugins['app-pubsub'].pubsub;
    pubsub.publish('api-sendmail', emailData, function () {
        request.log(['info', 'order'], 'Create order success');
    });
}

function checkCoupon(data) {
    return new Promise(function (resolve, reject) {
        let codeCoupon = data.codeCoupon;
        let order = data.order;
        let userId = data.userId == undefined ? null : data.userId;

        // console.log(11121323, order._id);
        // Nếu order 
        let isUpdateModeCheck = false; // Cờ đánh dấu bỏ qua một số điều kiện khi check
        let money_coupon = 0; // tiền khuyến mãi order


        let products = order.order_detail.map(function (item) {
            return item.product;
        });

        let search = async(function () {

            // Search list product
            if (!codeCoupon) {
                return { success: true };
            }
            let productList = await(Product.find({
                _id: {
                    $in: products
                }
            }).populate({
                path: 'category_list',
                populate: {
                    path: 'sub_category',
                    populate: {
                        path: 'sub_category',
                        populate: {
                            path: 'sub_category'
                        }
                    }
                },
            }).lean());

            // Find coupon
            let option = {
                code: codeCoupon,
                status: "active",
            };
            let coupon = await(Coupon.findOne(option).populate('apply_district.district').lean());
            if (!coupon) {
                return reject(Boom.badRequest('Not found')
                    );
            }

            // Start: check coupon
            // Check coupon between in start date and end date
            let internal = coupon.internal;
            if (internal.is_internal) {
                if (!(internal.start_date <= new Date() && new Date() <= internal.end_date)) {
                    return reject(Boom.badRequest('Internal'
                        ));
                }
            }

            // Check in category
            let product = coupon.apply_product;
            //Danh sach category trong order dua len
            let listCategoryInOrder = [];
            productList.forEach(function (item, index) {
                item.category_list.forEach(function (category) {
                    listCategoryInOrder.push('' + category._id);
                })
            })

            // Danh sach category duoc apply tu coupon
            let listIdCategoryApply = product.products.join(',').split(','); // khởi tạo

            if (product.is_product) {

                // đệ quy lấy tất cả các category con
                let getAllCategoryApply = function (index, callback) {
                    if (index == listIdCategoryApply.length)
                        callback(listIdCategoryApply);
                    else {
                        let listSubCategory = await(Category.find({ parrent_id: listIdCategoryApply[index] }));
                        listSubCategory.forEach(function (item, i) {
                            listIdCategoryApply.push('' + item._id);
                        })
                        if (listSubCategory) {
                            getAllCategoryApply(index + 1, callback);
                        }
                        else {
                            console.log('Error with await: ', listSubCategory);
                            return callback(listSubCategory);
                        }
                    }
                }
                let checkExittCateApply = function (listIdCategoryApplyResult) {
                    if (_.intersection(listIdCategoryApplyResult, listCategoryInOrder).length === 0) {
                        return reject(Boom.badRequest(
                            'Category'
                            ));
                    }
                }
                getAllCategoryApply(0, checkExittCateApply)
            }

            // Check in district
            let district = coupon.apply_district;
            if (district.is_district) {
                let checkDistrict = district.district.find(function (item) {
                    return ('' + order.id_shipping_fee) == (item._id + '');
                });
                if (!checkDistrict) {
                    return reject(Boom.badRequest(
                        'District'
                        ));
                }
            }

            // Check order total
            let orderCheck = coupon.apply_order;
            if (orderCheck.is_order) {
                if (order.total < orderCheck.money) {
                    return reject(Boom.badRequest('Total'));
                }
            }

            // Check require login
            if (!userId || userId == '') {
                return reject(Boom.badRequest(
                    'Must be login'
                    ));
            }

            //set flag check coupon
            let orderExitsInDB = await(Order.findOne({
                _id: order._id
            }).lean());

            if (orderExitsInDB)
                isUpdateModeCheck = true;

            // check so lan su dung
            if (!isUpdateModeCheck) {
                if (!coupon.count) {
                    let count = await(Order.count({ id_coupon: coupon._id }));
                    if (count > 0) {
                        return reject(Boom.badRequest(
                            'Count'
                            ));
                    }
                }
                else {
                    let ord = await(Order.findOne({ 'payment_info.info.user_id': userId, 'coupon.code': codeCoupon }));
                    if (ord) {
                        return reject(Boom.badRequest(
                            'Limit'
                            ));
                    }

                }
            }
            // check lại đối với trường hợp isUpdateMode
            // Khi order cũ thay đổi coupon => check Count & Limit khi order thay đổi coupon
            else {
                let orderUpdate = await(Order.findOne({
                    _id: order._id
                }).lean());

                if (orderUpdate.coupon.code !== codeCoupon) {
                    if (!coupon.count) {
                        let count = await(Order.count({ id_coupon: coupon._id }));
                        if (count > 0) {
                            return reject(Boom.badRequest(
                                'Count'
                                ));
                        }
                    }
                    else {
                        let ord = await(Order.findOne({ 'payment_info.info.user_id': userId, 'coupon.code': codeCoupon }));
                        if (ord) {
                            return reject(Boom.badRequest(
                                'Limit'
                                ));
                        }

                    }
                }
            }



            // Check order total
            // Nếu sau khi khuyên mãi tiên order âm thì k cho áp dụng

            if (coupon.sale.is_money) {
                money_coupon = coupon.sale.money_value;
            }
            if (coupon.sale.is_percent) {
                money_coupon = (coupon.sale.percent_value / 100) * order.total;
            }

            // Tính tiền khuyến mãi trong trường hợp áp dụng cho danh mục sản phẩm
            if (product.is_product) {
                money_coupon = 0; //reset money
                // tính lại 
                productList.forEach(function (item, index) {

                    let listCategoryProduct = [];
                    item.category.map(function (item) {
                        listCategoryProduct.push('' + item)
                    });
                    if ((_.intersection(listCategoryProduct, listIdCategoryApply).length != 0) && item.id_promotion == null) {

                        let detailOrderProduct = order.order_detail.find(function (detail) {
                            // lấy detail sản phẩm cùng id
                            return ('' + item._id) == ('' + detail.product);
                        });
                        if (coupon.sale.is_money && !detailOrderProduct.id_promote.id) {
                            // CASE 1: tiền khuyến mãi lớn hơn tiền order mặt hàng(sản phẩm * số lượng)
                            if (coupon.sale.money_value >= (detailOrderProduct.price * detailOrderProduct.order_quantity)) {
                                money_coupon += detailOrderProduct.total;
                            }
                            else { //CASE 2: tiền khuyến mãi nhỏ hơn tiền mặt hàng đặt
                                money_coupon += coupon.sale.money_value;
                            }
                        }
                        if (coupon.sale.is_percent) {
                            money_coupon += (coupon.sale.percent_value / 100) * detailOrderProduct.total;
                        }
                    }
                })
            }
            // End: check coupon

            if (money_coupon == 0) {
                return reject(Boom.badRequest('Money coupon equal 0'));
            }

            if (order.total - money_coupon < 0) {
                return reject(Boom.badRequest('Total'));
            }

            return { coupon: coupon, money_coupon: money_coupon };
        })

        // Call async function
        return search().then(function (resp) {
            return resolve(resp);
        })
    });
}


function checkFirstOrderOfUser(userId = null) {

    return new Promise(function (resolve, reject) {
        if (!userId) {
            return reject(new Error('Parameter does not match'));
        }
        return User.findById(userId, function (err, user) {
            if (err || !user) {
                return reject(new Error('Query Error Or User does not exits!'));
            }

            return Order.findOne({ 'payment_info.info.user_id': userId }).sort({ createdAt: 1 }).exec(
                function (er, order) {
                    if (er) {
                        return reject(new Error('Error occur on get list order. Try again!'
                            ));
                    }
                    if (order)
                        return reject(new Error('' + order._id));

                    return resolve({
                        success: true,
                        message: 'This is first order for user: ' + user.name,
                    });
                })
        })
    });


}


function getConfigs() {
    return new Promise(function (resolve, reject) {
        // set default value
        let data = {
            ProductBalance: 3,
            FreeShipConfig: {
                Urban: {
                    value: 999999999,
                    status: false,
                    description: '',
                    type: 'MN'
                },
                Suburb: {
                    value: 999999999,
                    status: false,
                    description: '',
                    type: 'MN'
                }
            },
            OrderDeleveryOnAffernoon: {
                value: 0,
                status: false,
                description: '',
                type: 'PC'
            },
            FirstOrder: {
                value: 0,
                status: false,
                description: '',
                type: 'PC'
            }
        };

        Config.find({}, function (err, listConf) {
            if (err) return resolve(data);
            listConf.forEach(function (cf, i) {
                if (cf.name == 'onSale_order_DT' && cf.status) // đon hàng đầu tiên
                    data.FirstOrder = cf;
                if (cf.name == 'onSale_order_NT' && cf.status) // nội thành
                    data.FreeShipConfig.Urban = cf;
                if (cf.name == 'onSale_order_NGT' && cf.status) // ngoại thành
                    data.FreeShipConfig.Suburb = cf;
                if (cf.name == 'onSale_order_BC' && cf.status) // giao hàng buổi chiều
                    data.OrderDeleveryOnAffernoon = cf;
            });

            return resolve(data);
        });
    })
}