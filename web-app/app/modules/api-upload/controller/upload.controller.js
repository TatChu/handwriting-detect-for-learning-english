'use strict';

const Boom = require('boom');
const Joi = require('joi');
const fs = require('fs');
const path = require('path');
const JWT = require('jsonwebtoken');
const mkdirp = require('mkdirp');
const UploadFile = require(BASE_PATH + '/app/modules/api-upload/util/upload.js');

module.exports = {
    uploadFile: uploadFile,
    fileBrowserUploadCKE: fileBrowserUploadCKE,
    imageUploadCKE: imageUploadCKE,
    uploadBase64
};

function uploadFile(request, reply) {
    UploadFile.uploadFile(request).then(function (resp) {
        return reply(resp);
    }).catch(function (err) {
        return reply(err);
    });
}

function imageUploadCKE(request, reply) {
    request.payload = {
        file: request.payload.upload,
        type: request.query.type,
        prefix: request.query.prefix
    }
    UploadFile.uploadFile(request).then(function (resp) {
        let config = request.server.configManager;
        return reply({
            fileName: resp.filename,
            uploaded: 1,
            url: "/files/product_image/" + resp.filename
        });
    }).catch(function (err) {
        return reply(err);
    });
}

function fileBrowserUploadCKE(request, reply) {
    let func_numb = request.query.CKEditorFuncNum;
    request.payload = {
        file: request.payload.upload,
        type: request.query.type,
        prefix: request.query.prefix
    }
    UploadFile.uploadFile(request).then(function (resp) {
        let config = request.server.configManager;
        let script = '';
        script += '<script type="text/javascript">';
        script += 'window.parent.CKEDITOR.tools.callFunction(' + func_numb + ', "' + '\/files\/' + request.payload.type + '\/' + resp.filename + '", "");';
        script += '</script>';

        return reply(script);
    }).catch(function (err) {
        return reply(err);
    });
}

function uploadBase64(request, reply) {
    let data = request.payload.image;
    if (!data)
        return reply(Boom.badRequest('Can not read image upload'));

    let matches = data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (matches.length !== 3) {
        return reply(Boom.badRequest('Invalid image'));;
    }

    let type = matches[1];
    let imageBuffer = new Buffer(matches[2], 'base64');

    let config = request.server.configManager;
    let directory = request.payload.directory || 'base64';
    let fileName = directory + '_' + Date.now() + '.jpg';
    // fix if dir config not exits
    if (!fs.existsSync(config.get('web.upload.path'))) {
        fs.mkdirSync(config.get('web.upload.path'));
    }

    let dist = config.get('web.upload.path') + '/' + directory;
    if (!fs.existsSync(dist)) {
        fs.mkdirSync(dist);
    }

    dist = dist + '/' + fileName;

    // Save image to disk
    fs.writeFile(dist, imageBuffer, function (err) {
        if (err) {
            return reply(Boom.badRequest('Error occur while save image'));;
        }
        else {
            let dataReply = {
                name: fileName,
                directory: directory,
                type: type
            }
            return reply(dataReply);
        }
    });
}