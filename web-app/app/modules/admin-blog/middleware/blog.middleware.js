'use strict';

const mongoose = require('mongoose');
const Blog = mongoose.model('Blog');

module.exports = {
    getById,
    getBySlug,
}

/**
 * Middleware
 */
 function getById(request, reply) {
    const id = request.params.id || request.payload.id;
    let promise = Blog.findOne({ _id: id });
    promise.then(function (blog) {
        reply(blog);

    }).catch(function (err) {
        request.log(['error'], err);
        return reply.continue();
    })
}

function getBySlug(request, reply) {
    const slug = request.params.slug || request.payload.slug;
    let promise = Blog.findOne({ slug: slug });
    promise.then(function (blog) {
        return reply(blog);

    }).catch(function (err) {
        request.log(['error'], err);
        return reply.continue();
    })
}