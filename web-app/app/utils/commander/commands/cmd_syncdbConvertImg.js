const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const Promise = require("bluebird");
var sharp = require("sharp");

const mongoose = require('mongoose');
const Product = mongoose.model('Product');
// const ShippingFee = mongoose.model('ShippingFee');
// const customersData = require('./../data/customers.json');
const _ = require('lodash');
var async = require('asyncawait/async');
var await = require('asyncawait/await');

const mongodb = require('mongodb');
const config = require('./../../../../commander.json');

module.exports = function syncdbConvertImg(program) {
    'use strict';

    program
    .command('syncdbConvertImg')
    .description('Đồng bộ db product, comvert image thumb và media')
    .action(function (command) {

        program.successMessage('Start import db Customer cũ....');
        let tmp = [];
        let createCount = 0;
        let updateCount = 0;
        let updateCountMedia = 0;
        let errorExCount = 0;
        let errorExCountMedia = 0;

        let mapOrder = async(function () {
            try {
                /*get Products*/
                let products = await(Product.find());
                for (let key in products) {
                    if (products.hasOwnProperty(key)) {

                        /*Convert Hình Thumb*/
                        let arrImg = products[key].thumb.split("/");
                        if(arrImg.length > 1){
                            let {srcFile, destPathFile, width, height} = {
                                srcFile : process.cwd()+'/public/files/media_old/product'+products[key].thumb,
                                destPathFile: process.cwd() 
                                + '/public/files/thumb_image/product_image/'+'product_image_old_'+Date.now()+'_248x248.'+getFileExt(products[key].thumb),
                                width: 248,
                                height: 248
                            };
                            let image = await(resizeImage(srcFile, destPathFile, width, height));
                            if(image){
                                products[key].thumb = image.filename;
                                let saveProduct =  await(products[key].save());
                                updateCount += 1;
                            }else{
                                errorExCount += 1;
                            }
                        }
                        /*End Convert Hình Thumb*/

                        /*Convert Hình images*/
                        if(products[key].images && products[key].images.length >= 1){
                            for (let key1 in products[key].images) {
                                if (products[key].images.hasOwnProperty(key1)) {
                                    if(products[key].images[key1].url){
                                        let arrImgProduct = products[key].images[key1].url.split("/");
                                        /*Convert image*/
                                        if(arrImgProduct.length > 1){
                                            let {srcFile, destPathFile, width, height} = {
                                                srcFile : process.cwd()+'/public/files/media_old/product'+products[key].images[key1].url,
                                                destPathFile: process.cwd() 
                                                + '/public/files/product_image/'+'product_image_old_'+Date.now()+'.'+getFileExt(products[key].images[key1].url),
                                                width: 500,
                                                height: 500
                                            };
                                            let image = await(resizeImage(srcFile, destPathFile, width, height));
                                            if(image){
                                                products[key].images[key1].url = image.filename;
                                                updateCountMedia += 1;
                                            }else{
                                                errorExCountMedia += 1;
                                            }
                                        }
                                    }
                                }
                            }
                            let saveProduct =  await(products[key].save());

                        }
                        /*End Convert Hình images*/
                    }
                }

            } catch (error) {
                program.errorMessage('Error', error);
            }
            return [];
        });
        mapOrder().then(function (resp) {

            let createProducts = async(function () {

                try {

                } catch (error) {
                    program.errorMessage('Error', error);
                }
                return [];
            });
            createProducts().then(function (resp) {
                program.successMessage('Done convert thumb với tạo %s cập nhật %s lỗi %s ....', createCount, updateCount, errorExCount);
                program.successMessage('Done convert media với tạo %s cập nhật %s lỗi %s ....', createCount, updateCountMedia, errorExCountMedia);
                process.exit(1);
            });
        })
    });
};

function resizeImage (srcFile, destPathFile, width, height ){
    return new Promise(function (resolve, reject) {
        if (!fs.existsSync(process.cwd() + '/public/files/thumb_image/'))
            fs.mkdirSync(process.cwd() + '/public/files/thumb_image/');
        if (!fs.existsSync(process.cwd() + '/public/files/thumb_image/product_image/'))
            fs.mkdirSync(process.cwd() + '/public/files/thumb_image/product_image/');
        if (!fs.existsSync(process.cwd() + '/public/files/product_image/'))
            fs.mkdirSync(process.cwd() + '/public/files/product_image/');

        sharp(srcFile).resize(width, height).toFile(destPathFile, function (err, info) {
            if (err) return reject(err);
            let nameFile = destPathFile.split('/');
            let res = {
                success: true,
                filename: nameFile.pop(),
                info,
            };

            return resolve(res);
        })
    });
}

//get file extension
function getFileExt(fileName) {
    var fileExt = fileName.split(".");
    if (fileExt.length === 1 || (fileExt[0] === "" && fileExt.length === 2)) {
        return "";
    }
    return fileExt.pop();
};
