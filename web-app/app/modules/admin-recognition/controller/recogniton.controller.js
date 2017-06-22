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
    updateJson
};

function updateJson(request, reply) {
    let data = request.payload.data;
    console.log(data);
    return reply({
        success: true
    })
}