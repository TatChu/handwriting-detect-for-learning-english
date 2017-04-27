'use strict';

const Boom = require('boom');
const util = require('util');
const Joi = require('joi');
const mongoose = require('mongoose');
const _ = require('lodash');
const ErrorHandler = require(BASE_PATH + '/app/utils/error.js');
const async = require('async');
const Banner = mongoose.model('Banner');
const Category = mongoose.model('Category');

module.exports = {
    getAll,
    create,
    del,
    update
}

function getAll(request, reply) {
    let options = {};
    if (request.query.page) {
        options.page = request.query.page;
    }
    if (request.query.position) {
        options.position = request.query.position;
    }
    if (request.query.type) {
        options.type = request.query.type;
    }
    if (request.query.page == 'category' && request.query.position == 'top') {

        async.parallel({
            category: function (callback) {
                let promise = Category.find({ parrent_id: null, status: true }).select('name slug').lean();
                promise.then(function (resp) {
                    callback(null, resp);
                })
            },
            banner: function (callback) {
                let promise = Banner.find(options).lean();
                promise.then(function (resp) {
                    callback(null, resp);
                })
            }
        }, function (err, result) {
            let list_category = [{ name: 'Khuyến mãi', slug: 'khuyen-mai' }].concat(result.category);
            return reply({ data: result.banner, catgegory: list_category });
        });
    }
    else {
        let promise = Banner.find(options);

        promise.then(function (resp) {
            return reply({ data: resp });
        })
    }
}

function create(request, reply) {
    let bannerCreate = new Banner(request.payload.data);
    let promise = bannerCreate.save();
    let imgsDel = request.payload.data.imgsDel || [];
    let queue = request.server.plugins['hapi-kue'];
    let arr_path = configManager.get('web.upload.bannerImgPath').split('/');

    // Create job delete image
    imgsDel.forEach(function (item) {
        queue.createJob('api-removefile', {
            url: '/' + arr_path[arr_path.length - 2] + '/',
            fileName: item
        }, function (err) {
            if (err) {
                request.log(['error'], 'Error: publish message to queue')
            } else {
                request.log(['error'], 'publish message to queue')
            }
        });
    });

    promise.then(function (resp) {
        // Create auditLog
        request.auditLog.logEvent(
            request.auth.credentials.uid,
            'mongoose',
            'create',
            'banner',
            JSON.stringify({ new: resp }),
            'Thêm banner'
        );
        return reply({ success: true, data: resp });
    })
}

function update(request, reply) {
    let bannerUpdate = Banner.findByIdAndUpdate(request.params.id, request.payload.data);
    let queue = request.server.plugins['hapi-kue'];
    let arr_path = configManager.get('web.upload.bannerImgPath').split('/');
    // let imgsDel = request.payload.data.imgsDel || [];

    // Create job delete image
    // imgsDel.forEach(function (item) {
    //     queue.createJob('api-removefile', {
    //         url: '/' + arr_path[arr_path.length - 2] + '/',
    //         fileName: item
    //     }, function (err) {
    //         if (err) {
    //             request.log(['error'], 'Error: publish message to queue')
    //         } else {
    //             request.log(['error'], 'publish message to queue')
    //         }
    //     });
    // });

    // delete request.payload.data.imgsDel;
    // Create auditLog
    request.auditLog.logEvent(
        request.auth.credentials.uid,
        'mongoose',
        'update',
        'banner',
        JSON.stringify({ old: request.pre.getBanner, new: request.payload.data }),
        'Sửa banner'
    );

    bannerUpdate.then(function (resp) {
        return reply({ success: true });
    });
}

function del(request, reply) {
    let banner = request.pre.getBanner;
    let queue = request.server.plugins['hapi-kue'];
    let arr_path = configManager.get('web.upload.bannerImgPath').split('/');

    // Create job delete image
    if (banner.image) {
        queue.createJob('api-removefile', {
            url: '/' + arr_path[arr_path.length - 2] + '/',
            fileName: banner.image
        }, function (err) {
            if (err) {
                request.log(['error'], 'Error: publish message to queue')
            } else {
                request.log(['error'], 'publish message to queue')
            }
        });
    }

    let bannerRemove = Banner.findByIdAndRemove(request.params.id);

    bannerRemove.then(function (resp) {
        // Create auditLog
        request.auditLog.logEvent(
            request.auth.credentials.uid,
            'mongoose',
            'delete',
            'banner',
            JSON.stringify({ old: banner }),
            'Xóa banner'
        );
        return reply({ success: true });
    })
}