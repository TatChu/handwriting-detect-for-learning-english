'use strict';
const Boom = require('boom');
const Joi = require('joi');
const mongoose = require('mongoose');
const _ = require('lodash');
const ErrorHandler = require(BASE_PATH + '/app/utils/error.js');
const ImageUtil = require(BASE_PATH + '/app/utils/process-image/convert2BW.js');
const RecognitionUtil = require(BASE_PATH + '/app/utils/recognition/recognition.js');
const User = mongoose.model('User');
const Unit = mongoose.model('Unit');
const Vocabulary = mongoose.model('Vocabulary');


module.exports = {
    recognition,
    processImg,
};

function recognition(request, reply) {
    let image = request.payload.name;
    RecognitionUtil.recognition('public/files/tmp/' + image).then(function (resp) {
        return reply(resp);
    }).catch(function (err) {
        console.log('err recognition', err);
        return Boom.badRequest('Error', err)
    });
}

function processImg(request, reply) {
    let config = request.server.configManager;
    let tempImgContentPath = config.get('web.upload.tempImgContentPath');
    ImageUtil.PreProcess(tempImgContentPath, request.payload.name, {
        lowThresh: 0,
        highThresh: 8
    }).then(function (resp) {
        return reply({ resp })
    }).catch(function (err) {
        console.log(err);
        return reply({ err: err })
    })
}