'use strict';
const Boom = require('boom');
const Joi = require('joi');
const mongoose = require('mongoose');
const _ = require('lodash');
const Product = mongoose.model('Product');
const Category = mongoose.model('Category');
const Tag = mongoose.model('Tag');
const Blog = mongoose.model('Blog');
const path = require('path');


const ErrorHandler = require(BASE_PATH + '/app/utils/error.js');
var async = require('asyncawait/async');
var await = require('asyncawait/await');

module.exports = {
    listPostByTag,
    getDetailPost,

    getAllPost,
    getAllTagBlog,
    getPolicyPage,
    getDetailPageKhuyenMai,

    getListPostTips,
    getDetailTip
};
//meo-vat
function getListPostTips(request, reply) {
    const Meta = request.server.plugins['service-meta'];
    var meta = JSON.parse(JSON.stringify(Meta.getMeta('meo-vat')));
    let Domain = request.info.referrer.substring(0, request.info.referrer.indexOf('/meo-vat'));
    let params = [];
    if (request.params.params)
    { params = request.params.params.split('*'); }

    let promiseTag = Tag.find({ type: 'BL' }, { 'name': true, _id: true }).exec();

    let page = 1;
    if (params.length > 0)
        page = params[0] || 1;
    let tag = '';
    if (params.length > 1)
        tag = params[1] || '';
    let isFilterTag = tag != '';

    let config = request.server.configManager;
    let imgBlogDir = '/files/blog_image/';

    let itemsPerPage = 8 //config.get('web.paging.itemsPerPage') || 10;
    let numberVisiblePages = config.get('web.paging.numberVisiblePages');
    let options = {
        type: 'MV',
        status: true
    };
    if (tag != '') {
        options.tags = {
            $in: [tag]
        }
    }
    if (request.query.keyword && request.query.keyword.length > 0) {
        let message = new RegExp(request.query.keyword, 'i');
        options.$or = [{
            name: message
        }, {
            content: message
        }, {
            meta_title: message
        }, {
            meta_keywords: message
        }, {
            short_description: message
        }
        ]
    }
    if (typeof request.query.id !== "undefined")
        options._id = request.query.id;

    return Blog.find(options).sort({ createdAt: -1 }).populate('auth_id tags').paginate(page, itemsPerPage, function (err, items, total) {
        if (err) {
            request.log(['error', 'list', 'page'], err);
            reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        }
        items.forEach(function (post, index) {
            if (items[index].auth_id !== null)
                items[index].auth_id = { _id: post.auth_id._id, name: post.auth_id.name }
        });
        let totalPage = Math.ceil(total / itemsPerPage);
        let dataRes = { status: true, totalItems: total, totalPage: totalPage, currentPage: page, itemsPerPage: itemsPerPage, numberVisiblePages: numberVisiblePages, items: items, totalPageSub2: totalPage - 2, totalPageSub1: totalPage - 1 };

        return promiseTag.then(function (tags) {
            let data = { meta, imgBlogDir, Domain, data: dataRes, tags: tags, isFilterTag: isFilterTag, menu: { tip: true }, class: { body_class: 'page-blog' }, tag: tag };
            return reply.view('web-blog/view/client/blog-tip/tip', data, { layout: 'web/layout' });
        }).catch(function (err) {
            request.log(['error', 'blog'], err);
            return reply.redirect('/error404');
        })

    });
}



