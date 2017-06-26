'use strict';

const UserController = require('./controller/user.controller.js');
const UserMiddleware = require('./middleware/user.middleware.js');;
const AclMiddleware = require(BASE_PATH + '/app/utils/middleware/Acl.mdw.js');

exports.register = function (server, options, next) {
    server.route({
        method: 'GET',
        path: '/hoc-vien/thong-tin-tai-khoan',
        handler: UserController.info
    });

    server.route({
        method: 'GET',
        path: '/hoc-vien/nhan-dang-chu-cua-toi',
        handler: UserController.recognitionMyData,
        config: {
            pre: [
                { method: UserMiddleware.folderDefaultUser, assign: 'userFolder' }
            ]
        }
    });
    server.route({
        method: 'GET',
        path: '/hoc-vien/bai-hoc-yeu-thich',
        handler: UserController.favoriteUnit
    });
    server.route({
        method: 'GET',
        path: '/hoc-vien/doi-mat-khau',
        handler: UserController.changePass
    });

    server.route({
        method: 'GET',
        path: '/admin/view-data-recogniton/{uid}',
        handler: UserController.adminDataRecognition,
        config: {
            pre: [
                { method: UserMiddleware.folderDefaultUser, assign: 'userFolder' }
            ],
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
        }
    });

    next();
};

exports.register.attributes = {
    name: 'web-user'
};