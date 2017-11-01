const cv = require('opencv');
const fs = require('fs');
const Jimp = require('jimp');

const height_crop = 40, width_crop = 40;
const nguong = 210;
const whitePixel = Jimp.rgbaToInt(255, 255, 255, 255);
const blackPixel = Jimp.rgbaToInt(0, 0, 0, 255);
const WHITE = [255, 255, 255];
const GREEN = [0, 255, 0];
const BLACK = [0, 0, 0];
const thickness = 1;

require('async-arrays').proto();
const arrayChart = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'l', 'k', 'm', 'n', 'o',
    'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

module.exports = {
    PreProcess,
}


function PreProcess(imgDir, imgName, data) {
    return new Promise(function (resolve, reject) {
        Jimp.read(imgDir + imgName, function (err, imgJimp) {
            if (err) {
                return reject(err);
            }
            imgJimp.resize(3000, 2000).getBuffer(Jimp.AUTO, function (err, buff) {
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
                    img.convertGrayscale();

                    // img.save(imgDir + '1_' + imgName);

                    // lọc nhiễu
                    // img.medianBlur(1);

                    // img.gaussianBlur([1, 5]);
                    img.gaussianBlur([3, 3]);
                    // img.save(imgDir + '2_' + imgName);
                    let imgSave = img.copy();

                    //  Xac dinh duong net
                    const lowThresh = data.lowThresh || 0; // càng lớn càng mất nét
                    const highThresh = data.highThresh || 100; // cang lon loc cang manh
                    img.canny(lowThresh, highThresh);
                    // img.save(imgDir + '/3_' + imgName);

                    // lam beo chu
                    const iterations = 2; // cang lon chu cang beo'
                    img.dilate(iterations);
                    img.erode(1); // xói mòn
                    // img.save(imgDir + '4_' + imgName);

                    let contours = img.findContours();

                    let listAllBound = [];
                    let listBoundAccept = []; // Các contour chấp nhận
                    let listBoundDelete = []; // Các contour bị loại bỏ (bị trùng)

                    for (let i = 0; i < contours.size(); i++) {
                        let bound = contours.boundingRect(i);

                        if (bound.width > 7 && bound.height > 7 && bound.width < 180 && bound.height < 180) {
                            listAllBound.push(bound);
                        }
                    }

                    let checkIsDeleteBound = function (bound) {
                        // bị loại nếu tồn tại cặp toạ độ bound.x > x' && bound.y > y' && bound.width < width', bound.height < height'
                        let isDelete = null, index;
                        listAllBound.forEach((item, i) => {
                            if (bound.x > item.x && bound.y > item.y &&
                                (bound.x + bound.width) < (item.x + item.width)
                                && (bound.y + bound.height) < (item.y + item.height)) {
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
                    var dx = 10; dy_top = 25; dy_bottom = 25;

                    listBoundAccept.forEach(function (item, index) {
                        if (item && item.width > 5 && item.height > 15 && (item.x + item.width + dx) < 3000 && (item.y - dy_top) > 0 && (item.y + item.height + dy_top + dy_bottom) < 2000) {
                            var imgCrop = imgSave.crop(item.x, item.y - dy_top, item.width + dx, item.height + dy_top + dy_bottom);
                            // imgSave.rectangle([item.x, item.y - dy_top], [item.width + dx, item.height + dy_top + dy_bottom], GREEN, 1);

                            let newName = imgName + '_' + index + '.jpg';
                            var path_save = data.dirDist + '/' + newName;

                            Jimp.read(imgCrop.toBuffer(), function (err, image) {
                                this.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {

                                    var red = this.bitmap.data[idx + 0];
                                    var green = this.bitmap.data[idx + 1];
                                    var blue = this.bitmap.data[idx + 2];
                                    var alpha = this.bitmap.data[idx + 3];
                                    let tbc = (red + green + blue) / 3;
                                    // chuyen trang den
                                    if (tbc < nguong) {
                                        image.setPixelColor(blackPixel, x, y);
                                    }
                                    else {
                                        image.setPixelColor(whitePixel, x, y);
                                    }
                                })
                                .autocrop()
                                .resize(width_crop, height_crop)
                                .write(path_save)
                            })
                        }
                    })
                    // Lưu để xem biên
                    let nameImageCountour = 'contour_' + imgName;
                    imgSave.save(imgDir + nameImageCountour);

                    return resolve({
                        listImage: listImageCroped,
                        imageDetect: nameImageCountour
                    })
                });
            });
        })
    })
}
// PreProcess('test/', 'vietnamese.jpg', {
//     dirDist: 'test/'
// }).then(res => {
//     console.log(res.listImage)
// })

//Xử lý tất cả
// arrayChart.forEachEmission((character, index, done) => {
//     PreProcess('image/bang chu cai/', character + '.jpg', {
//         dirDist: 'image/output/' + character
//     }).then(function (res) {
//         console.log('Done: ' + character)
//         done();
//     })
// }, function () {
//     console.log('DONE');
// })

// Xử lý 1 ảnh
let character = 'ij';
PreProcess('image/', character + '.jpg', {
    dirDist: 'image/output/' + character
}).then(function (res) {
    console.log('Done: ' + character)
})