//goc-bep/1#tagName
function listPostByTag(request, reply) {
    const Meta = request.server.plugins['service-meta'];
    var meta = JSON.parse(JSON.stringify(Meta.getMeta('goc-bep')));
    let Domain = request.info.referrer.substring(0, request.info.referrer.indexOf('/goc-bep'));
    let params = [];
    if (request.params.params)
    { params = request.params.params.split('*'); }

    let promiseTag = Tag.find({ type: 'BL' }, { 'name': true, _id: true }).exec();

    let page = 1;
    if (params.length > 0)
        page = params[0] || 1;
    let tag = '';
    if (params.length > 1)
        tag = params[1] || '';
    let isFilterTag = tag != '';

    let config = request.server.configManager;
    let imgBlogDir = '/files/blog_image/';

    let itemsPerPage = 8 //config.get('web.paging.itemsPerPage') || 10;
    let numberVisiblePages = config.get('web.paging.numberVisiblePages');
    let options = {
        type: 'GB',
        status: true
    };
    if (tag != '') {
        options.tags = {
            $in: [tag]
        }
    }
    if (request.query.keyword && request.query.keyword.length > 0) {
        let message = new RegExp(request.query.keyword, 'i');
        options.$or = [{
            name: message
        }, {
            content: message
        }, {
            meta_title: message
        }, {
            meta_keywords: message
        }, {
            short_description: message
        }
        ]
    }
    if (typeof request.query.id !== "undefined")
        options._id = request.query.id;

    return Blog.find(options).sort({ createdAt: -1 }).populate('auth_id tags').paginate(page, itemsPerPage, function (err, items, total) {
        if (err) {
            request.log(['error', 'list', 'page'], err);
            reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        }
        items.forEach(function (post, index) {
            if (items[index].auth_id !== null)
                items[index].auth_id = { _id: post.auth_id._id, name: post.auth_id.name }
        });
        let totalPage = Math.ceil(total / itemsPerPage);
        let dataRes = { status: true, totalItems: total, totalPage: totalPage, currentPage: page, itemsPerPage: itemsPerPage, numberVisiblePages: numberVisiblePages, items: items, totalPageSub2: totalPage - 2, totalPageSub1: totalPage - 1 };

        return promiseTag.then(function (tags) {
            let data = { meta, imgBlogDir, Domain, data: dataRes, tags: tags, isFilterTag: isFilterTag, menu: { blog: true }, class: { body_class: 'page-blog' }, tag: tag };
            return reply.view('web-blog/view/client/blog-tag/view', data, { layout: 'web/layout' });
        }).catch(function (err) {
            request.log(['error', 'blog'], err);
            return reply.redirect('/error404');
        })

    });
}


function getAllPost(request, reply) {

    let page = request.query.page || 1;
    let config = request.server.configManager;
    let itemsPerPage = parseInt(request.query.limit) || config.get('web.paging.itemsPerPage');
    let numberVisiblePages = config.get('web.paging.numberVisiblePages');
    let options = {
        type: 'GB',
        status: true
    };
    if (request.query.tag && request.query.tag.length) {
        options.tags = {
            $in: [request.query.tag]
        }
    }
    if (request.query.keyword && request.query.keyword.length > 0) {
        let message = new RegExp(request.query.keyword, 'i');
        options.$or = [{
            name: message
        }, {
            content: message
        }, {
            meta_title: message
        }, {
            meta_keywords: message
        }, {
            short_description: message
        }
        ]
    }
    if (typeof request.query.id !== "undefined")
        options.id = request.query.id;

    Blog.find(options).sort({ createdAt: -1 }).populate('auth_id tags').paginate(page, itemsPerPage, function (err, items, total) {
        if (err) {
            request.log(['error', 'list', 'page'], err);
            reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        }
        items.forEach(function (post, index) {
            if (items[index].auth_id !== null)
                items[index].auth_id = { _id: post.auth_id._id, name: post.auth_id.name }
        });
        let totalPage = Math.ceil(total / itemsPerPage);
        let dataRes = { status: '1', totalItems: total, totalPage: totalPage, currentPage: page, itemsPerPage: itemsPerPage, numberVisiblePages: numberVisiblePages, items: items };
        reply(dataRes);
    });
}


function getDetailPost(request, reply) {
    const Meta = request.server.plugins['service-meta'];
    var meta = JSON.parse(JSON.stringify(Meta.getMeta('detail-article-gb')));
    let config = request.server.configManager;
    let id = request.params.articleId;
    let query = Blog.findById(id);
    let Domain = request.info.referrer.substring(0, request.info.referrer.indexOf('/goc-bep'));
    let promiseTag = Tag.find({ type: 'BL' }, { 'name': true, _id: true }).exec();

    query.populate('auth_id tags');
    return query.exec(function (err, post) {
        if (err || !post)
            return reply.redirect('/goc-bep');

        //Update count views
        post.views += 1;
        post.save();
        meta.title = post.name;
        meta.og_title = post.meta_title != '' ? post.meta_title : post.name;
        meta.og_url = Domain + request.path;
        meta.og_description = post.meta_description != '' ? post.meta_description : post.short_description;

        if (post.featured_image.length > 0)
            meta.og_image = Domain + '/files/blog_image/' + post.featured_image[0].url;
        return promiseTag.then(function (tags) {
            let data = {
               
                Domain: Domain,
                post: post,
                meta: meta,
                menu: { blog: true }, 
                class: { body_class: 'page-blog' },
                tags: tags
            };

            return reply.view('web-blog/view/client/blog-detail/detail', data, { layout: 'web/layout' });
        }).catch(function (err) {
            request.log(['error', 'detail blog'], err);
            return reply.redirect('/error404');
        });
    });
}

