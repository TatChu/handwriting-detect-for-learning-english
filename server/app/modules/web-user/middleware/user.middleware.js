'use strict';

const mongoose = require('mongoose');
const fs = require('fs');

module.exports = {
    folderDefaultUser,
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
        let rootDir = checkExitsDir(config.get('web.dirDataNeuralNetwork.root'))
        let dir = {
            root: checkExitsDir(rootDir),
            general: checkExitsDir(config.get('web.dirDataNeuralNetwork.general')),
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
