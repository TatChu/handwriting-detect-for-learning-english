const mongoose = require('mongoose');
const Tag = mongoose.model('Tag');
const tagsData = require('./../data/tag.json');
const async = require("async");

module.exports = function initTag(program) {
    'use strict';

    program
        .command('initTag')
        .description('Init data tag')
        .action(function (command) {
            program.successMessage('Preparing to import data to tag collection');
            async.each(tagsData, function (data, fnCallback) {
                let tag = new Tag(data);
                const promise = tag.save();
                promise.then(function (resp) {
                    program.successMessage('\t -> Created tag \'%s\'', resp.name);
                    fnCallback()
                }).catch(function (err) {
                    program.errorMessage('\t -> Error create tag \'%s\' : %s', data.name, '' + err.errmsg);
                    fnCallback();
                })
            },
                function done(err) {
                    if (err) {
                        program.errorMessage('\t -> Error async \'%s\'', '' + err)
                    }
                    program.successMessage('--->>> Init successfully tag <<<---');
                    process.exit(1);
                });
        });
};
