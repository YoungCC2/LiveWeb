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
    var _url = 'https://www.zhihu.com/people/excited-vczh/answers?page=1';
    var baseheader = {
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-CN,zh;q=0.8",
        "Cache-Control": "max-age=0",
        "Connection": "keep-alive",
        "Cookie": '_zap=1d25596d-92d8-4c50-ab58-bebcb79e4fe1; q_c1=5dd9c07d1d8544dab377e6eca1a91f5c|1505876343000|1505876343000; d_c0="AEDCu2OaZwyPTkFdLWgkHyfNqqT7-RRU2QU=|1505891115"; _ga=GA1.2.1072563680.1506499063; r_cap_id="YWRmYjJiNzFiZjk5NGQ3MWEyOWFhYjM2ZDBjYzdiMDY=|1508486891|a87cc7ed481727ffc0432438640a3e959cfce64d"; cap_id="MWI5ZjA3NGJiNmE0NGIzN2I0NGEyYTI3MWY3MTllMzE=|1508486891|fbeb5bdbb0ee0107457fcd4ef3924ac6894d6973"; z_c0=Mi4xYzhZTEFBQUFBQUFBUU1LN1k1cG5EQmNBQUFCaEFsVk44dnpXV2dBMlNtelRWR1E0dTcycmt0N0tfeklONUFLRVB3|1508486898|e8955da2622f0a316c412061a10a824933e2a98c; q_c1=5dd9c07d1d8544dab377e6eca1a91f5c|1508737686000|1505876343000; __utma=51854390.1072563680.1506499063.1509949933.1510020512.12; __utmz=51854390.1510020512.12.10.utmcsr=zhihu.com|utmccn=(referral)|utmcmd=referral|utmcct=/; __utmv=51854390.100-1|2=registration_date=20130507=1^3=entry_date=20130507=1; aliyungf_tc=AQAAAH7tCS/D5AEAlV5pDvKHYlSPZmx/; _xsrf=bde6f296-e4c5-4665-938b-488cdf20fb55',
        "Host": "www.zhihu.com",
        "Upgrade-Insecure-Requests": "1",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36"
    }
    request
        .get(_url)
        .set(baseheader)
        .end(function(err,sres){
            if(err){
                console.log('err');
                return next(err);
            }else{
                var $ = cheerio.load(sres.text);
                
                var perinfo = [
                    {
                        perinfos:{
                            avator:$("#ProfileHeader .Avatar").attr('src'),
                            name:$("#ProfileHeader .ProfileHeader-name").text()
                        }
                    }
                    
                ]
                /* $("#Profile-answers .List-item").map(function(k,v){
                    perinfo.push({
                        ac:"https://www.zhihu.com"+$(v).find('a[data-za-detail-view-element_name="Title"]').attr('href')
                    })
                    
                }) */
                    
                
                res.send($("#Profile-answers").children().length);
            }
        })

})

app.listen(3000, function(req, res) {
    console.log('app is running at port 3000');
});
