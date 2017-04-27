const mongoose = require('mongoose');
const slug = require('slug');
const Boom = require('boom');

const Product = mongoose.model('Product');
const Category = mongoose.model('Category');
const Tag = mongoose.model('Tag');
const Order = mongoose.model('Order');
const Config = mongoose.model('Config');
const Promotion = mongoose.model('Promotion');
const productHelper = require('../util/product.js');

module.exports = {
    getCategory,
    getTags,
    getConfig,
    findCategories,
    getPromotionActive
}

function findCategories(request, reply) {
    let promise = Category.find({ parrent_id: null })
        .populate(productHelper.autoPopulateCate('sub_category'))
        .lean();

    promise.then(function (resp) {
        return reply(resp);
    });
}

function getCategory(type) {
    return function (request, reply) {
        let slugTxt = '';
        if (type == 'slug') slugTxt = request.params.slug;
        if (type == 'category') slugTxt = request.params.category;
        if (type == 'query') slugTxt = slug(request.query.q).toLowerCase();
        if (type == 'rau-cu') slugTxt = type;

        let promise = Category.findOne({ 'slug': slugTxt })
            .populate(productHelper.autoPopulateCate('sub_category'))
            .populate(productHelper.autoPopulateCate('parent_category'))
            .populate({
                path: 'top',
                populate: productHelper.autoPopulateCate('sub_category')
            })
            .lean();
        promise.then(function (data) {
            return reply(data);
        }).catch(function (err) {
            return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        });
    }
}

function getTags(options) {
    return function (request, reply) {
        let promise = Tag.find(options).lean();
        promise.then(function (resp) {
            reply(resp);;
        })
    }
}

function getConfig(options) {
    return function (request, reply) {
        let promise = Config.findOne(options).lean();
        promise.then(function (resp) {
            reply(resp);
        })
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