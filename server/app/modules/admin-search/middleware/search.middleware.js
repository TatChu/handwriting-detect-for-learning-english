const mongoose = require('mongoose');
const Search = mongoose.model('Search');

module.exports = {
    getSearch
}

function getSearch(type) {
    return function (request, reply) {
        if (type == 'payload') {
            var promise = Search.findOne({ keyword: request.payload.data.keyword });
        }
        if (type == 'params') {
            var promise = Search.findById(request.params.id);
        }
        promise.then(function (resp) {
            return reply(resp);
        })
    }
}