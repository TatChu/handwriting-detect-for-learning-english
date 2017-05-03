'use strict';

const mongoose = require('mongoose');
const ShippingFee = mongoose.model('ShippingFee');
const fs = require('fs');

module.exports = {
    folderDefaultUser,
    getAllShipping
}

/**
 * Middleware
 */



function folderDefaultUser(request, reply) {
    let config = request.server.configManager;
    let user_id = request.auth.credentials.uid;
    if (user_id == '') // user chua dang nhap
        reply.continue();
    else {
        let rootDir = checkExitsDir(config.get('web.dirDataTraninng.root'))
        let dir = {
            root: checkExitsDir(rootDir),
            general: checkExitsDir(config.get('web.dirDataTraninng.general')),
            user: {
                root: checkExitsDir(rootDir + user_id + '/'),
                scan: checkExitsDir(rootDir + user_id + '/scan/'),
                processed: checkExitsDir(rootDir + user_id + '/processed/'),
                output: checkExitsDir(rootDir + user_id + '/output/'),
            }
        }

        reply(dir);
    }
}

/**
 * Kiểm tra thư muc đã tồn tại chưa, chưa tồn tại thì tạo mới
 * Return đường đẫn
 */
function checkExitsDir(dir) {
    let realPath = process.cwd() + dir;
    if (!fs.existsSync(realPath)) {
        fs.mkdirSync(realPath);
    }
    return dir;
}

function getAllShipping(request, reply) {
    let promise = ShippingFee.find({});
    promise.then(function (shippingfee) {
        reply(shippingfee);
    }).catch(function (err) {
        request.log(['error'], err);
        return reply.continue();
    })
}