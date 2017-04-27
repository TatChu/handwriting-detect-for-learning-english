const mongoose = require('mongoose');
const slug = require('slug');

const Promotion = mongoose.model('Promotion');
const Product = mongoose.model('Product');
const Supplier = mongoose.model('Supplier');
const User = require('../../api-user/util/user');
const Config = mongoose.model('Config');
const ImportProduct = mongoose.model('ImportProduct');

module.exports = {
    getListProduct,
    getProductBySlug,
    getProductByName,
    getListSupplier,
    getConfig,
    getImportData
}

function getListProduct(request, reply) {
    let promise = Product.find().populate('unit_stock unit_order');
    promise.then(function (data) {
        reply(data);
    });
}

function getProductBySlug(request, reply) {
    let product = request.query.slug;

    let promise = Product.findOne({
        slug: product
    }).populate('unit_stock unit_order');
    promise.then(function (data) {
        reply(data);
    });
}

function getProductByName(request, reply) {
    let re = request.query.product || '';
    let slug_re = slug(re);
    let options_name = [];
    options_name.push({
        name: new RegExp(request.query.product, 'i')
    });

    options_name.push({
        slug: new RegExp(slug_re, 'i')
    });


    filters = {
        $or: options_name
    };

    let promise = Product.find(filters).populate('unit_stock unit_order');
    promise.then(function (data) {
        reply(data);
    });
}

function getListSupplier(request, reply) {
    let promise = Supplier.find({});
    promise.then(function (data) {
        reply(data);
    });
}

function getImportData(request, reply) {
    let promise = ImportProduct.findById(request.params.id);
    promise.then(function (resp) {
        reply(resp);
    })
}

function getConfig(option) {
    return function (request, reply) {
        let promise = Config.findOne(option);
        promise.then(function (resp) {
            reply(resp);
        })
    }
}