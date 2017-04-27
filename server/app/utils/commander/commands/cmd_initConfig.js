const mongoose = require('mongoose');
var async = require('asyncawait/async');
var await = require('asyncawait/await');

const Config = mongoose.model('Config');
const configData = require('./../data/config.json');

module.exports = function initConfig(program) {
    'use strict';

    program
        .command('initConfig')
        .description('Tạo dữ liệu ban đầu cho config')
        .action(function (command) {
            program.successMessage('Start task init config');
            let createConfig = async(function () {
                try {
                    configData.config.forEach(function (item) {
                        // Check config is exist and create
                        let config = await(Config.findOne({ name: item.name }));
                        if (!config) {
                            let newConfig = new Config(item);
                            let createConfig = await(newConfig.save());
                            program.successMessage('Tạo config %s thành công', item.name);
                        }
                    });
                } catch (error) {
                    program.errorMessage('Error', error);
                }
                return [];
            });

            createConfig().then(function (resp) {
                program.successMessage('End task init config');
                process.exit(1);
            });
        });

};
