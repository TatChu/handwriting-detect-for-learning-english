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

const Unit = mongoose.model('Unit');
const Category = mongoose.model('Category');
const Product = mongoose.model('Product');
const Tag = mongoose.model('Tag');
const Config = mongoose.model('Config');
const uploadHelper = require(BASE_PATH + '/app/modules/api-upload/util/upload.js');
const promotionHelper = require(BASE_PATH + '/app/modules/admin-promotion/util/promotion.js');
module.exports = {
    getAll,
    add,
    create,
    update,
    edit,
    delete: del,
    active,
    updateTags,
};

function getAll(request, reply) {
    let config = request.server.configManager;
    let page = parseInt(request.query.page) || 1;
    let itemsPerPage = parseInt(request.query.limit) || config.get('web.paging.itemsPerPage');
    let tagList = [{
        "_id": "1",
        "name": "Sản phẩm Khuyến mãi",
        "description": "Sản phẩm Khuyến mãi",
    }].concat(request.pre.getTag);
    let categoryWithSub = request.pre.getCategoryWithSub;
    let filters = [];
    let promotes_active = request.pre.getPromotionActive;
    request.query.active = returnBooleanActive(request.query.active);

    let list_promote = promotes_active.map(function (item) {
        return item._id;
    })

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

    if (typeof request.query.active == 'boolean') {
        filters.push({
            active: request.query.active
        });
    }

    // if (request.query.status) {
    //     filters.push({
    //         status: request.query.status
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

    let option = {};
    if (filters.length > 0) {
        option = { $and: filters };
    }

    let promise = Product.find(option).populate('category_list tag_processing.id_tag tag_product.id_tag promotion unit').sort({
        status: -1
    }).paginate(page, itemsPerPage, function (err, items, total) {
        let totalPage = Math.ceil(total / itemsPerPage);
        let dataSend = {
            totalItems: total,
            totalPage: totalPage,
            currentPage: page,
            itemsPerPage: itemsPerPage,
            items: items,
            tagList: tagList,
            categoryWithSub
        };
        reply(dataSend);
    });
}

function add(request, reply) {
    let unitList = request.pre.getUnit;
    let productList = request.pre.getListProduct;
    let categoryList = request.pre.getCategory;
    let productBalance = request.pre.getProductBalance;
    let promotionList = request.pre.getPromotionList;
    let certificateList = request.pre.getCertificate;
    let categoryWithSub = request.pre.getCategoryWithSub;
    let tags_proccess = request.pre.getTag;

    return reply({
        success: true,
        unit: unitList,
        productList,
        categoryList,
        productBalance,
        promotionList,
        certificateList,
        categoryWithSub,
        tags_proccess
    });
}

function create(request, reply) {
    if (request.payload.data.id_promotion === '') {
        request.payload.data.id_promotion = null;
    }

    let filesDelete = request.payload.imageDelete || [];
    let user = request.pre.getAuthUser;

    asyncCao.waterfall([
        function (cb) {
            if (request.payload.data.thumb) {
                let resizeImage = request.server.resizeImage;
                resizeImage({
                    name: request.payload.data.thumb,
                    width: 248,
                    height: 248,
                    directory: '/product_image/',
                    deleteFileSrc: false,
                    desDirectory: 'product_image/'
                }).then(function (resp) {
                    request.payload.data.thumb = resp.filename;
                    cb();
                });
            }
            else {
                cb();
            }
        },
        function (cb) {
            // Create job delete image
            let queue = request.server.plugins['hapi-kue'];
            filesDelete.forEach(function (item) {
                queue.createJob('api-removefile', {
                    url: item.url.slice(6),
                    fileName: item.fileName
                }, function (err) {
                    if (err) {
                        request.log(['error'], 'Error: publish message to queue')
                    } else {
                        request.log(['error'], 'publish message to queue')
                    }
                });
            });
            let productCreate = new Product(request.payload.data);
            let promise = productCreate.save();

            promise.then(function (resp) {
                // Create auditLog
                request.auditLog.logEvent(
                    user._id.toString(),
                    'mongoose',
                    'create',
                    'product',
                    JSON.stringify({ new: resp }),
                    'Thêm sản phẩm'
                );
                cb();
            }).catch(function (err) {
                cb(err);
            })
        }
    ], function (err, result) {
        if (err) {
            return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)))
        }
        return reply({ success: true });
    });

}

function edit(request, reply) {
    let product = request.pre.getProductByID;
    let unit = request.pre.getUnit;
    let productList = request.pre.getListProduct;
    let categoryList = request.pre.getCategory;
    let promotionList = request.pre.getPromotionList;
    let productBalance = request.pre.getProductBalance;
    let certificateList = request.pre.getCertificate;
    let categoryWithSub = request.pre.getCategoryWithSub;
    let tags_proccess = request.pre.getTag;

    return reply({
        productList,
        product,
        unit,
        categoryList,
        productBalance,
        promotionList,
        certificateList,
        categoryWithSub,
        tags_proccess
    });
}

