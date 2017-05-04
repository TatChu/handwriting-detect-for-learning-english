const fs = require('fs');
const Jimp = require("jimp");
const jsonfile = require('jsonfile')

require('async-arrays').proto();

const arraysChart = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'l', 'k', 'm', 'n', 'o',
    'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
const nguong = 128;

//  'tmp/'
//  'tmp/'
//  'tmp/output/'
// function
let readAllFiles = function (rootDir, charecter, outputDir, done) {

    // file object json
    const output = new Array(26).fill(0);
    output[arraysChart.indexOf(charecter)] = 1;
    let data = {
        input: [],
        output: []
    };

    let dir = rootDir + charecter + '/';
    fs.readdir(dir, (err, files) => {
        if (files) {
            files.forEachEmission(function (item, index, next) {
                if (item.indexOf(charecter + '_') == -1) {
                    next();
                }
                else {
                    let input = [];
                    Jimp.read(dir + item, function (err, image) {
                        this.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {

                            var red = this.bitmap.data[idx + 0];
                            var green = this.bitmap.data[idx + 1];
                            var blue = this.bitmap.data[idx + 2];
                            var alpha = this.bitmap.data[idx + 3];
                            let tbc = (red + green + blue) / 3;

                            if (tbc < nguong) {
                                input.push(1);
                            }
                            else {
                                input.push(0);
                            }
                        }).autocrop(function () {
                            data.input.push(input);
                            data.output.push(output);
                            next();
                        })
                    })
                }

            }, function () {
                if (!fs.existsSync(outputDir)) {
                    fs.mkdirSync(outputDir);
                }
                jsonfile.writeFile(outputDir + charecter + '.json', data, function (err) {
                    if (err) console.error(err)
                    console.log('Done!');
                    done(data);
                })
            })
        }

    })
}

arraysChart.forEachEmission(function (item, index, next) {
    readAllFiles('tmp/', item, 'tmp/output/', function (data) {
        console.log(index, item);
        next();
    })
}, function () {
    console.log('DONE');
})
