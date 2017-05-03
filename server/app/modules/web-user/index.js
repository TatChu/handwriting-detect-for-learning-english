'use strict';

const UserController = require('./controller/user.controller.js');
const UserMiddleware = require('./middleware/user.middleware.js');;

exports.register = function (server, options, next) {
    server.route({
        method: 'GET',
        path: '/khach-hang/thong-tin-tai-khoan',
        handler: UserController.info
    });

    server.route({
        method: 'GET',
        path: '/khach-hang/so-tay-noi-tro',
        handler: UserController.favoriteProduct
    });

    server.route({
        method: 'GET',
        path: '/khach-hang/nhan-dang-chu-cua-toi',
        handler: UserController.recognitionMyData,
        config: {
            pre: [
                { method: UserMiddleware.folderDefaultUser, assign: 'userFolder' }
            ]
        }
    });
    server.route({
        method: 'GET',
        path: '/khach-hang/bai-hoc-yeu-thich',
        handler: UserController.order
    });
    server.route({
        method: 'GET',
        path: '/khach-hang/doi-mat-khau',
        handler: UserController.changePass
    });

    next();
};

exports.register.attributes = {
    name: 'web-user'
};