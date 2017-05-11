
const cv = require('opencv');
const fs = require('fs');
const Jimp = require('jimp');

const height = 15, width = 10;
const nguong = 128;
const whitePixel = Jimp.rgbaToInt(255, 255, 255, 255);
const blackPixel = Jimp.rgbaToInt(0, 0, 0, 255);

const Promise = require("bluebird");

module.exports = {
    PreProcess,
}

function PreProcess(imgDir, imgName, option) {
    return new Promise(function (resolve, reject) {
        Jimp.read(imgDir + imgName, function (err, imgJimp) {
            if (err) {
                return reject(err);
            }
            imgJimp.greyscale().write(imgDir + '_gr_' + imgName, function (err, imgGray) {
                imgGray.getBuffer(Jimp.AUTO, function (err, buff) {
                    if (err) {
                        return reject(err);
                    }
                    cv.readImage(buff, function (err, img) {
                        if (err) {
                            return reject(err);
                        }
                        const width = img.width();
                        const height = img.height();

                        if (width < 1 || height < 1) {
                            reject(new Error('Image has no size'));
                        }
                        // Chuyen trang den
                        // img = img.adaptiveThreshold(255, 0, 0, 15, 2);

                        // Chuyen ve anh xam
                        // img.convertGrayscale();

                        // lam mo
                        // img.medianBlur(1);

                        // khu nhieu gaussian
                        // img.gaussianBlur([1, 5]);
                        // img.gaussianBlur([3, 3]);


                        // khu nhieu
                        const lowThresh = 0 // option.lowThresh || 0; // càng lớn càng mất nét
                        const highThresh = 8 // option.highThresh || 100; // cang lon loc cang manh
                        img.canny(lowThresh, highThresh);
                        img.save(imgDir + '_1_' + imgName);


                        // img.erode(0); // xói mòn
                        // lam beo chu
                        const iterations = 1; // cang lon chu cang beo'
                        img.dilate(iterations);
                        // img.gaussianBlur([3, 3]);

                        //Save anh vao thu muc da qua xu ly
                        // if (!fs.existsSync(imgDir)) {
                        //     fs.mkdirSync(imgDir);
                        // }
                        let processedImg = 'processed_' + imgName;
                        img.save(imgDir + processedImg);
                        Jimp.read(imgDir + processedImg, function (err, imgProcessed) {
                            imgProcessed.autocrop().resize(10, 15).write(imgDir + '15_10_' + imgName);
                        })
                        return resolve({
                            name: processedImg
                        })
                    })
                })
            })
        })

    })
}

