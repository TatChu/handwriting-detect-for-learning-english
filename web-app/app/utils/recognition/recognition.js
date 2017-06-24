let brain = require('brain');
const Jimp = require('jimp');
const width = 10, height = 15;
const nguong = 20;

const arraysChart = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'l', 'k', 'm', 'n', 'o',
    'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

// TEST NHẬN DẠNG CHỮ FROM LOCAL KHÔNG CÓ TRONG BỘ TRAIN VÀ TEST
var json = require('./network.json');
let net = new brain.NeuralNetwork();
net.fromJSON(json);

module.exports = {
    recognition
}
function recognition(imgSrc) {
    return new Promise(function (resolve, reject) {
        let input = [];
        Jimp.read(imgSrc, function (err, image) {
            if (err) return reject(err);
            image.resize(10, 15).scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {

                var red = this.bitmap.data[idx + 0];
                var green = this.bitmap.data[idx + 1];
                var blue = this.bitmap.data[idx + 2];
                var alpha = this.bitmap.data[idx + 3];
                let tbc = (red + green + blue) / 3;

                if (tbc < nguong) {
                    input.push(0);
                }
                else {
                    input.push(1);
                }
            }).autocrop(function () {
                // for (var u = width; u < height * width; u += width) {
                //     let row = '';
                //     for (var v = u - width; v < u; v++) {
                //         row += input[v];
                //     }
                //     console.log(row);
                // }

                var output = net.run(input);

                let outputTmp = JSON.parse(JSON.stringify(output));
                let arraysChartTmp = JSON.parse(JSON.stringify(arraysChart));

                var indexOutput = output.indexOf(Math.max.apply(null, output));
                var charPredict = arraysChart[indexOutput];

                outputTmp.splice(indexOutput, 1);
                arraysChartTmp.splice(indexOutput, 1);
                let indexSecond = outputTmp.indexOf(Math.max.apply(null, outputTmp));
                console.log('detected: ', arraysChart[indexOutput], ' : ', output[indexOutput] * 100, ' or ', arraysChartTmp[indexSecond], ' : ', outputTmp[indexSecond] * 100);

                return resolve({
                    input: input,
                    output: output,
                    charPredict: charPredict,
                    secondDetect: arraysChartTmp[indexSecond]
                });
            })
        })
    });


}

// recognition('public/files/tmp/processed_tmp_1494503373483.jpg')
