const mongoose = require('mongoose');
const Boom = require('boom');
const ErrorHandler = require(BASE_PATH + '/app/utils/error.js');

const Category = mongoose.model('Category');
const Config = mongoose.model('Config');

module.exports = {
    getCategory,
    getConfig
}

function getCategory(request, reply) {
    let promise = Category.find();
    promise.then(function (data) {
        reply(data);
    }).catch(function (err) {
        request.log(err);
        return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
    });
}

function getConfig(option) {
    return function (request, reply) {
        let promise = Config.findOne(option);
        promise.then(function (data) {
            reply(data);
        }).catch(function (err) {
            request.log(err);
            return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        })
    }
}