// xáo trộn mảng
var shuffle = require('shuffle-array');

// Test so gop file data training

// Test ma tran nhi phan

var data = require('./../tmp/data-testing.json');
const width = 10, height = 15;
// shuffle(data);
data.forEach(function (item, index) {
    for (var u = width; u < height * width; u += width) {
        let row = '';
        for (var v = u - width; v < u; v++) {
            row += item.input[v];
        }
        console.log(row);
    }
    console.log();
    console.log();
});