function update(request, reply) {
    if (request.payload.data.id_promotion === '') {
        request.payload.data.id_promotion = null;
    }

    let productOld = request.pre.getProductUpdate;
    let productNew = request.payload.data;

    asyncCao.waterfall([
        function (cb) {
            if (productOld.thumb != productNew.thumb) {
                let resizeImage = request.server.resizeImage;
                resizeImage({
                    name: productNew.thumb,
                    width: 248,
                    height: 248,
                    directory: '/product_image/',
                    deleteFileSrc: false,
                    desDirectory: 'product_image/'
                }).then(function (resp) {
                    productNew.thumb = resp.filename;
                    let queue = request.server.plugins['hapi-kue'];
                    if (productOld.thumb) {
                        queue.createJob('api-removefile', {
                            url: '/thumb_image/product_image/',
                            fileName: productOld.thumb
                        }, function (err) {
                            if (err) {
                                request.log(['error'], 'Error: publish message to queue')
                            } else {
                                request.log(['error'], 'publish message to queue')
                            }
                        });
                    }
                    cb();
                });
            }
            else {
                cb();
            }
        },
        function (cb) {
            let filesDelete = request.payload.imgDelete || [];
            let user = request.pre.getAuthUser;
            let productUpdate = _.extend(productOld, productNew);

            // Create auditLog
            request.auditLog.logEvent(
                user._id.toString(),
                'mongoose',
                'update',
                'product',
                JSON.stringify({ new: productNew, old: productOld }),
                'Chỉnh sửa sản phẩm'
            );

            // Create job delete image
            let queue = request.server.plugins['hapi-kue'];
            filesDelete.forEach(function (item) {
                queue.createJob('api-removefile', {
                    url: item.url.slice(6),
                    fileName: item.fileName
                }, function (err) {
                    if (err) {
                        request.log(['error'], 'Error: publish message to queue')
                    } else {
                        request.log(['error'], 'publish message to queue')
                    }
                });
            });
            let promise = productUpdate.save();
            promise.then(function (resp) {
                cb();
            })
        }
    ], function (err, result) {
        return reply({ success: true });
    });
}

function del(request, reply) {
    let product = request.pre.getProductByID;
    let queue = request.server.plugins['hapi-kue'];
    let user = request.pre.getAuthUser;

    // Create job delete image
    if (product.images.length > 0 && product.images) {
        product.images.forEach(function (item) {
            queue.createJob('api-removefile', {
                url: configManager.get('web.upload.productImgPath').slice(6),
                fileName: item.url
            }, function (err) {
                if (err) {
                    request.log(['error'], 'Error: publish message to queue')
                } else {
                    request.log(['error'], 'publish message to queue')
                }
            });
        });
    }

    if (product.thumb) {
        queue.createJob('api-removefile', {
            url: '/thumb_image/product_image/',
            fileName: product.thumb
        }, function (err) {
            if (err) {
                request.log(['error'], 'Error: publish message to queue')
            } else {
                request.log(['error'], 'publish message to queue')
            }
        });
    }

    let productDelete = Product.remove({ _id: request.params.id });
    productDelete.then(function (resp) {
        // Create auditLog
        request.auditLog.logEvent(
            user._id.toString(),
            'mongoose',
            'delete',
            'product',
            JSON.stringify({ old: product }),
            'Xóa sản phẩm'
        );

        reply({ success: true });
    });
}

// Active/Unactive product
function active(request, reply) {
    let product = request.pre.getProductByID;
    product.active = !product.active;
    let user = request.pre.getAuthUser;
    let promise = product.save();

    promise.then(function (resp) {
        // Create auditLog
        product.active = !product.active;
        request.auditLog.logEvent(
            user._id.toString(),
            'mongoose',
            'update',
            'product',
            JSON.stringify({ new: resp, old: product }),
            'Active/Unactive sản phẩm'
        );

        reply({ success: true });
    })
}

// Update product tag
function updateTags(request, reply) {
    let productOld = request.pre.getProductUpdate;
    let productNew = request.payload.data;
    let productUpdate = _.extend(productOld, productNew);
    let user = request.pre.getAuthUser;

    let promise = productUpdate.save();
    promise.then(function (resp) {
        // Create auditLog
        request.auditLog.logEvent(
            user._id.toString(),
            'mongoose',
            'update',
            'product',
            JSON.stringify({ new: productUpdate, old: productOld }),
            'Cập nhận thẻ sản phẩm'
        );

        reply({ success: true });
    });
}

function returnBooleanActive(valueTxt) {
    if (valueTxt == 'true') return true;
    if (valueTxt == 'false') return false;
    return '';
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