const cv = require('opencv');
const fs = require('fs');
const Jimp = require('jimp');

const height = 15, width = 10;
const nguong = 128;
const whitePixel = Jimp.rgbaToInt(255, 255, 255, 255);
const blackPixel = Jimp.rgbaToInt(0, 0, 0, 255);
const WHITE = [255, 255, 255];
const GREEN = [0, 255, 0];
const thickness = 1;
const Promise = require("bluebird");


module.exports = {
    binarization, // lược đồ sáng
}

function binarization(imgDir, imgName, threshold) {
    return new Promise(function (resolve, reject) {
        Jimp.read(imgDir + imgName, function (err, imgJimp) {
            if (err) {
                return reject(err);
            }
            //    imgJimp.greyscale()
            imgJimp.brightness(0.25).scan(0, 0, imgJimp.bitmap.width, imgJimp.bitmap.height, function (x, y, idx) {

                var red = this.bitmap.data[idx + 0];
                var green = this.bitmap.data[idx + 1];
                var blue = this.bitmap.data[idx + 2];
                var alpha = this.bitmap.data[idx + 3];

                if (red <= threshold || green <= threshold || blue <= threshold) {
                    this.bitmap.data[idx] = 0;
                    this.bitmap.data[idx + 1] = 0;
                    this.bitmap.data[idx + 2] = 0;
                }
                else {
                    this.bitmap.data[idx] = 255;
                    this.bitmap.data[idx + 1] = 255;
                    this.bitmap.data[idx + 2] = 255;
                }
                // rgba values run from 0 - 255
                // e.g. this.bitmap.data[idx] = 0; // removes red from this pixel
            }).autocrop().write(imgDir + '_0_' + imgName);;
        })
    })
}

binarization('test/', 'mother.jpg', 100);