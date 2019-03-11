var express = require('express');
var bodyParser = require('body-parser');
var proxy = require('http-proxy-middleware');
var app = express();
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


var options = {
    target: 'http://127.0.0.1:8888', // 目标主机
    changeOrigin: false,               // 需要虚拟主机站点
};

var exampleProxy = proxy(options);
app.use('/', exampleProxy);

app.post("/sc",(req,res,next)=>{
    const param = req.body;
    res.send(param)
})


app.listen(8083, function(req, res) {
    console.log('app is running at port 8083');
});