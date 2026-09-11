'use strict';
var demoColl = "static";

var mongoose = require('mongoose');
var url = process.env.MONGODB_URI;

if (!url) {
  throw new Error('MONGODB_URI is required');
}

mongoose.connect(url);

mongoose.connection.on('connected', function () {    
//    console.log('Mongoose connection success ');  
}); 
/**
 * 连接异常
 */
mongoose.connection.on('error',function (err) {    
    console.log('Mongoose connection error: ' + err);  
});    
 
/**
 * 连接断开
 */
mongoose.connection.on('disconnected', function () {    
    console.log('Mongoose connection disconnected');  
}); 

module.exports = mongoose;
