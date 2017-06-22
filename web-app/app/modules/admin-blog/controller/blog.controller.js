'use strict';

const Boom = require('boom');
const util = require('util');
const Joi = require('joi');
const mongoose = require('mongoose');
const Blog = mongoose.model('Blog');
const Tag = mongoose.model('Tag');

const slug = require('slug');

const _ = require('lodash');
const ErrorHandler = require(BASE_PATH + '/app/utils/error.js');

module.exports = {
    getAll,
    edit,
    save,
    update,
    deleteItem,
    getAllTag
}

function getAll(request, reply) {
    let page = request.query.page || 1;
    let config = request.server.configManager;
    let itemsPerPage = parseInt(request.query.limit) || config.get('web.paging.itemsPerPage');
    let numberVisiblePages = config.get('web.paging.numberVisiblePages');

    let options = { type: request.query.type };
    let tag = request.query.tag;
    if (tag) options.tags = { $in: [tag] };
    if (request.query.keyword && request.query.keyword.length > 0) {
        let keyword = request.query.keyword;
        let slug_keyword = slug(keyword);

        options.$or = [
            {
                name: new RegExp(keyword, 'i')
            },
            {
                slug: new RegExp(keyword, 'i')
            },
            {
                slug: new RegExp(slug_keyword, 'i')
            }
        ];
    }
    if (typeof request.query.id !== "undefined")
        options.id = request.query.id;
    Blog.find(options).sort({ createdAt: -1 }).populate('auth_id tags').paginate(page, itemsPerPage, function (err, items, total) {
        if (err) {
            request.log(['error', 'list', 'page'], err);
            reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        }
        items.forEach(function (post, index) {
            if (items[index].auth_id != null)
                items[index].auth_id = { _id: post.auth_id._id, name: post.auth_id.name }
        });
        let totalPage = Math.ceil(total / itemsPerPage);
        let dataRes = { status: '1', totalItems: total, totalPage: totalPage, currentPage: page, itemsPerPage: itemsPerPage, numberVisiblePages: numberVisiblePages, items: items };
        return reply(dataRes);
    });
}

function edit(request, reply) {
    const blog = request.pre.blog;
    if (blog) {
        return reply(blog);
    } else {
        return reply(Boom.notFound('Blog is not found'));
    }
}


function save(request, reply) {
    let blog = new Blog(request.payload);
    request.auditLog.logEvent(
        request.auth.credentials.uid,
        'mongoose',
        'save',
        'blog',
        JSON.stringify({ new: blog, old: null }),
        'add new blog'
    );
    /*Create job delete image*/
    let filesDelete = request.payload.listImgDelete;

    if (filesDelete) {
        let queue = request.server.plugins['hapi-kue'];
        filesDelete.forEach(function (item) {
            queue.createJob('api-removefile', {
                url: item.url.slice(6),
                fileName: item.fileName
            }, function (err) {
                if (err) {
                    request.log(['error'], 'Error: publish message to queue')
                } else {
                    request.log(['error'], 'publish message to queue')
                }
            });
        });
    }

    let saveAndReply = function () {
        let promise = blog.save();
        promise.then(function (blog) {
            return reply(blog);
        }).catch(function (err) {
            return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        });
    }

    if (request.payload.featured_image.length > 0) {
        let width = 407;
        let height = 305;
        let nameImg = request.payload.featured_image[0].url;

        let resizeImage = request.server.resizeImage;

        resizeImage({
            directory: '/blog_image/',
            name: nameImg,
            width: width,
            height: height,
            deleteFileSrc: true,
            saveToOldDir: true
        }).then(function (resp) {
            blog.featured_image[0].url = resp.filename;
            saveAndReply()
        }).catch(function (err) {

            console.log('Err resize ', err);
            saveAndReply();
        });
    }
    else saveAndReply();
}

function update(request, reply) {
    let blog = request.pre.blog;
    request.auditLog.logEvent(
        request.auth.credentials.uid,
        'mongoose',
        'update',
        'blog',
        JSON.stringify({ new: _.extend(blog, request.payload), old: blog }),
        'update blog'
    );

    blog = _.extend(blog, request.payload);
    /*Create job delete image*/
    let filesDelete = request.payload.listImgDelete;
    if (filesDelete) {
        let queue = request.server.plugins['hapi-kue'];
        filesDelete.forEach(function (item) {
            queue.createJob('api-removefile', {
                url: item.url.slice(6),
                fileName: item.fileName
            }, function (err) {
                if (err) {
                    request.log(['error'], 'Error: publish message to queue')
                } else {
                    request.log(['error'], 'publish message to queue')
                }
            });
        });
    }

    let saveAndReply = function () {
        let promise = blog.save();
        promise.then(function (blog) {
            return reply(blog);
        }).catch(function (err) {
            return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        });
    }

    if (request.payload.featured_image.length > 0) {
        let width = 407;
        let height = 305;
        let nameImg = request.payload.featured_image[0].url;

        let resizeImage = request.server.resizeImage;

        resizeImage({
            directory: '/blog_image/',
            name: nameImg,
            width: width,
            height: height,
            deleteFileSrc: true,
            saveToOldDir: true
        }).then(function (resp) {
            blog.featured_image[0].url = resp.filename;
            saveAndReply()
        }).catch(function (err) {
            request.log(['error', 'update', 'blog', 'resize'], err)
            saveAndReply();
        });
    }
    else saveAndReply();
}

function deleteItem(request, reply) {

    const blog = request.pre.blog;
    request.auditLog.logEvent(
        request.auth.credentials.uid,
        'mongoose',
        'delete',
        'blog',
        JSON.stringify({ new: null, old: blog }),
        'delete blog'
    );

    blog.remove((err) => {
        if (err) {
            return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        }
        return reply(blog);
    });
}

function getAllTag(request, reply) {
    let options = { type: 'BL' }; //type is blog(BL)
    let dataRes = {
        success: false,
        data: []
    };
    Tag.find(options).exec(function (err, items) {
        if (err) {
            return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        }
        dataRes.success = true;
        dataRes.data = items;

        return reply(dataRes);
    });

}