'use strict';

// const UploadController = require('./controller/upload.controller.js');
// const S3UploadController = require('./controller/s3upload.controller.js');

exports.register = function (server, options, next) {
    var configManager = server.plugins['hapi-kea-config'];

    // server.route({
    //     method: 'GET',
    //     path: '/api/upload',

    //     config: UploadController.index
    // });

    // server.route({
    //     method: 'POST',
    //     path: '/api/upload/file',   
    //     config: UploadController.uploadFile
    // });

    // server.route({
    //     method: 'POST',
    //     path: '/api/upload/pdf',
    //     config: S3UploadController.uploadPDF
    // });

    next();
};

exports.register.attributes = {
    name: 'api-socket'
};
