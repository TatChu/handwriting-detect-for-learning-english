const mongoose = require('mongoose');
const Search = mongoose.model('Search');

module.exports = {
    findSearch
}

function findSearch(request, reply) {
    let promise = Search.findOne({
        keyword: request.query.search
    });
    promise.then(function (resp) {
        reply(resp);
    })
}