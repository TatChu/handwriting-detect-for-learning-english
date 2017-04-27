'use strict';
const Boom = require('boom');
const Joi = require('joi');
const mongoose = require('mongoose');
const ErrorHandler = require(BASE_PATH + '/app/utils/error.js');
const _ = require('lodash');
const fs = require('fs');
const util = require('util');
const slug = require('slug');
const asyncCao = require('async');
const async = require('asyncawait/async');
const await = require('asyncawait/await');
const moment = require('moment');

const Order = mongoose.model('Order');
const Product = mongoose.model('Product');

module.exports = {
    reportProductOrder,
    reportProductADay
};

function reportProductOrder(request, reply) {
    let config = request.server.configManager;
    let page = parseInt(request.query.page) || 1;
    let itemsPerPage = parseInt(request.query.limit) || config.get('web.paging.itemsPerPage');
    let categoryList = request.pre.getCategory;
    let time_present = moment();
    let categoryWithSub = request.pre.getCategoryWithSub;

    var render_sort = function (string) {
        if (string == 'asc') {
            return 1;
        }
        return -1;
    };

    asyncCao.parallel({
        product_id_filter: function (callback) {
            let filters_product = [];
            if (request.query.name && request.query.name.length > 0) {
                let slug_re = slug(request.query.name);
                let arr_name = slug_re.split('-');
                let options_name = [];

                options_name.push({
                    name: new RegExp(request.query.name, 'i')
                });

                options_name.push({
                    slug: new RegExp(slug_re, 'i')
                });

                filters_product.push({
                    $or: options_name
                });
            }

            if (request.query.category) {
                filters_product.push({
                    category: {
                        $in: getCategorySub(request.pre.getCategoryId,[])
                    }
                });
            }

            let option = {};
            if (filters_product.length > 0) {
                option = { $and: filters_product };
            }
            let products_filter = Product.find(option).select('name').lean();

            products_filter.then(function (resp) {
                let product_id_filter = resp.map(function (item) {
                    return item._id
                });
                callback(null, product_id_filter);
            })
        },
        order_id_filter: function (callback) {
            let filters_order = {};
            if (request.query.date) {
                let date = request.query.date.split(' - ');
                let startDate = moment(date[0], 'DD/MM/YYYY');
                let endDate = moment(date[1], 'DD/MM/YYYY');
                filters_order.createdAt = {
                    $gte: startDate,
                    $lte: endDate,
                }
            }

            let promise = Order.find(filters_order).select('id_order').lean();

            promise.then(function (resp) {
                let order_id_filter = resp.map(function (item) {
                    return item._id;
                })
                callback(null, order_id_filter);
            })
        }
    }, function (err, result) {
        let opt_order = [
            {
                $match: {
                    _id: { $in: result.order_id_filter },
                }
            },
            {
                $unwind: "$order_detail"
            },
            {
                $group: {
                    _id: '$order_detail.product',
                    total_order: { $sum: '$order_detail.order_quantity' }
                }
            },
            {
                $match: {
                    total_order: {
                        $gt: 0
                    },
                    _id: {
                        $in: result.product_id_filter
                    }
                }
            },
        ];

        if (request.query.total_order) {
            opt_order.push({
                $sort: { total_order: render_sort(request.query.total_order) }
            });
        }

        let promise = Order.aggregate(opt_order);
        promise.then(function (resp) {
            if (request.query.total_order) {
                let totalPage = Math.ceil(resp.length / itemsPerPage);
                let dataSend = {
                    totalItems: resp.length,
                    totalPage,
                    currentPage: page,
                    itemsPerPage,
                    categoryWithSub
                };

                let products_order_id = resp.splice((page - 1) * itemsPerPage, itemsPerPage);
                let list_func = [];
                products_order_id.forEach(function (item) {
                    list_func.push(function (callback) {
                        let product_find = Product.findById(item._id)
                            .populate('category_list')
                            .select('name qty_in_stock made_in price category category_list tag_product tag_processing thumb slug').lean();
                        product_find.then(function (resp) {
                            callback(null, {
                                product: resp,
                                order: {
                                    order_quanlity: item.total_order
                                }
                            });
                        })
                    })
                })

                asyncCao.parallel(list_func, function (error, result) {
                    dataSend.items = result
                    return reply(dataSend);
                })
            }
            else {
                let find_product = resp.map(function (item) {
                    return item._id;
                })
                let promise = Product.find({
                    _id: {
                        $in: find_product
                    }
                }).populate('category_list')
                    .select('name qty_in_stock made_in price category category_list tag_product tag_processing thumb slug').lean();

                if (request.query.qty_in_stock) {
                    promise.sort({ qty_in_stock: render_sort(request.query.qty_in_stock) });
                }

                promise.paginate(page, itemsPerPage, function (err, items, total) {
                    let totalPage = Math.ceil(total / itemsPerPage);

                    let product_list = items.map(function (product) {
                        let order_quanlity = resp.find(function (item) {
                            return item._id.toString() == product._id.toString();
                        }).total_order;
                        return {
                            product,
                            order: {
                                order_quanlity
                            }
                        };
                    })

                    let dataSend = {
                        totalItems: total,
                        totalPage,
                        currentPage: page,
                        itemsPerPage,
                        items: product_list,
                        categoryWithSub
                    };
                    return reply(dataSend);
                });
            }
        })

    });
}

