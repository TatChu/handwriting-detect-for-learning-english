const cv = require('opencv');

cv.readImage('image/test/img-0_400.jpg', function (err, mat) {
    // console.log(mat);
    for (var i = 0; i <= 83; i++) {
        var row = '';
        for (var j = 0; j <= 83; j++) {
            console.log(i, j, typeof mat.get(i, j), mat.get(i, j));
            if (mat.get(mat.get(i, j) >= 0))
                row += '1';
            else row += '0';
        }

        // console.log(row);
    }
})