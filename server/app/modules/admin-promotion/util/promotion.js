'use strict';

const Boom = require('boom');
// const Joi = require('joi');
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const Promise = require("bluebird");
const mongoose = require('mongoose');

const Promotion = mongoose.model('Promotion');

module.exports = {
	getAll: getAll,
};

function getAll(request, reply){
    let promise = Promotion.find();
    promise.then(function(resp){
        return reply(resp);
    })
}