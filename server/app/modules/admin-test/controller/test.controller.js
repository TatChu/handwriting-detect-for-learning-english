'use strict';
const Boom = require('boom');
const Joi = require('joi');
const mongoose = require('mongoose');
const ErrorHandler = require(BASE_PATH + '/app/utils/error.js');
const async = require("async");
const _ = require('lodash');
const fs = require('fs');
const util = require('util');


module.exports = {
    testResizeImg
};

function testResizeImg(request, reply) {
    let queue = request.server.plugins['hapi-kue'];

    let width = request.payload.width;
    let height = request.payload.height;
    let name = request.payload.name;

    let resizeImage = request.server.resizeImage;

    resizeImage({
        name: name,
        width: width,
        height: height,
        deleteFileSrc: false
    }).then(function (resp) {
        return reply(resp);
    }).catch(function (err) {
        console.log('ERROR: ', err);
        return reply(resp);
        callback(err);
    });
}