const mongoose = require('mongoose');
var async = require('asyncawait/async');
var await = require('asyncawait/await');

const Shippingfee = mongoose.model('ShippingFee');
const shippingfeeData = require('./../data/shippingfee.json');
module.exports = function initShippingfee(program) {
    'use strict';

    program
        .command('initShippingfee')
        .description('Tạo dữ liệu ban đầu cho shippingfee')
        .action(function (command) {
            program.successMessage('Start task init shippingfee');
            let createShippingfee = async(function () {
                try {
                    shippingfeeData.shippingfee.forEach(function (item) {
                        // Check shippingfee is exist and create
                        let shippingfee = await(Shippingfee.findOne({ district: item.district }));
                        if (!shippingfee) {
                            let newShippingfee = new Shippingfee(item);
                            let createShippingfee = await(newShippingfee.save());
                            program.successMessage('Tạo shippingfee %s thành công', item.district);
                        }
                    });
                } catch (error) {
                    program.errorMessage('Error', error);
                }
                return [];
            });

            createShippingfee().then(function (resp) {
                program.successMessage('End task init shippingfee');
                process.exit(1);
            });
        });

};
