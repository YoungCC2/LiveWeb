const  mongoose = require('mongoose');
const  url = process.env.MONGODB_URI;

if (!url) {
  throw new Error('MONGODB_URI is required');
}

mongoose.Promise = global.Promise
mongoose.connect(url);

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
