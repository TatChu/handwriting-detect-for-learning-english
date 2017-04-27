const mongoose = require('mongoose');
const Product = mongoose.model('Product');
const Unit = mongoose.model('Unit');
const Category = mongoose.model('Category');
const productData = require('./../data/products.json');
const _ = require('lodash');
var async = require('asyncawait/async');
var await = require('asyncawait/await');

module.exports = function syncdbProducts(program) {
    'use strict';

    program
    .command('syncdbProducts')
    .description('Đồng bộ db product web cũ')
    .action(function (command) {
        program.successMessage('Start import db products cũ....');
        let tmp = [];

        let mapProduct = async(function () {
            try {
                let cates = await(Category.find({parrent_id: null}, '_id name').lean());
                console.log('test',cates);
                let units = await(Unit.find({}, '_id name').lean());
                console.log('test',units);
                // process.exit(1);

                /*++++++++++++++++ map Data++++++++++++++++*/
                for (let item in productData) {
                    if (productData.hasOwnProperty(item)) {
                        let itemTmp = {
                            old_id:             parseInt(productData[item].id),
                            name:               productData[item].name,
                            slug:               productData[item].slug,
                            qty_in_stock:       parseInt(0), /*parseInt(productData[item].qty),*/
                            view_unit:          String(parseInt(productData[item].weight)) + productData[item].unit,
                            status:             'HSV',/*((productData[item].qty == 0)?'HSV'
                            :((productData[item].qty <= 3 && productData[item].qty > 0)?'SHH':'CH')),*/
                            price:              parseInt(productData[item].price),
                            short_description:  productData[item].short_description,
                            detail_infor:  productData[item].description,
                            thumb:  productData[item].thumb,
                            images:  [],
                            videos:  [],
                            meta_description:  productData[item].meta_description,
                            meta_keywords:  productData[item].meta_keyword,
                            meta_title:  productData[item].meta_title,
                            createdAt:  productData[item].created_at,

                        }
                        /*Images*/
                        for (let key in productData[item].image) {
                            if ( productData[item].image.hasOwnProperty(key)) {
                                itemTmp.images.push({url : productData[item].image[key]});
                            }
                        }
                        /*Videos*/
                        for (let key in productData[item].videos) {
                            if ( productData[item].videos.hasOwnProperty(key)) {
                                itemTmp.videos.push({url : productData[item].videos[key]});
                            }
                        }
                        /*Category*/
                        for (let key in cates) {
                            if (cates.hasOwnProperty(key)) {
                                if(cates[key].name == 'Rau củ' && productData[item].category_name == 'Rau củ'){
                                    itemTmp.category = [mongoose.Types.ObjectId(cates[key]._id)];
                                }
                                if(cates[key].name == 'Trái cây' && productData[item].category_name == 'Trái cây'){
                                    itemTmp.category = [mongoose.Types.ObjectId(cates[key]._id)];
                                }
                                if(cates[key].name == 'Thực phẩm đóng gói' && productData[item].category_name == 'Thực phẩm đóng gói'){
                                    itemTmp.category = [mongoose.Types.ObjectId(cates[key]._id)];
                                }
                                if(cates[key].name == 'Thực phẩm tươi và đông lạnh' && productData[item].category_name == 'Thực phẩm đông lạnh'){
                                    itemTmp.category = [mongoose.Types.ObjectId(cates[key]._id)];
                                }
                                if(cates[key].name == 'Thực phẩm hữu cơ' && productData[item].category_name == 'Thực Phẩm Hữu Cơ'){
                                    itemTmp.category = [mongoose.Types.ObjectId(cates[key]._id)];
                                }
                            }
                        }
                        /*Unit*/
                        for (let key in units) {
                            if (units.hasOwnProperty(key)) {
                                if(productData[item].unit_stock)
                                    productData[item].unit_stock = productData[item].unit_stock.toLowerCase();
                                if(units[key].name == productData[item].unit_stock){
                                    itemTmp.id_unit = mongoose.Types.ObjectId(units[key]._id);
                                }
                            }
                        }

                        /*Kg*/
                        if(itemTmp.name == 'Chuối Sứ' || itemTmp.name == 'Quýt Đường'){
                            for (let key in units) {
                                if (units.hasOwnProperty(key)) {
                                    if(units[key].name == 'kg'){
                                        itemTmp.id_unit = mongoose.Types.ObjectId(units[key]._id);
                                    }
                                }
                            }
                        }
                        /*Khay*/
                        if(itemTmp.name == 'Giò Bò (VISSAN)'){
                            for (let key in units) {
                                if (units.hasOwnProperty(key)) {
                                    if(units[key].name == 'khay'){
                                        itemTmp.id_unit = mongoose.Types.ObjectId(units[key]._id);
                                    }
                                }
                            }
                        }
                        /*Khay*/
                        if(itemTmp.name.indexOf("Bánh Tét") >= 0){
                            for (let key in units) {
                                if (units.hasOwnProperty(key)) {
                                    if(units[key].name == 'cái'){
                                        itemTmp.id_unit = mongoose.Types.ObjectId(units[key]._id);
                                    }
                                }
                            }
                        }

                        if(itemTmp.id_unit == null){
                            console.log('test',itemTmp);
                            process.exit(1);
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
mapProduct().then(function (resp) {
    let createCount = 0;
    let updateCount  = 0;

    let createProducts = async(function () {
        try {
            tmp.forEach(function (item) {
                        // console.log(item);
                        /*Check product is exist and create*/
                        let product = await(Product.findOne({ old_id: item.old_id }));
                        if (!product) {
                            /*Chưa tồn tại Product cũ, tạo mới*/
                            let newProduct = new Product(item);
                            let createProduct = await(newProduct.save());
                            createCount += 1;
                            program.successMessage('Tạ̣o Product %s thành công', item.slug);
                        } else {
                            /* Tồn tại product cũ rồi thì update lại*/
                            if(product.thumb.split("/").length <= 1){
                                delete item.thumb;
                                delete item.images;
                            }
                            if(product.images && product.images.length > 0 && product.images[0]){
                                if(product.images[0].url.split("/").length <= 1)
                                    delete item.images;
                            }
                            product = _.extend(product, item);
                            let updateProduct = await(product.save());
                            updateCount += 1;
                            program.successMessage('Cập nhật Product %s thà̀nh công', item.slug);
                        }
                    });
        } catch (error) {
            program.errorMessage('Error', error);
        }
        return [];
    });
    createProducts().then(function (resp) {
        program.successMessage('Done với tạo %s cập nhật %s ....', createCount, updateCount);
        process.exit(1);
    });
})
});
};
