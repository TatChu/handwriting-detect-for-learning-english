'use strict';

const Boom = require('boom');
// const Joi = require('joi');
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const Promise = require("bluebird");
const mongoose = require('mongoose');
const Product = mongoose.model('Product');
const async = require('asyncawait/async');
const await = require('asyncawait/await');

module.exports = {
    getProductsByCerID,
    autoPopulateCate,
    getCategoryParent
};

function getProductsByCerID(data, cb) {
    let id_cer = data.id_cer;
    let page = parseInt(data.page) || 1;
    let itemsPerPage = parseInt(data.limit) || 10;
    let data_send = {
        itemsPerPage: itemsPerPage,
        page: page
    };

    let promise_in = Product.find({
        certificates: {
            $in: [id_cer]
        }
    }).paginate(page,itemsPerPage, function(err, items, total){
        let totalPage = Math.ceil(total / itemsPerPage);
        data_send.in = items;
        data_send.totalItems = total;
        data_send.totalPage = totalPage;

        let promise_nin = Product.find({
            certificates: {
                $nin: [id_cer]
            }
        });
        promise_nin.then(function (resp) {
            data_send.nin = resp;
            cb(data_send);
        })
    });
}

function autoPopulateCate(path, count, obj) {
    if (typeof count == 'undefined') {
        var category_level = global.config.web.category_level;
        var count = category_level || 5;
        var obj = {};
    }
    if(count == 0){
        return obj;
    }
    return {
        path: path,
        populate: autoPopulateCate(path, count - 1)
    };
}

function getCategoryParent(category) {
    if (category.parent_category) return getCategoryParent(category.parent_category);
    return category;
}