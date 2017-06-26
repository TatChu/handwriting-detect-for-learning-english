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
    let user_id;
    if (request.params.uid) {
        user_id = request.params.uid;
    }
    else {
        user_id = request.auth.credentials.uid;
    }
    if (user_id == '') // user chua dang nhap
        reply.continue();
    else {
        let rootDir = checkExitsDir(config.get('web.dirDataNeuralNetwork.root'))
        let dir = {
            root: checkExitsDir(rootDir),
            general: checkExitsDir(config.get('web.dirDataNeuralNetwork.general')),
            user: {
                root: checkExitsDir(rootDir + user_id + '/'),
                input: checkExitsDir(rootDir + user_id + '/input/'),
                processed: checkExitsDir(rootDir + user_id + '/processed/'),
                output: checkExitsDir(rootDir + user_id + '/output/'),
            }
        }
        fs.readdir(dir.user.input, (err, files) => {
            dir.user.file_input = files;
            reply(dir);
        })
    }
}

/**
 * Kiểm tra thư muc đã tồn tại chưa, chưa tồn tại thì tạo mới
 * Return đường đẫn
 */
function checkExitsDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    return dir;
}