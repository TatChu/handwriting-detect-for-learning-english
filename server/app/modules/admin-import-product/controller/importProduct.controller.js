'use strict';
const Boom = require('boom');
const Joi = require('joi');
const mongoose = require('mongoose');
const moment = require('moment');
const _ = require('lodash');
const async = require('async');
const ErrorHandler = require(BASE_PATH + '/app/utils/error.js');

const Product = mongoose.model('Product');
const ImportProduct = mongoose.model('ImportProduct');
const Unit = mongoose.model('Unit');
const Supplier = mongoose.model('Supplier');
const User = require('../../api-user/util/user');

module.exports = {
    getAll,
    add,
    create,
    edit,
    update,
    delete: del,
    getDataBySupplier
};

function getAll(request, reply) {
    let options = {};
    let params = {};
    let page = parseInt(request.query.page) || 1;
    let itemsPerPage = parseInt(request.query.limit) || config.get('web.paging.itemsPerPage');

    if (request.query.slug) {
        params.product = request.pre.getProductBySlug;
        options.id_product = params.product._id;
    }

    if (request.query.date) {
        let date = request.query.date.split(' - ');
        let startDate = moment(date[0], 'DD/MM/YYYY');
        let endDate = moment(date[1], 'DD/MM/YYYY');
        options.createdAt = {
            $gte: startDate,
            $lte: endDate,
        };
        params.date = [startDate, endDate];
    }

    if (request.query.product) {
        let listProduct = request.pre.getProductByName;
        let listIdProduct = listProduct.map(function (item) {
            return item._id;
        });

        options.id_product = {
            $in: listIdProduct
        };
    }

    let promise = ImportProduct.find(options).populate({
        path: 'product',
        populate: {
            path: 'unit_stock unit_order'
        },
        select: 'name qty_in_stock'
    }).sort({ createdAt: -1 }).populate('user', 'name').lean().paginate(page, itemsPerPage, function (err, items, total) {
        let totalPage = Math.ceil(total / itemsPerPage);
        let dataSend = {
            totalItems: total,
            totalPage: totalPage,
            currentPage: page,
            itemsPerPage: itemsPerPage,
            items: items,
            params: params
        };
        reply(dataSend);
    });
}

function add(request, reply) {
    reply({
        productList: request.pre.getListProduct,
        supplierList: request.pre.getListSupplier
    });
}

function create(request, reply) {
    let productBalance = request.pre.getConfig.value;
    let dataSend = request.payload;
    let data = dataSend.data;
    let product = dataSend.product;
    let user = request.pre.getAuthUser;
    data.id_user = user._id;

    async.parallel([
        function (callback) {
            let newQuantity = product.qty_in_stock + data.qty_before;
            let statusProduct = product.status;
            if (newQuantity < productBalance) {
                statusProduct = 'SHH';
            }
            else {
                statusProduct = 'CH';
            }
            let productUpdate = Product.findByIdAndUpdate(product._id, {
                $set: {
                    price: data.price_new,
                    qty_in_stock: newQuantity,
                    status: statusProduct
                }
            });
            productUpdate.then(function (resp) {
                callback(null);
            })
        },
        function (callback) {
            let importProductCreate = new ImportProduct(data);
            let promise = importProductCreate.save();
            promise.then(function (resp) {
                // Create auditLog
                request.auditLog.logEvent(
                    user._id.toString(),            //user_id login || ''
                    'mongoose',         //origin ex: mongoose or route
                    'create', //action : function name
                    'import_product',            // label: module name
                    JSON.stringify({ new: resp }),   //data mới, cũ
                    'Nhập hàng'    // chi tiết thay đổi
                );
                callback(null);

            }).catch(function (err) {
                callback(err);
            });
        }
    ], function (err, result) {
        if (err) {
            return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        }
        return reply({ success: true });
    })
}

function edit(request, reply) {
    let promise = ImportProduct.findById(request.params.id).populate('product');
    promise.then(function (resp) {
        reply({
            data: resp,
            productList: request.pre.getListProduct,
            supplierList: request.pre.getListSupplier
        });
    })
}

function update(request, reply) {
    let productBalance = request.pre.getConfig.value;
    let dataSend = request.payload;
    let newImport = dataSend.data;
    let oldImport = request.pre.getData;
    let product = dataSend.product;
    let user = request.pre.getAuthUser;

    // return reply({ success: dataImport  });

    async.parallel([
        function (callback) {
            let newQuantity = product.qty_in_stock + (newImport.qty_before - oldImport.qty_before);
            let statusProduct = product.status;
            if (newQuantity < productBalance) {
                statusProduct = 'SHH';
            }
            else {
                statusProduct = 'CH';
            }
            let productUpdate = Product.findByIdAndUpdate(product._id, {
                $set: {
                    qty_in_stock: newQuantity,
                    status: statusProduct
                }
            });
            productUpdate.then(function (resp) {
                callback(null);
            })
        },
        function (callback) {
            let ImportProductUpdate = _.extend(oldImport, newImport);
            let promise = ImportProductUpdate.save();
            promise.then(function (resp) {
                // Create auditLog
                request.auditLog.logEvent(
                    request.auth.credentials.uid,            //user_id login || ''
                    'mongoose',         //origin ex: mongoose or route
                    'create', //action : function name
                    'import_product',            // label: module name
                    JSON.stringify({ new: newImport, old: oldImport }),   //data mới, cũ
                    'Nhập hàng'    // chi tiết thay đổi
                );
                callback(null);
            }).catch(function (err) {
                reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
            });
        }
    ], function (err, result) {
        if (err) {
            return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        }
        return reply({ success: true });
    })
}

function del(request, reply) {
    let id = request.params.id;
    console.time('Query');
    let find_import = ImportProduct.findById(id).select('id_product qty_before').lean();
    find_import.then(function (resp) {
        async.parallel({
            deleteImport: function (callback) {
                let delete_import = ImportProduct.findByIdAndRemove(id);
                delete_import.then(function (resp) {
                    callback(null, resp);
                }).catch(function (err) {
                    callback(err, null);
                })
            },
            updateProduct: function (callback) {
                let find_product = Product.findById(resp.id_product);
                find_product.then(function (product) {
                    product.qty_in_stock = product.qty_in_stock - resp.qty_before;
                    let update_product = product.save();
                    update_product.then(function (resp) {
                        callback(null, true);
                    }).catch(function (err) {
                        callback(err, null);
                    })
                })
            },
        }, function (err, result) {
            if (err) {
                return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
            }
            return reply({ success: true });
        })
    })
}

function getDataBySupplier(request, reply) {
    let options = {};
    let params = {};
    let page = parseInt(request.query.page) || 1;
    let itemsPerPage = parseInt(request.query.limit) || config.get('web.paging.itemsPerPage');

    options.id_supplier = request.params.id;
    let promise = ImportProduct.find(options).populate({
        path: 'product',
        populate: {
            path: 'unit_stock unit_order'
        },
    }).sort({ createdAt: -1 }).populate('user', 'name').paginate(page, itemsPerPage, function (err, items, total) {
        let totalPage = Math.ceil(total / itemsPerPage);
        let dataSend = {
            totalItems: total,
            totalPage: totalPage,
            currentPage: page,
            itemsPerPage: itemsPerPage,
            items: items,
            params: params
        };
        reply(dataSend);
    });
}