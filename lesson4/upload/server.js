var express = require('express');
var request = require('superagent');
var bodyParser = require('body-parser');
var multiparty = require('multiparty');
var fs = require('fs');
var util = require('util');
var app = express();
var path = require("path");
var {fileType} = require("./fileType");
var staticToolDb = require("./MongoDB/toolDb/staticToolDb");
var soundsToolDb = require("./MongoDB/toolDb/soundsToolDb");
var uuid = require('node-uuid');  

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/find', function (req, res, next) {
    res.send("hello world");
})

//图片 音频文件上传
/**
inputFile
*/
app.post('/uploadFile', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    var form = new multiparty.Form({uploadDir: 'uploadfiles/images'});
    form.parse(req, function (err, fields, files) {
        var filesTmp = JSON.stringify(files, null, 2);
        if (err) {
            console.log('parse error: ' + err);
        } else {
            var inputFile = files.inputFile[0];
            var uploadedPath = inputFile.path;
            var fileName = inputFile.originalFilename;
            if(fileName.match(/[\u4e00-\u9fa5]/g)){
                res.writeHead(200, {
                    'content-type': 'text/plain;charset=utf-8'
                });
                res.write('received upload:\n\n');
                res.end(util.inspect({
                    message: "文件名不能包含中文."
                }));
            }
            let ext = path.extname(uploadedPath); //获取到文件名后缀 格式  .xxx
            ext = ext.split('.').pop();
            ext = ext.toLocaleUpperCase();
            var dstPath = "";
            var resourceUrl = "";
            if(fileType(ext)==="aud"){
                dstPath = '/static/audio/' + fileName;
                resourceUrl = '/audio/' + fileName;
            }else if(fileType(ext)==="img"){
                dstPath = '/static/images/' + fileName;
                resourceUrl = '/images/' + fileName;
            }else{
                res.writeHead(200, {
                    'content-type': 'text/plain;charset=utf-8'
                });
                res.write('received upload:\n\n');
                res.end(util.inspect({
                    message: "未识别的文件类型."
                }));
            }
            fs.rename(uploadedPath, dstPath, function (err) {
                if (err) {} else {
                    staticToolDb.insertData({
                        "filename":"http://120.78.172.238:3000"+resourceUrl,
                        "createTime":Date.parse(new Date())
                    }).save().then((doc)=>{
                        res.writeHead(200, {
                            'content-type': 'text/plain;charset=utf-8'
                        });
                        res.end(util.inspect({
                            path: "http://120.78.172.238:3000" + resourceUrl
                        }));
                    })
                }
            })
        }

    })
})

//讯飞文字转语音
/*
{
        "vcn": "x_xiaorong",
        "vol": 7,
        "spd": "medium",
        "textPut": text.text,
        "textType": "cn"
    }
*/
app.post('/find', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    var url = 'http://www.peiyinge.com/make/getSynthSign';
    var getWorkPriceUrl = "http://www.peiyinge.com/make/getWorkPrice";
    var baseHead = {
        "Host": "www.xfyun.cn",
        "Connection": "keep-alive",
        "Accept": "application/json, text/javascript, */*; q=0.01",
        "X-Requested-With": "XMLHttpRequest",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36",
        "Referer": "http://www.xfyun.cn/services/online_tts",
        "Accept-Encoding": "gzip, deflate",
        "Accept-Language": "zh-CN,zh;q=0.9",
        "Cookie": "token=null; account_id=null; pgv_pvi=3904091136; pgv_si=s3691503616; SESSION=fd8751b8-7d67-43be-8973-03090452316e; Hm_lvt_83a57cc9e205b0add91afc6c4f0babcc=1515588364,1515588379; Hm_lpvt_83a57cc9e205b0add91afc6c4f0babcc=1515588379"
    }

    var text = req.body;
    console.log(text);
//    var ss = {
//        "vcn": "x_xiaorong",
//        "vol": 7,
//        "spd": "medium",
//        "textPut": text.text,
//        "textType": "cn"
//    }
    request
        .get("http://www.xfyun.cn/herapi/solution/synthesis")
        .set(baseHead)
        .query(text)
        .end(function (err, sres) {
            res.send(sres.text);
        })


})

//插入景点信息
/*
    {
        "viewname": "解放碑",
        "typename": "jfb",
        "ViewsPoint": {
            "coverImgUrl": "http://y.gtimg.cn/music/photo_new/T002R300x300M000003rsKF44GyaSk.jpg?max_age=2592000",
            "epname": "解放碑",
            "singer": "佚名",
            "src": "http://120.78.172.238:3000/audio/jfb.mp3",
            "title": "解放碑"
        }
    }
*/
app.post('/sounds',function(req,res,next){
    res.header('Access-Control-Allow-Origin', '*');
    var insData = req.body;
    insData["uuid"] = uuid.v4();
    soundsToolDb.insertData(insData).save().then(()=>{
        res.send({
            message:"success",
            code:200
        });
    })
})

//获取景点列表
app.get('/viewlist',function(req,res,next){
    res.header('Access-Control-Allow-Origin', '*');
    soundsToolDb.findData().find().then((result)=>{
        res.send(result);
    })
    
})

app.listen(3389, function (req, res) {
    console.log('app is running at port 3389');
});