function reportProductADay(request, reply) {
    let start_present = moment().startOf('day');
    let end_present = moment().endOf('day');
    let productADayNum = request.pre.getConfigADay ? request.pre.getConfigADay.value : 5;
    let config = request.server.configManager;
    let page = parseInt(request.query.page) || 1;
    let itemsPerPage = parseInt(request.query.limit) || config.get('web.paging.itemsPerPage');

    try {
        let tagList = [{
            "_id": "1",
            "name": "Sản phẩm Khuyến mãi",
            "description": "Sản phẩm Khuyến mãi",
        }].concat(request.pre.getTag);
        let categoryWithSub = request.pre.getCategoryWithSub;
        let filters = [];
        let promotes_active = request.pre.getPromotionActive;

        let list_promote = promotes_active.map(function (item) {
            return item._id;
        })

        let option = {
            total_order: {
                $gte: productADayNum
            }
        };

        let list_order = Order.find({
            createdAt: {
                $gte: start_present,
                $lte: end_present
            }
        }).select('id_order').lean();

        list_order.then(function (data) {
            let filter_order = data.map(function (item) {
                return item._id;
            })

            let promise = Order.aggregate([
                {
                    $unwind: "$order_detail"
                },
                {
                    $match: {
                        _id: {
                            $in: filter_order
                        }
                    }
                },
                {
                    $group: {
                        _id: '$order_detail.product',
                        total_order: { $sum: '$order_detail.order_quantity' },
                    }
                },
                {
                    $match: option
                },
            ]);

            promise.then(function (resp) {
                let products_id = resp.map(function (item) {
                    return item._id;
                });

                if (request.query.name && request.query.name.length > 0) {
                    let slug_re = slug(request.query.name);
                    let arr_name = slug_re.split('-');
                    let options_name = [];

                    options_name.push({
                        name: new RegExp(request.query.name, 'i')
                    });

                    options_name.push({
                        slug: new RegExp(slug_re, 'i')
                    });

                    filters.push({
                        $or: options_name
                    });
                }

                if (request.query.dueDate) {
                    let time_present = moment();
                    if (request.query.dueDate == '0') {
                        filters.push({
                            'due_date.end_date': {
                                $lt: time_present
                            }
                        });
                    }
                    if (request.query.dueDate == '1') {
                        filters.push({
                            $or: [
                                { 'due_date.end_date': null },
                                {
                                    'due_date.end_date': {
                                        $gte: time_present
                                    }
                                }
                            ]
                        });
                    }
                }

                // if (typeof request.query.active == 'boolean') {
                //     filters.push({
                //         active: request.query.active
                //     });
                // }

                if (request.query.status) {
                    if (request.query.status == 'HH') {
                        filters.push({
                            qty_in_stock: {
                                $eq: 0
                            }
                        });
                    }
                    if (request.query.status == 'HSV') {
                        filters.push({
                            qty_in_stock: {
                                $gt: 0,
                                $lte: 3
                            }
                        });
                    }
                    if (request.query.status == 'CH') {
                        filters.push({
                            qty_in_stock: {
                                $gt: 3
                            }
                        });
                    }
                }

                if (request.query.category) {
                    let categoryQuery = request.pre.getCategoryId;
                    filters.push({
                        category: {
                            $in: getCategorySub(categoryQuery, [])
                        }
                    });
                }

                if (request.query.tag) {
                    let opt_tag = [];
                    if (request.query.tag == '1') {
                        opt_tag = [{
                            id_promotion: {
                                $in: list_promote
                            }
                        }];
                    }
                    else {
                        opt_tag = [{
                            tag_product: {
                                $elemMatch: {
                                    id_tag: {
                                        $in: [request.query.tag]
                                    }
                                }
                            }
                        },
                        {
                            tag_processing: {
                                $elemMatch: {
                                    id_tag: {
                                        $in: [request.query.tag]
                                    }
                                }
                            }
                        }];
                    }

                    filters.push({
                        $or: opt_tag
                    });
                }

                filters.push({
                    _id: {
                        $in: products_id
                    }
                });

                let option = { $and: filters };

                let promise = Product.find(option).populate('category_list tag_processing.id_tag tag_product.id_tag')
                    .select('name qty_in_stock made_in price category category_list tag_product tag_processing thumb slug')
                    .paginate(page, itemsPerPage, function (err, items, total) {
                        let totalPage = Math.ceil(total / itemsPerPage);

                        let product_list = items.map(function (product) {
                            let order_quanlity = resp.find(function (item) {
                                return item._id.toString() == product._id.toString();
                            }).total_order;
                            return {
                                product,
                                order: {
                                    order_quanlity
                                }
                            };
                        })

                        let dataSend = {
                            totalItems: total,
                            totalPage,
                            currentPage: page,
                            itemsPerPage: itemsPerPage,
                            items: product_list,
                            resp,
                            tagList,
                            categoryWithSub,
                            promotes_active
                        };

                        return reply(dataSend);
                    });
            })
        }).catch(function (err) {
            return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        })
    } catch (error) {
        return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
    }

}

function getCategorySub(category, cates_id) {
    cates_id.push(category._id);
    if (category.sub_category && category.sub_category.length > 0) {
        category.sub_category.forEach(function (sub) {
            return getCategorySub(sub, cates_id);
        })
    }
    return cates_id;
}