const  mongoose = require('mongoose');
const  sprintf = require("sprintf-js").sprintf;
const  config = require("./config/dbConfig");
const  url = sprintf("mongodb://%s:%s@%s:%d,%s:%d/%s?replicaSet=%s", config.username, config.password, config.host1, config.port1, config.host2, config.port2, config.demoDb, config.replSetName);
mongoose.Promise = global.Promise
mongoose.connect(url,{
  useMongoClient: true
});

mongoose.connection.on('connected', function () {    

}); 
/**
 * 连接异常
 */
mongoose.connection.on('error',function (err) {    

});    
 
/**
 * 连接断开
 */
mongoose.connection.on('disconnected', function () {    

}); 

module.exports = mongoose;