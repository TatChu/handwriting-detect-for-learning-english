'use strict';

const WebOrderController = require('./controller/web_blog.controller.js');

exports.register = function (server, options, next) {
     server.route({
        method: ['GET'],
        path: '/meo-vat/{params*}',
        handler: WebOrderController.getListPostTips
    });

     server.route({
        method: 'GET',
        path: '/meo-vat/{articleName}-{articleId}',
        handler: WebOrderController.getDetailTip
    });

    server.route({
        method: ['GET', 'POST', 'PUT'],
        path: '/goc-bep/{params*}',
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
        path: '/goc-bep/{articleName}-{articleId}',
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
