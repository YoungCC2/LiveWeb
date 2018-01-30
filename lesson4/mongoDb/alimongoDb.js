'use strict';
var uuid = require('node-uuid');
var sprintf = require("sprintf-js").sprintf;
var host1 = "dds-bp1ca938e21dc0541137-pub.mongodb.rds.aliyuncs.com";
var port1 = 3717;
var host2 = "dds-bp1ca938e21dc0542938-pub.mongodb.rds.aliyuncs.com";
var port2 = 3717;
var username = "root";
var password = "-TTTyh743472220";
var replSetName = "mgset-5043535";
var demoDb = "admin";
var demoColl = "static";

var mongoose = require('mongoose');
var url = sprintf("mongodb://%s:%s@%s:%d,%s:%d/%s?replicaSet=%s", username, password, host1, port1, host2, port2, demoDb, replSetName);


mongoose.connect(url,{
  useMongoClient: true
});

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