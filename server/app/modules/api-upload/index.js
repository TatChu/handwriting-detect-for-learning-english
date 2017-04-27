'use strict';

const UploadController = require('./controller/upload.controller.js');
const S3UploadController = require('./controller/s3upload.controller.js');
const UploadValidate = require('./validate/upload.validate.js');

exports.register = function (server, options, next) {
    var configManager = server.plugins['hapi-kea-config'];
    let queue = server.plugins['hapi-kue'];
    let uploadHelper = require('./util/upload');

    server.expose('deleteFile', uploadHelper.deleteFile);
    server.decorate('server', 'resizeImage', uploadHelper.resizeImage);

    server.route({
        method: 'POST',
        path: '/upload/file',
        handler: UploadController.uploadFile,
        config: {
            auth: false,
            validate: UploadValidate.validate,
            payload: UploadValidate.payload,
            description: 'Handle Upload File',
            tags: ['api'],
            plugins: {
                'hapi-swagger': {
                    responses: { '400': { 'description': 'Bad Request' } },
                    payloadType: 'form'
                }
            },
        },
    });

    server.route({
        method: 'POST',
        path: '/upload/base64',
        handler: UploadController.uploadBase64,
        config: {
            auth: false,
            validate: UploadValidate.uploadBase64,
            description: 'Handle Upload Image base 64',
            tags: ['api'],
            plugins: {
                'hapi-swagger': {
                    responses: { '400': { 'description': 'Bad Request' } },
                    payloadType: 'form'
                }
            },
        },
    });
    
    server.route({
        method: 'POST',
        path: '/upload/pdf',
        config: S3UploadController.uploadPDF
    });

    server.route({
        method: 'POST',
        path: '/upload/for-ckeditor/file-browser-upload',
        handler: UploadController.fileBrowserUploadCKE,
        config: {
            auth: false,
            validate: UploadValidate.validate,
            payload: UploadValidate.payload,
            description: 'Handle Upload File',
            tags: ['api'],
            plugins: {
                'hapi-swagger': {
                    responses: { '400': { 'description': 'Bad Request' } },
                    payloadType: 'form'
                }
            },
        },
    });

    server.route({
        method: 'POST',
        path: '/upload/for-ckeditor/image-upload',
        handler: UploadController.imageUploadCKE,
        config: {
            auth: false,
            validate: UploadValidate.validate,
            payload: UploadValidate.payload,
            description: 'Handle Upload File',
            tags: ['api'],
            plugins: {
                'hapi-swagger': {
                    responses: { '400': { 'description': 'Bad Request' } },
                    payloadType: 'form'
                }
            },
        },
    });

    queue.processJob('api-removefile', function (job, done) {
        let data = job.data;
        uploadHelper.deleteFile(data.url, data.fileName);
        done();
    });


    /**
     * callback({
     *  success: true / false
     * })
     */
    queue.processJob('api-resize-img', function (job, callback) {
        let data = job.data;
        uploadHelper.resizeImage(data).then(function (resp) {
            console.log('DONE: ', resp);
            callback(resp);
        }).catch(function (err) {
            console.log('ERROR: ', err);
            callback(err);
        });
    });

    next();
};

exports.register.attributes = {
    name: 'api-upload'
};
