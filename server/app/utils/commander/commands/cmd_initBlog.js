const mongoose = require('mongoose');
const Blog = mongoose.model('Blog');
const blogData = require('./../data/blog.json');
const async = require("async");

module.exports = function initBlog(program) {
    'use strict';

    program
        .command('initBlog')
        .description('Init data blog')
        .action(function (command) {
            program.successMessage('Preparing to import data to blog collection');
            async.each(blogData, function (data, fnCallback) {
                let blog = new Blog(data);
                const promise = blog.save();
                promise.then(function (resp) {
                    program.successMessage('\t -> Created post: \'%s\'', resp.name);
                    fnCallback()
                }).catch(function (err) {
                    program.errorMessage('\t -> Skip post: ', data.name, '' + err.errmsg);
                    fnCallback();
                })
            },
                function done(err) {
                    if (err) {
                        program.errorMessage('\t -> Error async \'%s\'', '' + err)
                    }
                    program.successMessage('--->>> Init successfully blog <<<---');
                    process.exit(1);
                });
        });
};
