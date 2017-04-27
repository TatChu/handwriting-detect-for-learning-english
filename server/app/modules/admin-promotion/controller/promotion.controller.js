'use strict';
const Boom = require('boom');
const Joi = require('joi');
const mongoose = require('mongoose');
const ErrorHandler = require(BASE_PATH + '/app/utils/error.js');
const async = require("async");
const _ = require('lodash');
const fs = require('fs');
const util = require('util');

const Promotion = mongoose.model('Promotion');
const Product = mongoose.model('Product');
const uploadHelper = require(BASE_PATH + '/app/modules/api-upload/util/upload.js');

module.exports = {
    getAll,
    add,
    create,
    update,
    edit,
    delete: del,
};

function getAll(request, reply) {
    let config = request.server.configManager;
    let page = parseInt(request.query.page) || 1;
    let itemsPerPage = parseInt(request.query.limit) || config.get('web.paging.itemsPerPage');
    let filters = {};

    let promise = Promotion.find(filters).paginate(page, itemsPerPage, function (err, items, total) {
        let totalPage = Math.ceil(total / itemsPerPage);
        let dataSend = {
            totalItems: total,
            totalPage: totalPage,
            currentPage: page,
            itemsPerPage: itemsPerPage,
            items: items,
        };
        return reply(dataSend);
    });
}

function add(request, reply) {
    return reply({
        list: request.pre.getAllPromotion,
        products: request.pre.getListProduct
    });
}

function create(request, reply) {
    let promoCreate = new Promotion(request.payload.data);
    let promise = promoCreate.save();
    let user = request.pre.getAuthUser;
    let product_apply = request.payload.product_apply;

    promise.then(function (resp) {
        // Create auditLog
        request.auditLog.logEvent(
            user._id.toString(),
            'mongoose',
            'create',
            'promotion',
            JSON.stringify({ new: resp }),
            'Tạo promotion'
        );

        let list_func = [];
        updateProductPromotion(product_apply, resp._id, function (err, results) {
            return reply({ success: true });
        });
    }).catch(function (err) {
        reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
    })
}

function edit(request, reply) {
    let listProm = request.pre.getAllPromotion;
    let promise = Promotion.findById(request.params.id).populate({
        path: 'product',
        select: { name: 1, _id: 1 }
    });
    let products = request.pre.getListProduct;

    promise.then(function (resp) {
        return reply({ prom: resp, listProm: listProm, products });
    })
}

function update(request, reply) {
    let promOld = request.pre.getPromotionById;
    let product_apply_old = promOld.product.map(function (item) {
        return item._id;
    });
    let promNew = request.payload.data;
    let user = request.pre.getAuthUser;
    let product_apply = request.payload.product_apply;

    // Create auditLog
    request.auditLog.logEvent(
        user._id.toString(),
        'mongoose',
        'update',
        'promotion',
        JSON.stringify({ new: promNew, old: promOld }),
        'Cập nhật promotion'
    );

    let promUpdate = _.extend(promOld, promNew);

    let promise = promUpdate.save();
    promise.then(function (resp) {
        let list_func_remove = [];
        product_apply_old.forEach(function (item) {
            list_func_remove.push(function (callback) {
                let find_product = Product.findById(item);
                find_product.then(function (product) {
                    product.id_promotion = null;
                    let productUpdate = new Product(product);
                    productUpdate.save().then(function (resp) {
                        callback(null);
                    });
                });
            })
        })

        async.parallel(list_func_remove, function (err, results) {
            if (err) {
                request.log(err);
                return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
            }
            updateProductPromotion(product_apply, resp._id, function (err, results) {
                if (err) {
                    request.log(err);
                    return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
                }
                return reply(resp);
            });
        });

    })
}

function del(request, reply) {
    let promotion = request.pre.getPromotionById;
    let promotionDelete = Promotion.remove({ _id: request.params.id });
    let user = request.pre.getAuthUser;

    promotionDelete.then(function (resp) {
        // Create auditLog
        request.auditLog.logEvent(
            user._id.toString(),
            'mongoose',
            'update',
            'promotion',
            JSON.stringify({ old: promotion }),
            'Cập nhật promotion'
        );

        reply({ success: true });
    });
}


function updateProductPromotion(list_product, id_promotion, callback) {
    let list_func = [];
    list_product.forEach(function (item) {
        list_func.push(function (callback) {
            let find_product = Product.findById(item);
            find_product.then(function (product) {
                product.id_promotion = id_promotion;
                let productUpdate = new Product(product);
                productUpdate.save().then(function (resp) {
                    callback(null);
                });
            });
        })
    })

    async.parallel(list_func, function (err, results) {
        callback(err, results);
    });
}