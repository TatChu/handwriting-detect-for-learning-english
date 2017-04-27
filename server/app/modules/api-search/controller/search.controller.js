'use strict';

const _ = require('lodash');
const mongoose = require('mongoose');
const Boom = require('boom');
const Joi = require('joi');
const async = require('asyncawait/async');
const await = require('asyncawait/await');
const asyncCao = require('async');

const Search = mongoose.model('Search');
const Product = mongoose.model('Product');
const productHelper = require('../../web-product/util/product.js');

var slug = require('slug')

module.exports = {
    addSearch,
    search
};

function addSearch(request, reply) {
    let keyword = request.pre.findSearch;
    if (!request.query.search)
        return reply({ success: false });
    if (!keyword) {
        let searchNew = new Search({
            keyword: request.query.search,
            count: 0,
            active: true
        });
        var promise = searchNew.save();
    }
    else {
        keyword.count++;
        var promise = keyword.save();
    }
    promise.then(function (resp) {
        if (request.query.from) {
            let config = request.server.configManager;
            return reply.redirect(config.get('web.context.settings.services.webUrl') + '/tim-kiem?q=' + request.query.search);
        }
        return reply({ success: true });
    })
}

function findSearch(request, reply) {
    let promise = Search.findOne({
        keyword: request.query.search
    });
    promise.then(function (resp) {
        reply(resp);
    })
}

function search(request, reply) {
    let re = request.query.q || '';
    let slug_re = slug(re);

    let option_keyword = [];

    option_keyword.push({
        keyword: new RegExp(re, 'i')
    });

    option_keyword.push({
        keyword: new RegExp(re, 'i')
    });

    asyncCao.parallel({
        searchList: function (callback) {
            let promise = Search.find({
                $or: option_keyword
            }).sort({ count: 1 }).select('keyword').limit(3).lean();

            promise.then(function (resp) {
                callback(null, resp);
            })
        },
        productList: function (callback) {
            let promise_name = Product.find(productHelper.createOptDueDate({
                name: new RegExp(re, 'i')
            })).select('name slug view_unit price thumb id_promotion id_unit').populate('unit promotion').limit(5).lean();

            promise_name.then(function (resp_name) {
                if (resp_name.length < 5) {
                    let not_in = resp_name.map(function (item) {
                        return item._id;
                    })
                    let promise_slug = Product.find(productHelper.createOptDueDate({
                        slug: new RegExp(slug_re, 'i')
                    })).select('name slug view_unit price thumb id_promotion id_unit').populate('unit promotion').limit(5 - resp_name.length).lean();

                    promise_slug.then(function (resp_slug) {
                        callback(null, resp_name.concat(resp_slug));
                    })
                }
                else {
                    callback(null, resp_name);
                }
            })
        }
    }, function (err, result) {
        return reply(result);
    })
}