function getDetailTip(request, reply) {
    const Meta = request.server.plugins['service-meta'];
    var meta = JSON.parse(JSON.stringify(Meta.getMeta('detail-article-meo-vat')));
    let config = request.server.configManager;
    let id = request.params.articleId;
    let query = Blog.findById(id);
    let Domain = request.info.referrer.substring(0, request.info.referrer.indexOf('/meo-vat'));
    let promiseTag = Tag.find({ type: 'BL' }, { 'name': true, _id: true }).exec();

    query.populate('auth_id tags');
    return query.exec(function (err, post) {
        if (err || !post)
            return reply.redirect('/meo-vat');

        //Update count views
        post.views += 1;
        post.save();
        meta.title = post.name;
        meta.og_url = Domain + request.path
        meta.og_title = post.meta_title != '' ? post.meta_title : post.name;
        meta.og_description = post.meta_description != '' ? post.meta_description : post.short_description;

        if (post.featured_image.length > 0)
            meta.og_image = Domain + '/files/blog_image/' + post.featured_image[0].url;
        return promiseTag.then(function (tags) {
            let data = {
                Domain: Domain,
                post: post,
                meta: meta,
                menu: { tip: true }, // cờ để check active menu và page góc bếp hay page banner
                class: { body_class: 'page-blog' },
                tags: tags
            };

            return reply.view('web-blog/view/client/detail-tip/tip-detail', data, { layout: 'web/layout' });
        }).catch(function (err) {
            request.log(['error', 'detail blog tip'], err);
            return reply.redirect('/error404');
        });
    });
}


function getPolicyPage(request, reply) {
    const Meta = request.server.plugins['service-meta'];
    var meta = JSON.parse(JSON.stringify(Meta.getMeta('detail-article-cs')));
    let slug = request.params.namePage;

    if (request.params.namePage == 'robots.txt' || request.params.namePage == 'googleefbd7906bd9b9e6b.html')
        return reply.file(path.join(request.params.namePage));

    Blog.findOne({ slug: slug, type: 'CS', status: true }).exec().then(function (post) {
        if (!post) return reply.redirect('/error404');
        else {
            //Update count views
            post.views += 1;
            post.save();

            Blog.find({ type: 'CS', status: true }).exec(function (err, posts) {
                if (err)
                    return reply.redirect('/error404');
                let dataRes = {
                    meta,
                    allPostPolicy: posts,
                    post: null,
                    class: { body_class: 'page-blog' }
                };

                dataRes.post = post;

                dataRes.meta.title = dataRes.post.name;
                dataRes.meta.og_title = dataRes.post.meta_title != '' ? dataRes.post.meta_title : dataRes.post.name;
                dataRes.meta.og_description = dataRes.post.meta_description != '' ? dataRes.post.meta_description : dataRes.post.short_description;

                return reply.view('web-blog/view/client/policy-page/policy-view', dataRes, { layout: 'web/layout' });
            });
        }
    }).catch(err => {
        return reply.redirect('/error404');
    })
}

function getDetailPageKhuyenMai(request, reply) {
    const Meta = request.server.plugins['service-meta'];
    var meta = JSON.parse(JSON.stringify(Meta.getMeta('detail-article-cs')));
    let slug = request.params.namePage;
    Blog.findOne({ slug: slug, type: 'BN' }).exec().then(function (post) {
        if (!post) return reply.redirect('/error404');
        else {
            //Update count views
            post.views += 1;
            post.save();
            const Meta = request.server.plugins['service-meta'];
            var meta = JSON.parse(JSON.stringify(Meta.getMeta('detail-article-gb')));
            let config = request.server.configManager;
            let Domain = request.info.referrer.substring(0, request.info.referrer.length - 1);

            meta.title = post.name;
            meta.og_url = Domain + request.path
            meta.og_title = post.meta_title != '' ? post.meta_title : post.name;
            meta.og_description = post.meta_description != '' ? post.meta_description : post.short_description;

            if (post.featured_image.length > 0)
                meta.og_image = Domain + '/files/blog_image/' + post.featured_image[0].url;
            let data = {
                Domain: Domain,
                post: post,
                meta: meta,
                class: { body_class: 'page-blog' },
            };

            return reply.view('web-blog/view/client/blog-detail/detail', data, { layout: 'web/layout' });
        }
    }).catch(err => {
        return reply.redirect('/error404');
    })
}

function getAllTagBlog(request, reply) {
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
