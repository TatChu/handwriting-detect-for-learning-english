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
const height_crop = 15, width_crop = 10;

module.exports = {
    cropByContour,
    analysisImage,
    convertToBW
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
                        let imgRectContour = img.copy();

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
                        imgRectContour.rectangle([bound.x, bound.y], [bound.width, bound.height], WHITE, 1);
                        let imgNew = '_new_' + imgName;
                        imgRectContour.save(imgDir + imgNew);

                        // img.save(imgDir + bwImg);
                        let imgCropName = '_croped_' + imgName;
                        imgSCrop.save(imgDir + imgCropName);
                        return resolve({
                            dir: imgDir,
                            name: imgCropName,
                            newImage: imgNew,
                            contours: contours.size()
                        })
                        // let imgResize = imgSCrop.resize(10, 15);
                        // imgResize.save(imgDir + '_resize_' + imgName);

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

function analysisImage(imgDir, imgName, data) {
    return new Promise(function (resolve, reject) {
        Jimp.read(imgDir + imgName, function (err, imgJimp) {
            if (err) {
                return reject(err);
            }
            imgJimp.getBuffer(Jimp.AUTO, function (err, buff) {
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
                    // Chuyen ve anh xam
                    // img.convertGrayscale();

                    // img.save(imgDir + '1_' + imgName);
                    let imageDetectContour = img.copy();
                    // lọc nhiễu
                    // img.medianBlur(1);

                    // img.gaussianBlur([1, 5]);
                    img.gaussianBlur([3, 3]);
                    // img.save(imgDir + '2_' + imgName);


                    //  Xac dinh duong net
                    const lowThresh = data.lowThresh || 0; // càng lớn càng mất nét
                    const highThresh = data.highThresh || 50; // cang lon loc cang manh
                    img.canny(lowThresh, highThresh);
                    // img.save(imgDir + '3_' + imgName);

                    // lam beo chu
                    const iterations = 1; // cang lon chu cang beo'
                    img.dilate(iterations);
                    img.erode(1); // xói mòn
                    // img.save(imgDir + '4_' + imgName);
                    let imgSave = img.copy();

                    let contours = img.findContours();

                    let listAllBound = [];
                    let listBoundAccept = []; // Các contour chấp nhận
                    let listBoundDelete = []; // Các contour bị loại bỏ (bị trùng)

                    for (let i = 0; i < contours.size(); i++) {
                        let bound = contours.boundingRect(i);

                        if (bound.width > 10 && bound.height > 10) {
                            listAllBound.push(bound);
                        }
                    }

                    let checkIsDeleteBound = function (bound, id) {
                        // bị loại nếu tồn tại cặp toạ độ bound.x > x' && bound.y > y' && bound.width < width', bound.height < height'
                        let isDelete = null, index;
                        listAllBound.forEach((item, i) => {
                            if (bound.x >= item.x && bound.y >= item.y &&
                                (bound.x + bound.width) <= (item.x + item.width)
                                && (bound.y + bound.height) < (item.y + item.height) && id != i) {
                                isDelete = item;
                                index = i;
                            }
                        });
                        return isDelete;
                    }

                    listAllBound.forEach(function (item, index) {
                        if (checkIsDeleteBound(item) != null) {
                            listBoundDelete.push(item)
                        }
                    })

                    // listBoundDelete.forEach(function (item) {
                    //     imgSave.rectangle([item.x, item.y], [item.width, item.height], BLACK, 1);
                    // })

                    listBoundAccept = listAllBound.map(item => {

                        let isExitInListDelete = listBoundDelete.find(itemDelete => {
                            return (item.x == itemDelete.x && item.y == itemDelete.y && item.width == itemDelete.width && item.height == itemDelete.height)
                        });
                        if (isExitInListDelete) {
                            return null;
                        }
                        else {
                            return item;
                        }
                    })

                    // CROP IMAGE
                    if (!fs.existsSync(data.dirDist)) {
                        fs.mkdirSync(data.dirDist)
                    }
                    let listImageCroped = [];
                    listBoundAccept.forEach(function (item, index) {
                        if (item) {

                            var imgCrop = imgSave.crop(item.x, item.y, item.width, item.height);

                            imgCrop.resize(width_crop, height_crop);
                            let newName = imgName + '_' + index + '.jpg';
                            var path_save = data.dirDist + newName;

                            imgCrop.save(path_save);
                            listImageCroped.push({
                                image: newName,
                                detail: item
                            });
                            imageDetectContour.rectangle([item.x, item.y], [item.width, item.height], GREEN, 1);
                        }
                    })
                    let nameImageCountour = 'contour_' + imgName;
                    console.log('BEFORE:')
                    imageDetectContour.save(imgDir + nameImageCountour);

                    // // Sắp xếp thứ tự kết quả theo toạ độ x
                    // listImageCroped.forEach((item1, i1) => {
                    //     listImageCroped.forEach((item2, i2) => {
                    //         if (item2.detail.x < item1.detail.x) {
                    //             listImageCroped.unshift(item2);
                    //             listImageCroped.splice(i2 + 1, 1);
                    //         }
                    //     })
                    // })

                    return resolve({
                        listImage: listImageCroped,
                        imageDetect: nameImageCountour
                    })
                });
            });
        })
    })
}

function convertToBW(imgDir, imgName, option) {
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
                        const lowThresh = option.lowThresh || 0; // càng lớn càng mất nét
                        const highThresh = option.highThresh || 10; // cang lon loc cang manh
                        img.canny(lowThresh, highThresh);
                        // img.save(imgDir + '_1_' + imgName);


                        // img.erode(0); // xói mòn
                        // lam beo chu
                        const iterations = 1; // cang lon chu cang beo'
                        img.dilate(iterations);
                        // img.gaussianBlur([3, 3]);

                        //Save anh vao thu muc da qua xu ly
                        // if (!fs.existsSync(imgDir)) {
                        //     fs.mkdirSync(imgDir);
                        // }
                        let processedImg = '_BW_' + imgName;
                        img.save(imgDir + processedImg);
                        Jimp.read(imgDir + processedImg, function (err, imgProcessed) {
                            imgProcessed.autocrop().resize(10, 15).write(imgDir + 'processed_' + imgName);

                            fs.unlink(imgDir + processedImg);
                            fs.unlink(imgDir + '_gr_' + imgName);

                            return resolve({
                                name: 'processed_' + imgName
                            })
                        })

                    })
                })
            })
        })

    })
}
