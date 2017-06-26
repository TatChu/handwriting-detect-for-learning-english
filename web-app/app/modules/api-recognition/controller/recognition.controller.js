'use strict';
const Boom = require('boom');
const Joi = require('joi');
const mongoose = require('mongoose');
const _ = require('lodash');
const ErrorHandler = require(BASE_PATH + '/app/utils/error.js');
// const ImageUtil = require(BASE_PATH + '/app/utils/process-image/convert2BW.js');
const RecognitionUtil = require(BASE_PATH + '/app/utils/recognition/recognition.js');
const ImgProcess = require(BASE_PATH + '/app/utils/process-image/image-process.js');
const User = mongoose.model('User');
const Unit = mongoose.model('Unit');
const Vocabulary = mongoose.model('Vocabulary');


module.exports = {
    recognition,
    processImg,
    autoCropImg,
    analysisImage
};

function recognition(request, reply) {
    let image = request.payload.name;
    RecognitionUtil.recognition('public/files/tmp/' + image).then(function (resp) {
        return reply(resp);
    }).catch(function (err) {
        console.log('err recognition', err);
        return reply(Boom.badRequest(ErrorEventHandler.getErrorMessage(err)));
    });
}

function processImg(request, reply) {
    let config = request.server.configManager;
    let tempImgContentPath = config.get('web.upload.tempImgContentPath');
    ImgProcess.convertToBW(tempImgContentPath, request.payload.name, {
        lowThresh: 0,
        highThresh: 8
    }).then(function (resp) {
        return reply({ resp })
    }).catch(function (err) {
        console.log(err);
        return reply({ err: err })
    })
}


function autoCropImg(request, reply) {
    let config = request.server.configManager;
    let tempImgPath = config.get('web.upload.tempImgPath');

    let name = request.payload.name;
    let dir = request.payload.directory || tempImgPath;
    let options = {};
    ImgProcess.cropByContour(dir, name, options).then(res => {
        return reply(res);
    }).catch(err => {
        return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
    })
}

function analysisImage(request, reply) {
    let config = request.server.configManager;
    let tempImgPath = config.get('web.upload.tempImgPath');

    let name = request.payload.name;
    let dir = request.payload.directory || tempImgPath;

    let options = {
        dirDist: dir
    };
    ImgProcess.analysisImage(dir, name, options).then(res => {
        return reply(res);
    }).catch(err => {
        return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
    })
}