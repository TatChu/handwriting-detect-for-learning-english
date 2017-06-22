const mongoose = require('mongoose');
const Category = mongoose.model('Category');
const Tag = mongoose.model('Tag');
const Promotion = mongoose.model('Promotion');
const productHelper = require('../../web-product/util/product.js');
const moment = require("moment");

module.exports = {
    getTag,
    getListCategory,
    getPromotionActive
}

function getTag(tag) {
    return function (request, reply) {
        let time_present = moment();
        let promise = Tag.findOne({
            name: new RegExp(tag, 'i')
        }).populate({
            path: 'product_tag',
            select: 'name',
            match: { 'tag_product.expire_date.endDate': { $gte: time_present } },
        }).lean();
        promise.then(function (resp) {
            reply(resp);
        });
    }
}

function getListCategory(request, reply) {
    let promise = Category.find({ parrent_id: null }).populate('top')
        .populate(productHelper.autoPopulateCate('sub_category')).lean();
    promise.then(function (resp) {
        reply(resp);
    });
}

function getPromotionActive(request, reply) {
    let promise = Promotion.find({
        status: true
    }).lean();
    promise.then(function (resp) {
        reply(resp);
    });
}