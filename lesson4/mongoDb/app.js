/*加载模块*/
var express = require('express');
var http = require('http');
var path = require('path');
/*创建服务*/
var app = express();
app.set('port', 80);
app.use(express.static(path.join(__dirname, 'public')));
/*服务启动*/
http.createServer(app).listen(app.get('port'), function () {
    console.log('静态资源服务器已启动,监听端口:' + app.get('port'));
});
}