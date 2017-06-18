const brain = require('brain.js');        // module hỗ trợ xây dựng mạng
const jsonfile = require('jsonfile')      // module hỗ trợ lưu trữ file json
const shuffle = require('shuffle-array'); // module hỗ trợ xáo trộn mảng


// Lấy dữ liệu bộ train và test sau quá trình tiền xử lý và trích rút đặc trưng
let trainingSet = require('./../tmp/data-training.json');
let testSet = require('./../tmp/data-testing.json');

// Xáo trộn dữ liệu
shuffle(trainingSet)
shuffle(testSet)

// Khởi tạo mạng
let net = new brain.NeuralNetwork({
    hiddenLayers: 80,       // nố Neural lớp ẩn
    learningRate: 0.4       // bước học
});
// Tính thời gian huấn luyện
console.time('train: ')
net.train(trainingSet, {
    errorThresh: 0.0001,    // ngưỡng lỗi chấp nhận
    momentum: 0.3,          // momentum
    iterations: 2000,       // số lần huấn luyện tối đa
});
console.timeEnd('train: ')

// Lưu trữ trọng số mạng
let file = 'net1.json'
let obj = net.toJSON();
jsonfile.writeFile(file, obj, function (err) {
    if (err) throw err;
})

// ĐÁNH GIÁ NĂNG LỰC MẠNG
const arraysChart = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'l', 'k', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

let totalSetTest = testSet.length;
let OK = 0;

let detailTest = {
    count: new Array(26).fill(0), // số mẫu test của 26 ký tự
    ok: new Array(26).fill(0),  // số mẫu đúng tương ứng
}
// Thực hiện thống kê
testSet.forEach(function (item, index) {
    let output = net.run(item.input);
    let numberOut = output.indexOf(Math.max.apply(null, output))
    detailTest.count[numberOut]++;
    let numberRes = item.output.indexOf(Math.max.apply(null, item.output));
    if (numberOut == numberRes) {
        OK++;
        detailTest.ok[numberOut]++;
    }
});
// Xuất thông tin huấn luyện
console.log('Test case count: ', totalSetTest);
console.log('Pass: ', OK);
console.log('Percent recognition: ', (OK / totalSetTest) * 100, '%')
for (let i = 0; i < 26; i++) {
    console.log(`${arraysChart[i]} : ${detailTest.ok[i]} / ${detailTest.count[i]} :\t ${(detailTest.ok[i] * 100 / detailTest.count[i])} %`)
}
