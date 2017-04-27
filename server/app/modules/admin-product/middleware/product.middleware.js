const mongoose = require('mongoose');
const Boom = require('boom');
const ErrorHandler = require(BASE_PATH + '/app/utils/error.js');

const Unit = mongoose.model('Unit');
const Category = mongoose.model('Category');
const Product = mongoose.model('Product');
const Tag = mongoose.model('Tag');
const Config = mongoose.model('Config');
const Certificate = mongoose.model('Certificate');
const Promotion = mongoose.model('Promotion');
const productHelper = require(BASE_PATH + '/app/modules/admin-product/util/product.js');

module.exports = {
    getUnit,
    getCategory,
    getTag,
    getCertificate,
    getProductBalance,
    getProduct,
    getCategoryId,
    getCategoryWithSub,
    getPromotionActive
}

function getUnit(request, reply) {
    let promise = Unit.find();
    promise.then(function (data) {
        reply(data);
    }).catch(function (err) {
        request.log(err);
        return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
    });
}

function getCategoryWithSub(request, reply) {
    let promise = Category.find({
        parrent_id: null
    }).populate(productHelper.autoPopulateCate('sub_category')).lean();
    promise.then(function (data) {
        reply(data);
    }).catch(function (err) {
        request.log(err);
        return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
    });
}

function getCategory(request, reply) {
    let promise = Category.find();
    promise.then(function (data) {
        reply(data);
    }).catch(function (err) {
        request.log(err);
        return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
    });
}

function getTag(option) {
    return function (request, reply) {
        let promise = Tag.find(option);
        promise.then(function (data) {
            return reply(data);
        }).catch(function (err) {
            request.log(err);
            return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        });
    }
}

function getCertificate(request, reply) {
    let promise = Certificate.find({});
    promise.then(function (data) {
        reply(data);
    }).catch(function (err) {
        request.log(err);
        return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
    });
}

function getProduct(type) {
    return function (request, reply) {
        if (type == 'list') {
            var id = request.params.id;
            if (id) {
                var promise = Product.find({
                    _id: {
                        $ne: id
                    }
                });
            }
            else {
                var promise = Product.find();
            }
        }

        if (type == 'params') {
            var id = request.params.id;
            var promise = Product.findById(id);
        }
        if (type == 'payload') {
            var id = request.payload.data._id;
            var promise = Product.findOne({ _id: id });
        }

        promise.then(function (data) {
            reply(data);
        }).catch(function (err) {
            request.log(err);
            return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        });
    }
}

function getProductBalance(request, reply) {
    let promise = Config.findOne({ name: 'ProductBalance' });
    promise.then(function (data) {
        reply(data);
    }).catch(function (err) {
        request.log(err);
        return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
    });
}

function getCategoryId(request, reply) {
    if (request.query.category) {
        let promise = Category.findById(request.query.category).populate(productHelper.autoPopulateCate('sub_category')).lean();
        promise.then(function (resp) {
            reply(resp);
        })
    }
    else {
        reply(null);
    }
}

function getPromotionActive(request, reply) {
    let promise = Promotion.find({
        status: true
    }).lean();
    promise.then(function (resp) {
        reply(resp);
    });
}