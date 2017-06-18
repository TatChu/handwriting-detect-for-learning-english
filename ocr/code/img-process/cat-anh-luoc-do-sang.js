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
    cropByGraphLight, // lược đồ sáng
}

function cropByGraphLight(imgDir, imgName, option) {
    return new Promise(function (resolve, reject) {
        Jimp.read(imgDir + imgName, function (err, imgJimp) {
            if (err) {
                return reject(err);
            }
            imgJimp.greyscale(function (err, imgGray) {
                // imgGray = imgGray.crop(10, 10, imgGray.bitmap.height - 20, imgGray.bitmap.width - 20);
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

                        // khu nhieu gaussian
                        // img.medianBlur(3);
                        // img.gaussianBlur([1, 5]);
                        // img.save(imgDir + '_0_' + imgName);

                        img.gaussianBlur([3, 3]);
                        // img.save(imgDir + '_1_' + imgName);


                        // khu nhieu
                        const lowThresh = option.lowThresh || 0; // càng lớn càng mất nét
                        const highThresh = option.highThresh || 50; // cang lon loc cang manh
                        img.canny(lowThresh, highThresh);
                        // img.save(imgDir + '_2_' + imgName);

                        // lam beo chu
                        const iterations = 1; // cang lon chu cang beo'
                        // img.dilate(iterations);
                        // img.erode(1); // xói mòn
                        // img.save(imgDir + '_3_' + imgName);
                        let imgSave = img.copy();
                        // img.save(imgDir + '_4_' + imgName);
                        let horizontal = [];    // lược đồ  theo chiều ngang
                        let vertical = [];      // theo chiều dọc

                        let matrix = [];
                        for (var h = 0; h < height; h++) {
                            let row = [];
                            let rowPoint = img.row(i);
                            for (var w = 0; w < rowPoint.length; w++) {
                                let p = img.get(h, w);
                                if (!isNaN(p) && p != 0) {
                                    row.push(1);
                                }
                                else {
                                    row.push(0);
                                }
                            }
                            matrix.push(row);
                        }
                        console.log('img: ', img);
                        console.log('=> mat: ', matrix.length, 'x', matrix[0].length);

                        for (var i = 0; i < height - 5; i++) {
                            // let row = img.row(i);
                            // let sum = 0;
                            // row.forEach(e => {
                            //     if (!isNaN(e) && e != 0) {
                            //         sum += 1;
                            //     }
                            // })

                            var sum = matrix[i].reduce((a, b) => a + b, 0)
                            horizontal.push(sum);
                            // console.log('ROW ', i, sum, row.join('-'))
                        }

                        for (var index = 0; index < matrix.length; index++) {
                            var row = matrix[index].join('');
                            console.log(row);
                        }

                        img.rotate(90);
                        for (var i = 0; i < width - 5; i++) {
                            let col = img.row(i);
                            let sum = 0;
                            col.forEach(e => {
                                if (!isNaN(e) && e != 0) {
                                    sum += 1;
                                }
                            })
                           
                            vertical.push(sum);
                        }


                        // TEST GRAPH LIGHT
                        // console.log('-----------------horizontal---------------')
                        horizontal.forEach((e, i) => {
                            let col = i + '\t:';
                            for (var i = 0; i < e; i++)
                                col += ':';
                            // console.log(col)
                        })

                        console.log('-----------------vertical---------------')
                        vertical.forEach((e, i) => {
                            let col = i + '\t:';
                            for (var j = 0; j < e; j++)
                                col += '>';
                            // console.log(col)
                        })

                        img.rotate(-90);
                        let line = findLine(horizontal, 0);
                        let letter = findLetter(vertical, 0);

                        console.log('line: ', line)
                        console.log('letter; ', letter)

                        let width_crop = letter.end - letter.start;
                        let height_crop = line.end - line.start;



                        let imgCrop = img.crop(letter.start, line.start, width_crop, height_crop);
                        // let imgCrop = imgSave.crop(106, 118, width_crop, height_crop);
                        console.log(imgCrop)
                        imgCrop.save(imgDir + '_5_' + imgName);

                        // img.rectangle([letter.start, line.start], [width_crop, height_crop], WHITE, 1);
                        img.line([0, line.start], [width, line.start], WHITE, 1)
                        img.line([0, line.end], [width, line.end], WHITE, 1)

                        img.line([letter.start, 0], [letter.start, height], WHITE, 1)
                        img.line([letter.end, 0], [letter.end, height], WHITE, 1)



                        img.save(imgDir + '_6_' + imgName);
                        return resolve({
                            dir: imgDir,
                            horizontal: horizontal,
                            vertical: vertical,
                        })
                    });
                });
            })
        })
    })
}

cropByGraphLight('test/', 'bigboss_2.jpg', {})

let nguong_pixel_nhieu = 3;
function findLine(array_row, startPoint) {
    // default value
    let p1 = startPoint || 0, p2 = array_row.length - 1;
    let found = false;
    for (var h = startPoint; h < array_row.length - 1; h++) {
        if (array_row[h] >= nguong_pixel_nhieu) {
            if (!found) {
                found = true;
                p1 = h;
            }
        }
    }
    found = false;
    for (var h = p1 + 1; h < array_row.length; h++) {
        if (array_row[h] <= nguong_pixel_nhieu) {
            if (!found) {
                found = true;
                p2 = h;
            }
        }
    }
    return { start: p1, end: p2 };
}


function findLetter(array_col, startPoint) {
    // default value
    let p1 = startPoint ? startPoint : 0, p2 = array_col.length - 1;
    let found = false;
    // Duyệt từ đầu => tìm điẻm lớn hơn bằng ngưỡng nhiễu đầu tiên
    for (var h = p1; h < array_col.length - 1; h++) {
        if (array_col[h] >= nguong_pixel_nhieu) {
            if (!found) {
                found = true;
                p1 = h;
            }
        }
    }
    if (!found) return null;
    // Duyệt từ điểm bắt đầu p1 => tìm điẻm nhỏ hơn bằng ngưỡng nhiễu đầu tiên
    found = false;
    for (var w = p1 + 1; w < array_col.length; w++) {
        if (array_col[w] <= nguong_pixel_nhieu) {
            if (!found) {
                found = true;
                p2 = w;
            }
        }
    }
    if (!found) return null;
    return { start: p1, end: p2 };
}