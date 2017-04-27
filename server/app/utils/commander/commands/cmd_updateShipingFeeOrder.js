const mongoose = require('mongoose');
const Order = mongoose.model('Order');
const ShippingFee = mongoose.model('ShippingFee');

const async = require("async");

module.exports = function updateShippingFeeOrder(program) {
    'use strict';

    program
        .command('updateShippingFeeOrder')
        .description('Update shipping fee for order')
        .action(function (command) {
            program.successMessage('STEP1: Geting all shiping fee address');

            let promiseShippingFee = ShippingFee.find({}).exec();

            promiseShippingFee.then(function (listShippingFee) {
                program.successMessage('\tGet success ' + listShippingFee.length + ' shipping fee address');
                program.successMessage('STEP2: Each shipping adress get all order by feild  id_shipping_fee');

                async.each(listShippingFee, function (shippingFee, fnCallback) {

                    let promiseListOrder = Order.find({ id_shipping_fee: shippingFee._id }).populate('id_shipping_fee').exec();


                    promiseListOrder.then(function (listOrder) {
                        program.successMessage('\tGet success ' + listOrder.length + ' order by district: ' + shippingFee.district);
                        if (listOrder.length > 0) {
                            program.successMessage('Each order execute update shipping fee');
                            async.each(listOrder, function (order, callback) {
                                //update order
                                // tổng tiền mới = tổng tiền cũ - phí ship cũ + phí ship mới
                                order.total_pay = order.total_pay - order.payment_info.info.shipping_fee + order.id_shipping_fee.fee;
                                // gắn lại tiền ship
                                order.payment_info.info.shipping_fee = order.id_shipping_fee.fee;
                                let promise = order.save();
                                promise.then(function (resp) {
                                    program.successMessage('\t   * Updated order: ' + resp.id_order);
                                    callback()
                                }).catch(function (err) {
                                    program.errorMessage('\t -> Error update: ' + order.id_order);
                                    callback();
                                })
                            },
                                function done(err) {
                                    program.successMessage('\t-> Updated ' + listOrder.length + ' order');
                                    fnCallback();
                                });
                        }
                        else {
                            program.successMessage('\t -> Skiped for district: ' + shippingFee.district);
                            fnCallback();
                        }

                    }).catch(function (err) {
                        program.errorMessage('\t   -> Error get order by district: ' + shippingFee.district);
                        fnCallback();
                    })
                },
                    function done(err) {
                        program.successMessage('\n\nUPDATE SHIPPING FEE FOR ORDER SUCCESS');
                        program.successMessage('EXITING...');
                        process.exit(1);
                    });
            }).catch(function (err) {
                program.errorMessage('\n\nERROR GET SHIPPING ADDRESS: ' + err)
                program.successMessage('EXITING...');
                process.exit(1);
            });
        });
};
