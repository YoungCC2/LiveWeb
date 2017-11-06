var request = require('superagent');
var est = require("request");
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
                "Cookie": "_ntes_nnid=d6602ef81eec30b3630b256fdbf36e8b,1505810873434; _ntes_nuid=d6602ef81eec30b3630b256fdbf36e8b; vjuids=-6320a175d.15ebbdf62d0.0.1b3d6495baabc; mail_psc_fingerprint=68054eae0e444f652908b516e3b8db2d; P_INFO=yh4063254@163.com|1506563011|2|mail163|11&13|chq&1506390550&mail163#chq&null#10#0#0|187670&0|mail163|yh4063254@163.com; vjlast=1506390533.1509082860.11; vinfo_n_f_l_n3=f8954d276ba7c552.1.2.1508129441279.1508132464873.1509082894466; playerid=20437561; JSESSIONID-WYYY=pB%2Bjt5xlbWr%2FKdra2zzxIlrDd16J8XEyejpWsWMwrP2OoK2ditRlljrNT57YPOtZ3IiasduM5jHOQ0Z%2FNXdTx1RTg6Qkt6biI18D%2BYFwDjgYtI50taU4R3v%2BZokK%2B69Ah7Ou8Bucn02ipzoztlKPvZ2g6VOy10wKBRe4%2B8Okc%2BzZvgqS%3A1509700976970; _iuqxldmzr_=32; MUSIC_U=93181d58e76bc868a4b8cc6a8ad2eefa858834c2013acb3cb96d327fbf2040bac008d05d163e04f335c7deb169ee8b8aa70b41177f9edcea; __remember_me=true; __csrf=226a8629e7ebe410fa8b7ee4dcc33d5d; __utma=94650624.1882214727.1505810874.1509695697.1509699322.11; __utmb=94650624.4.10.1509699322; __utmc=94650624; __utmz=94650624.1509695697.10.8.utmcsr=baidu|utmccn=(organic)|utmcmd=organic",
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
