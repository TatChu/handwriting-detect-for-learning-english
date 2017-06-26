'use strict';

const WebOrderController = require('./controller/web_blog.controller.js');

exports.register = function (server, options, next) {

    server.route({
        method: ['GET', 'POST', 'PUT'],
        path: '/dien-dan/{params*}',
        handler: WebOrderController.listPostByTag
    });


    server.route({
        method: 'GET',
        path: '/dien-dan/{articleName}-{articleId}',
        handler: WebOrderController.getDetailPost
    });

    server.route({
        method: ['GET'],
        path: '/{slugPost}',
        handler: WebOrderController.openPageHuongDanGioiThieu
    });


    next();
};

exports.register.attributes = {
    name: 'web-blog'
};
