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
    cropByContour,
}

function cropByContour(imgDir, imgName, option) {
    return new Promise(function (resolve, reject) {
        Jimp.read(imgDir + imgName, function (err, imgJimp) {
            if (err) {
                return reject(err);
            }
            imgJimp.greyscale(function (err, imgGray) {
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
                        img.gaussianBlur([3, 3]);
                        // img.save(imgDir + '__gr_' + imgName);


                        // khu nhieu
                        const lowThresh = option.lowThresh || 0; // càng lớn càng mất nét
                        const highThresh = option.highThresh || 50; // cang lon loc cang manh
                        img.canny(lowThresh, highThresh);
                        // img.save(imgDir + '_loc_' + imgName);

                        // lam beo chu
                        const iterations = 1; // cang lon chu cang beo'
                        img.dilate(iterations);
                        img.erode(1); // xói mòn
                        let imgSave = img.copy();
                        // img.save(imgDir + '_lam_manh_lam_day' + imgName);


                        let contours = img.findContours();

                        let largestContourImg;
                        let largestArea = 0;
                        let largestAreaIndex;

                        for (let i = 0; i < contours.size(); i++) {
                            // console.log(i, contours.area(i))
                            if (contours.area(i) > largestArea) {
                                largestArea = contours.area(i);
                                largestAreaIndex = i;
                            }
                        }
                        // img.save(imgDir + '_tim_bien_' + imgName);

                        let bound = contours.boundingRect(largestAreaIndex);
                        // img.rectangle([bound.x, bound.y], [bound.width, bound.height], WHITE, 1);
                        // img.save(imgDir + '_rectangle_' + imgName);
                        let imgSCrop = imgSave.crop(bound.x, bound.y, bound.width, bound.height);
                        // img.save(imgDir + bwImg);
                        let imgCropName = '_croped_' + imgName;
                        imgSCrop.save(imgDir + imgCropName);
                        return resolve({
                            dir: imgDir,
                            name: imgCropName,
                            contours: contours.size()
                        })
                        // let imgResize = imgSCrop.resize(10, 15);
                        // imgResize.save(imgDir + '_resize_' + imgName);

                        // imgSave.save(imgDir + '2_' + imgName);
                        // img.drawContour(contours, largestAreaIndex, GREEN);
                        // allContoursImg.save(imgDir + "1_" + imgName);
                        // console.log(1111, contours.size())
                        // img.drawAllContours(contours, WHITE);
                        // img.save(imgDir + 'contours_' + imgName);
                    });
                });
            })
        })
    })
}