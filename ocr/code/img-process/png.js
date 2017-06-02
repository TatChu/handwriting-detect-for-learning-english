var PNG = require('png-js');
PNG.decode('image/test/img-0_200.png', function(pixels) {
    console.log(pixels.length);
    pixels.forEach(function(element) {
        console.log(element)
    }, this);
});