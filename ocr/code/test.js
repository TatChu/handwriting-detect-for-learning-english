var data = require('./../tmp/output/y.json');
const width = 10, height = 15;
data.input.forEach(function (item, index) {
    for (var u = width; u < height * width; u += width) {
        let row = '';
        for (var v = u - width; v < u; v++) {
            row += item[v];
        }
        console.log(row);
    }
    console.log();
    console.log();
});