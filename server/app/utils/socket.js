'use strict'

// const Boom = require('boom');
// const util = require('util');
// const Joi = require('joi');
// const HapiSwagger = require('hapi-swagger');
// const Path = require('path');
// const Pack = require(global.BASE_PATH + '/package');
// const Glob = require("glob");
const _ = require('lodash');
const async = require("async");
const Bluebird = require("bluebird");
const Mongoose = require('mongoose');

module.exports = function (io) {

    io.on("connection", function (socket) {  
        console.log("client incoming");
        socket.on('socket-postNoti', function(data){
            setTimeout(function(){
                getNoti(data).then(function(resp){
                    // console.log('tt',resp);
                    socket.emit('socket-getNoti', resp);
                });
            }, 1000);
        });
    });
}

/***************************************
FUNCITION
***************************************/
