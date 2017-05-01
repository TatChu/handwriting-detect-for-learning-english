var data = require('./../image/croped/z.json');
data = JSON.parse(data);
var jsonfile = require('jsonfile')
var dataMatrix = {
    input: [],
    output: []
};
var dataTrain = {
    input: [],
    output: []
};
const matrix_size = 84;

// jsonfile.writeFile('data/data-matrix.json', JSON.stringify(dataMatrix), function (err) {
//     if (err) console.error(err)
// })

// dataMatrix.input.forEach(function (rows, index) {

//     let input_27x27 = [];
//     for (var i = 0; i < 27; i++) {
//         let line = '';
//         for (var j = 0; j < 27; j++) {
//             let totalBlackPx = 0;
//             totalBlackPx = rows[i * 3 + 0][j * 3 + 0] + rows[i * 3 + 0][j * 3 + 1] + rows[i * 3 + 0][j * 3 + 2] +
//                 rows[i * 3 + 1][j * 3 + 0] + rows[i * 3 + 1][j * 3 + 1] + rows[i * 3 + 1][j * 3 + 2] +
//                 rows[i * 3 + 2][j * 3 + 0] + rows[i * 3 + 2][j * 3 + 1] + rows[i * 3 + 2][j * 3 + 2];
//             input_27x27.push(totalBlackPx);
//             line += rows[i][j];
//         }
//     }
//     dataTrain.input.push(input_27x27);
//     dataTrain.output.push(dataMatrix.output[index]);
// });

// jsonfile.writeFile('data/data-train.json', JSON.stringify(dataTrain), function (err) {
//     if (err) console.error(err)
// })

// dataMatrix.input.forEach(function (rows, index) {
//     let input_27x27 = [];
//     for (var i = 0; i < 27; i++) {
//         let line = '';
//         for (var j = 0; j < 27; j++) {
//             let totalBlackPx = 0;
//             totalBlackPx = rows[i * 3 + 0][j * 3 + 0] + rows[i * 3 + 0][j * 3 + 1] + rows[i * 3 + 0][j * 3 + 2] +
//                 rows[i * 3 + 1][j * 3 + 0] + rows[i * 3 + 1][j * 3 + 1] + rows[i * 3 + 1][j * 3 + 2] +
//                 rows[i * 3 + 2][j * 3 + 0] + rows[i * 3 + 2][j * 3 + 1] + rows[i * 3 + 2][j * 3 + 2];
//             input_27x27.push(totalBlackPx);
//             line += rows[i][j];
//         }
//         console.log(line);
//     }

//     console.log();
//     console.log();
//     dataTrain.input.push(input_27x27);
//     dataTrain.output.push(dataMatrix.output[index]);
// });