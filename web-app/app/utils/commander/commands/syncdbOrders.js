const mongoose = require('mongoose');
const Order = mongoose.model('Order');
const ShippingFee = mongoose.model('ShippingFee');
const User = mongoose.model('User');
const Product = mongoose.model('Product');
const ordersData = require('./../data/orders.json');
const _ = require('lodash');
var async = require('asyncawait/async');
var await = require('asyncawait/await');

module.exports = function syncdbOrders(program) {
    'use strict';

    program
    .command('syncdbOrders')
    .description('Đồng bộ db Order web cũ')
    .action(function (command) {
        program.successMessage('Start import db Order cũ....');
        let tmp = [];

        let mapOrder = async(function () {
            try {

                /*get Ship*/
                let shipFee = await(ShippingFee.find({},'_id district fee'));
                // console.log('shipFee',shipFee);
                // process.exit(1);

                for (let item in ordersData) {

                    if (ordersData.hasOwnProperty(item)) {
                        let itemTmp = {
                            old_id:             parseInt(ordersData[item].id),
                            old_increment_id:             parseInt(ordersData[item].increment_id),
                            createdAt:             ordersData[item].created_at,
                            payment_method:     (ordersData[item].payment_method == 'cashondelivery') ? 'COD' : 'CK',
                            note:               ordersData[item].customer_note,
                            total:              ordersData[item].total,
                            total_pay:          
                            Math.abs(parseFloat(ordersData[item].total) || 0)+
                            Math.abs(parseFloat(ordersData[item].base_shipping_amount) || 0)-
                            Math.abs(parseFloat(ordersData[item].base_discount_amount) || 0),
                        }
                        /*STATUS*/
                        if(ordersData[item].status == 'canceled'){
                            itemTmp.status = 'CANCEL';
                        } else if(ordersData[item].status == 'complete'){
                            itemTmp.status = 'FINISH';
                        } else{
                            itemTmp.status = 'PROCCESS';
                        }
                        /*SHIPPING*/
                        for (let key in shipFee) {
                            if (shipFee.hasOwnProperty(key)) {
                                if(shipFee[key].district == ordersData[item].district){
                                    itemTmp.id_shipping_fee = mongoose.Types.ObjectId(shipFee[key]._id);
                                }
                            }
                        }
                        /*COUPON*/
                        if(ordersData[item].coupon_code != null){
                            itemTmp.coupon =  {
                                code: ordersData[item].coupon_code,
                                value: Math.abs(ordersData[item].base_discount_amount),
                                type: 'MN'
                            }
                        }
                        /*PAYMENT INFO*/
                        itemTmp.payment_info = {info:{}};
                        itemTmp.payment_info.info.full_name = ordersData[item].customer_firstname+ordersData[item].customer_lastname;
                        itemTmp.payment_info.info.email =  ordersData[item].customer_email;
                        itemTmp.payment_info.info.phone =  ordersData[item].phone.replace(/\./g,'');
                        itemTmp.payment_info.info.district =  ordersData[item].district;
                        itemTmp.payment_info.info.address =  ordersData[item].address;
                        itemTmp.payment_info.info.shipping_fee =  ordersData[item].base_shipping_amount
                        if(ordersData[item].customer_id != null){
                            let user = await(User.findOne({ old_id: parseInt(ordersData[item].customer_id) }).lean());
                            if(user){
                                itemTmp.payment_info.info.user_id = mongoose.Types.ObjectId(user._id);
                            }
                        }
                        

                        /*ITEM*/
                        itemTmp.order_detail = [];
                        for (let key in ordersData[item].items) {
                            if (ordersData[item].items.hasOwnProperty(key)) {
                                let tmpItem = {};
                                let product = await(Product.findOne({ old_id: parseInt(ordersData[item].items[key].product_id)}).lean());
                                if(product){
                                    tmpItem.product = mongoose.Types.ObjectId(product._id);
                                }
                                tmpItem.order_quantity = ordersData[item].items[key].qty;
                                tmpItem.price = parseInt(ordersData[item].items[key].price);
                                tmpItem.total = parseInt(ordersData[item].items[key].total);
                                // tmpItem.id_promote = {
                                //     name: 'order cũ',
                                //     value: parseInt(ordersData[item].items[key].promote),
                                //     type: 'MN'
                                // };

                                itemTmp.order_detail.push(tmpItem);
                            }
                        }

                        tmp.push(itemTmp);
                    }
                }


            } catch (error) {
                program.errorMessage('Error', error);
            }
            return [];
        });
mapOrder().then(function (resp) {
    let createCount = 0;
    let updateCount  = 0;

    program.successMessage('Bắt đầu lưu DB');
    let createOrders = async(function () {
        try {
            tmp.forEach(function (item) {
            //     /*Check order is exist and create*/
            let order = await(Order.findOne({ old_id: parseInt(item.old_id)}));

            if(!order){
                let newOrder = new Order(item);
                let createOrder = await(newOrder.save());
                createCount += 1;
                    // program.successMessage('Tạ̣o Order %s thành công', item.email);

                }else{

                    /* Tồn tại Order cũ rồi thì update lại*/
                    order = _.extend(order, item);
                    let updateOrder = await(order.save());
                    updateCount += 1;
                }


            });
        } catch (error) {
            program.errorMessage('Error', error);
        }
        return [];
    });
    createOrders().then(function (resp) {
        program.successMessage('Done với tạo %s cập nhật %s lỗi tồn tại Order %s....', createCount, updateCount);
        process.exit(1);
    }).catch(function(err){
        program.successMessage('Error %s', err);
        process.exit(1);
    });
});

})};
