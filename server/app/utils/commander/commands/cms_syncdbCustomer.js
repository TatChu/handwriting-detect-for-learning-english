const mongoose = require('mongoose');
const User = mongoose.model('User');
const ShippingFee = mongoose.model('ShippingFee');
const customersData = require('./../data/customers.json');
const _ = require('lodash');
var async = require('asyncawait/async');
var await = require('asyncawait/await');

const mongodb = require('mongodb');
const config = require('./../../../../commander.json');
const Acl = require('acl');

module.exports = function syncdbCustomer(program) {
    'use strict';

    program
    .command('syncdbCustomer')
    .description('Đồng bộ db product web cũ')
    .action(function (command) {

        mongodb.connect(config.web.db.uri, function (error, db) {
            let acl = new Acl(new Acl.mongodbBackend(db, 'mhv_acl_'));

            program.successMessage('Start import db Customer cũ....');
            let tmp = [];

            let mapOrder = async(function () {
                try {
                    /*get Ship*/
                    let shipFee = await(ShippingFee.find({},'_id district fee'));

                    /*++++++++++++++++ map Data++++++++++++++++*/
                    for (let item in customersData) {
                        if (customersData.hasOwnProperty(item)) {
                            let itemTmp = {
                                old_id:             parseInt(customersData[item].id),
                                name:               customersData[item].firstname+' '+customersData[item].lastname,
                                email:              customersData[item].email,
                                password:           customersData[item].password,
                                createdAt:           customersData[item].created_at,
                            }
                            if(customersData[item].shipping_address != false){
                                itemTmp.phone = customersData[item].shipping_address.phone.replace(/\./g,''),
                                itemTmp.customer = {};
                                itemTmp.customer.shipping_address = [];
                                let tmpShip = {
                                    name: customersData[item].shipping_address.firstname +' '+ customersData[item].shipping_address.lastname,
                                    phone: customersData[item].shipping_address.phone.replace(/\./g,''),
                                    address_detail: customersData[item].shipping_address.street,
                                }
                                /*SHIPPING*/
                                for (let key in shipFee) {
                                    if (shipFee.hasOwnProperty(key)) {
                                        if(shipFee[key].district == customersData[item].shipping_address.city){
                                            tmpShip.id_shipping_fee = mongoose.Types.ObjectId(shipFee[key]._id);
                                        }
                                    }
                                }
                                itemTmp.customer.shipping_address.push(tmpShip);
                            }

                            tmp.push(itemTmp);
                        }
                    }
                    /*++++++++++++++++End map Data++++++++++++++++*/

                } catch (error) {
                    program.errorMessage('Error', error);
                }
                return [];
            });
            mapOrder().then(function (resp) {
                let errorExCount = 0;
                let createCount = 0;
                let updateCount  = 0;
                let createProducts = async(function () {
                    try {
                        tmp.forEach(function (item) {
                            /*Check user is exist and create*/
                            let userEmail = await(User.findOne({ email: item.email}));

                            if(!userEmail){

                                if(item.phone!=null){
                                    let userPhone = await(User.findOne({ phone: item.phone}));
                                    if(userPhone)
                                        delete item.phone;
                                }

                                let newUser = new User(item);
                                let createUser = await(newUser.save());
                                if(createUser){
                                    let createAcl = await(acl.addUserRoles(String(createUser._id), 'customer'));
                                }
                                createCount += 1;
                                program.successMessage('Tạ̣o User %s thành công', item.email);

                            }else{
                                let updateAcl = await(acl.addUserRoles(String(userEmail._id), 'customer'));

                                if(item.phone!=null){
                                    /*Nếu phone dúng với user  thì update*/
                                    let userPhone = await(User.findOne({email: item.email , phone: item.phone}));
                                    if(userPhone){
                                        /* Tồn tại user cũ rồi thì update lại*/
                                        userPhone = _.extend(userPhone, item);
                                        let updateUser = await(userPhone.save());

                                        updateCount += 1;
                                        program.successMessage('Cập nhật UserPhone %s thà̀nh công', item.email);
                                    }else{
                                        /* Tồn tại user cũ rồi thì update lại*/
                                        delete item.phone;
                                        userEmail = _.extend(userEmail, item);
                                        let updateUser = await(userEmail.save());
                                        updateCount += 1;
                                        program.successMessage('Cập nhật UserNotPhone %s thà̀nh công', item.email);
                                    }
                                }else{
                                    /* Tồn tại user cũ rồi thì update lại*/
                                    userEmail = _.extend(userEmail, item);
                                    let updateUser = await(userEmail.save());
                                    updateCount += 1;
                                    program.successMessage('Cập nhật UserEmail %s thà̀nh công', item.email);
                                }
                            }


                        });
                    } catch (error) {
                        program.errorMessage('Error', error);
                    }
                    return [];
                });
                createProducts().then(function (resp) {
                    program.successMessage('Done với tạo %s cập nhật %s lỗi tồn tại user %s....', createCount, updateCount, errorExCount);
                    process.exit(1);
                });
            })
        });
});
};
