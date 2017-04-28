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
        path: '/blogs',
        handler: WebOrderController.getAllPost
    });

    server.route({
        method: 'GET',
        path: '/tags-blog',
        handler: WebOrderController.getAllTagBlog
    });

    server.route({
        method: 'GET',
        path: '/dien-dan/{articleName}-{articleId}',
        handler: WebOrderController.getDetailPost
    });

    /**
     * get pages chinh sách, liên kết banner
     * ex: chinh-sach-giao-hang/ gioi-thieu/ cau-hoi-thuong-gap ...
     */

    server.route({
        method: 'GET',
        path: '/{namePage}',
        handler: WebOrderController.getPolicyPage
    });

    server.route({
        method: 'GET',
        path: '/chuong-trinh-khuyen-mai/{namePage}',
        handler: WebOrderController.getDetailPageKhuyenMai
    });
    next();
};

exports.register.attributes = {
    name: 'web-blog'
};
