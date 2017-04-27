'use strict';

const Boom = require('boom');
const util = require('util');
const Joi = require('joi');
const mongoose = require('mongoose');
const Tag = mongoose.model('Tag');
const Product = mongoose.model('Product');
const ProductHelper = require(BASE_PATH + '/app/modules/admin-product/util/product.js');
const _ = require('lodash');

module.exports = {
    getAll,
    edit,
    save,
    update,
    del,
    getProductById,
    getProductByTag,
    listProduct
};

// Start : Handler list method
function getAll(request, reply) {
    let config = request.server.configManager;
    let page = request.query.page || 1;
    let itemsPerPage = parseInt(request.query.limit) || 25;
    let numberVisiblePages = config.get('web.paging.numberVisiblePages');
    let options = {};
    if (request.query.type) {
        options.type = request.query.type;
    }
    if (request.query.keyword && request.query.keyword.length > 0) {
        let re = new RegExp(request.query.keyword, 'i');
        options.$or = [
            {
                name: re
            }
        ]
    }
    Tag.find(options).sort('id').paginate(page, itemsPerPage, function (err, items, total) {
        if (err) {
            request.log(['error', 'list', 'tag'], err);
            reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        }
        let totalPage = Math.ceil(total / itemsPerPage);
        let dataRes = { status: 1, totalItems: total, totalPage: totalPage, currentPage: page, itemsPerPage: itemsPerPage, numberVisiblePages: numberVisiblePages, items: items };
        reply(dataRes);
    });

}


function edit(request, reply) {
    const tag = request.pre.tag;
    if (tag) {
        return reply(tag)
    } else {
        reply(Boom.notFound('Tag is not found'));
    }
}



function save(request, reply) {
    let tag = new Tag(request.payload);
    request.auditLog.logEvent(
        request.auth.credentials.uid,
        'mongoose',
        'save',
        'tag',
        JSON.stringify({ new: tag, old: null }),
        'add new tag'
    );
    let promise = tag.save();
    promise.then(function (tag) {
        reply(tag);
    }).catch(function (err) {
        request.log(['error', 'tag'], err);
        reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
    });
}

function update(request, reply) {
    let tag = request.pre.tag;
    request.auditLog.logEvent(
        request.auth.credentials.uid,
        'mongoose',
        'update',
        'tag',
        JSON.stringify({ new: _.extend(tag, request.payload), old: tag }),
        'update tag'
    );

    tag = _.extend(tag, request.payload);
    let promise = tag.save();
    promise.then(function (tag) {
        reply(tag);
    }).catch(function (err) {
        reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
    });
}


function del(request, reply) {
    const tag = request.pre.tag;
    request.auditLog.logEvent(
        request.auth.credentials.uid,
        'mongoose',
        'delete',
        'tag',
        JSON.stringify({ new: null, old: tag }),
        'delete tag'
    );

    tag.remove((err) => {
        if (err) {
            reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        }
        return reply(tag);
    });
}


function getProductById(request, reply) {
    let id = request.params.id || request.payload.id;
    let product = Product.findOne({ _id: id }).populate({
        path: 'category_list',
        populate: ProductHelper.autoPopulateCate('parent_category')
    }).lean();
    product.then(function (product) {
        product.category_list.forEach(function (categogry) {
            if(categogry.parent_category)
            categogry.parent_category = ProductHelper.getCategoryParent(categogry);
        })
        return reply(product);
    });
}


function getProductByTag(request, reply) {
    let id = request.params.id || request.payload.id;
    let type = request.params.type;
    let promise;

    if (type == "SP") {
        promise = Product.find({
            'tag_product.id_tag': {
                $in: [id]
            }
        }).populate({
            path: 'category_list',
            populate: ProductHelper.autoPopulateCate('parent_category')
        }).lean();
    }

    if (type == "CN") {
        promise = Product.find({
            'tag_processing.id_tag': {
                $in: [id]
            }
        }).populate({
            path: 'category_list',
            populate: ProductHelper.autoPopulateCate('parent_category')
        }).lean();
    }

    promise.then(function (product) {
        for (var i = 0; i < product.length; i++) {
            let product_item = product[i];
            product_item.category_list.forEach(function (categogry) {
                if(categogry.parent_category)
                categogry.parent_category = ProductHelper.getCategoryParent(categogry);

            })

        }
        return reply({ data: product });
    }).catch(function (err) {
        return reply(err);
    });
}



function listProduct(request, reply) {
    let id = request.params.id || request.payload.id;
    let type = request.params.type;
    let promise;
    if (type == "SP") {
        promise = Product.find({
            'tag_product.id_tag': {
                $nin: [id]
            }
        }).populate({
            path: 'category_list',
            populate: ProductHelper.autoPopulateCate('parent_category')
        }).lean();
    }

    if (type == "CN") {
        promise = Product.find({
            'tag_processing.id_tag': {
                $nin: [id]
            }
        }).populate({
            path: 'category_list',
            populate: ProductHelper.autoPopulateCate('parent_category')
        }).lean();
    }
    promise.then(function (product) {
        for (var i = 0; i < product.length; i++) {
            let product_item = product[i];
            product_item.category_list.forEach(function (categogry) {
                if(categogry.parent_category)
                categogry.parent_category = ProductHelper.getCategoryParent(categogry);

            })

        }
        return reply({ data: product });
    }).catch(function (err) {
        return reply(err);
    });
}

// End : Handler list method




