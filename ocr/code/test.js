const cv = require('opencv');

cv.readImage('image/bang chu cai/a.jpg', function (err, im) {
    if (err) reject(err);

    im = im.copy();

    // store the dimensions in variables for later processing
    var width = im.width();
    var height = im.height();

    if (width < 1 || height < 1) throw new Error('Image has no size');

    // set the width of the image to 1000 pixels
    nw = 1000;

    // maintain pixel ratio of image 
    nh = (height / width) * nw;

    // resize image to create standard variables for sizes of 
    // colonies to detect later
    im.resize(3000, 2000);

    // copy resized image and store it in a variableto later draw  
    // circles around colonies for visualization
    var copied = im.copy();
    copied.save('1.jpg');

    // apply gaussian blur
    im.gaussianBlur([1, 5]);
    im.save('2.jpg');


    // XAC DINH BIEN
    // khu nhieu
    const lowThresh = 20; // càng lớn càng mất nét
    const highThresh = 120; // cang lon loc cang manh
    im.canny(lowThresh, highThresh);
    im.save('3.jpg');

    // apply canny filter
    im.canny(50, 125);
    im.save('4.jpg');

    const iterations = 1; // cang lon chu cang beo'
    im.dilate(iterations);

    im.save('5.jpg');


    var contours = im.findContours();
    console.log('contours: ', contours);
    var colonyCount = 0;

    // only draw and count found contours within range of deinfed length
    for (i = 0; i < contours.size(); i++) {
        if (contours.arcLength(i, true) < 100) {
            // draw contours for each found contour and color green
            im.drawContour(contours, i, [255, 0, 255], 3);
            colonyCount += 1;
        }
    }
    console.log('DONE: ', colonyCount)

    copied.save('6.jpg');

});