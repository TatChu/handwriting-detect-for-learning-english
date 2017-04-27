const mongoose = require('mongoose');
const Unit = mongoose.model('Unit');
const unitsData = require('./../data/unit.json');
const async = require("async");

module.exports = function initUnit(program) {
    'use strict';

    program
        .command('initUnit')
        .description('Init data unit')
        .action(function (command) {
            program.successMessage('Preparing to import data to unit collection');
            async.each(unitsData, function (data, fnCallback) {
                let unit = new Unit(data);
                const promise = unit.save();
                promise.then(function (resp) {
                    program.successMessage('\t -> Created unit \'%s\'', resp.name);
                    fnCallback()
                }).catch(function (err) {
                    program.errorMessage('\t -> Error create unit \'%s\' : %s', data.name, '' + err.errmsg);
                    fnCallback();
                })
            },
                function done(err) {
                    if (err) {
                        program.errorMessage('\t -> Error async \'%s\'', '' + err)
                    }
                    program.successMessage('--->>> Init successfully unit <<<---');
                    process.exit(1);
                });
        });
};
