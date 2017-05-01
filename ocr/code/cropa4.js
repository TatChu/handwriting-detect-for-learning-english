var Jimp = require("jimp");
const nguong = 128;

Jimp.read("image/output/xu ly 1.JPG").then(function (image) {
    image.autocrop().resize(3000, 2000)            // resize
        .greyscale()                 // set greyscale
        .write("image/test/goc_xam_3x2.jpg", function (err, img) {
            let crop = function (i, j) {
                if (i > 14) {
                    return 0;
                } else {
                    img.clone(function (err, imgClone) {
                        var name = 'image/test/img-' + (i * 200) + '_' + (j * 200) + '.png';
                        imgClone.crop(i * 200 + 40, j * 200 + 40, 120, 120).autocrop().resize(84, 84).write(name, function () {
                            console.log(i, j, name);
                            if (j < 9) crop(i, j + 1)
                            else crop(i + 1, 0);
                        });
                    });
                }
            }
            crop(0, 0);
        });
}).catch(function (err) {
    console.error(2, err);
});
