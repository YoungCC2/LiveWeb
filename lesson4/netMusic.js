var request = require('superagent');
var express = require('express');
var cheerio = require('cheerio');
var eventproxy = require('eventproxy');
var mkdirp = require('mkdirp');
var async = require('async');
var path = require('path');
var fs = require('fs');
var app = express();


app.get('/', function (req, res, next) {
    
    var _urlArr = [];
    var url = 'http://music.163.com'
    for(var i =0;i<11;i++){
        _urlArr.push("http://music.163.com/djradio?id=1813003&order=1&_hash=programlist&limit=100&offset="+i*100)
    }
    var _hrefArr = [];
    function requestFunc(url,callback){
            var baseheader = {
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
                "Accept-Encoding": "gzip, deflate",
                "Accept-Language": "zh-CN,zh;q=0.8",
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "Cookie": process.env.NETEASE_MUSIC_COOKIE || "",
                "Host": "music.163.com",
                "Pragma": "no-cache",
                "Referer": "http://music.163.com/",
                "Upgrade-Insecure-Requests": "1",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36"
            }
            
            request
                .get(url)
                .set(baseheader)
                .end(function (err, sres) {
                    if (err) {
                        console.log('err', i);
                        return next(err);
                    } else {
                        var $ = cheerio.load(sres.text);
                        var _tbody  =  $(".n-songtb table tbody");
                        var _tr = _tbody.children().length;
                        var _trContent = '',_trHref='',_trTitle='';
                        
                        for(var i =0 ;i<_tr; i++){
                            _trHref = _tbody.children("tr").eq(i).find("td.col2 div a").attr("href");
                            _trTitle = _tbody.children("tr").eq(i).find("td.col2 div a").attr("title");
                            if(_trHref !== ""){
                                _hrefArr.push({
                                    href:"http://music.163.com" + _trHref,
                                    title:_trTitle
                                })
                            }
                        }
                        
                        fs.writeFile('./netRedio.json', JSON.stringify(_hrefArr), function (err) {
                            if (err) {
                                throw err;
                            } else {
                                console.log('success');
                                callback(null, "successful !");
                            }
                        });
                        
                    }
                })
    }
    
    var requestSong = function(asyncNum){
        async.mapLimit(_urlArr, asyncNum, function(item, callback) {
            console.log("已有" + asyncNum + "个链家开始爬取");
            requestFunc(item,callback);
        },function(err, result){
            if(err){
                console.log("err:"+err);
            }else{
                res.send(_hrefArr);
                console.log("全部已爬取完毕！");
            }
        })
    }
    requestSong(1)
})

app.listen(3000, function(req, res) {
    console.log('app is running at port 3000');
});
