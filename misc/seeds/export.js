// var sys = require('sys');
var sys = require('util');
var path = require('path');
var exec = require('child_process').exec;
var config = require('./config.js');
var child;

let seedPath = process.cwd() + path.sep + path.join('data');

child = exec(`mongodump -d ${config.db.name} -o ${seedPath}` , function (error, stdout, stderr) {
  console.log('stdout: ' + stdout);
  console.log('stderr: ' + stderr);
  if (error !== null) {
    console.log('exec error: ' + error);
  }
});
