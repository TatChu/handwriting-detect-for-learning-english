'use strict';

const mongoose = require('mongoose');
const Banner = mongoose.model('Banner');

module.exports = {
    getBanner
}

function getBanner(type) {
    return function (request, reply) {
        if (type == 'params') {
            var promise = Banner.findById(request.params.id);
        }
        promise.then(function(resp){
            reply(resp);
        })
    }
}