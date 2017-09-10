var request = require('superagent');
var est = require("request");
var express = require('express');
var utility = require('utility');
var cheerio = require('cheerio');
var eventproxy = require('eventproxy');
var mkdirp = require('mkdirp');
var async  = require('async');
var path  = require('path');
var fs = require('fs');
var app = express();
var conf = require('./conf.json');
var imgSrc = require('./src.json');
var cookir;
app.get('/', function (req, res, next) {
    var base_headers = {
        Accept: '*/*',
        'Accept-Encoding': "gzip, deflate, br",
        'Accept-Language': "zh-CN,zh;q=0.8",
        'Cache-Control': "no-cache",
        Connection: "keep-alive",
        'Content-Length': 134,
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        Cookie: 'q_c1=62d5f26ce2fd4e5e8a38704aec45b8e9|1503283193000|1503283193000; d_c0="AICCkPW9QAyPTknAeJGK5-IE4OZpCufkBro=|1503283194"; _zap=c1a8d9a4-740c-47a5-8148-0fd79ab26673; _ga=GA1.2.689365114.1504495941; _gid=GA1.2.1908057380.1504690297; aliyungf_tc=AQAAAG+HfQKeagwAHqZVfXMIa12cSy8R; _xsrf=8273a28f-ebe9-4c36-bf93-1c60bb68b7fb; cap_id="MzRjOGM3OTM2MmE4NDQ1ZTk3Y2UyNzgwODIzNDUwMDU=|1504748488|0fd04130dc7fc89e2de20406d6ca05f2f21e3d79"; l_cap_id="MzkyN2ZmNDA0MDVkNDgyMThiZjU4ZGM5NGE5ZTk4MjU=|1504748488|0f2a2722dfa96076bc2defe8fbd02ad4b48c8298"; __utma=51854390.689365114.1504495941.1504690239.1504747604.6; __utmb=51854390.0.10.1504747604; __utmc=51854390; __utmz=51854390.1504747604.6.6.utmcsr=zhihu.com|utmccn=(referral)|utmcmd=referral|utmcct=/; __utmv=51854390.000--|2=registration_date=20130507=1^3=entry_date=20170821=1',
        Host: 'www.zhihu.com',
        Origin: 'https://www.zhihu.com',
        Pragma: 'no-cache',
        Referer: 'https://www.zhihu.com/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36',
        'X-Requested-With': 'XMLHttpRequest',
        'X-Xsrftoken': '8273a28f-ebe9-4c36-bf93-1c60bb68b7fb'
    }

    var data = {
        "_xsrf": "38323733613238662d656265392d346333362d626639332d316336306262363862376662",
        "password": "APTX4869",
        "captcha_type": 'cn',
        "phone_num": '18380441425'
    }
    request
        .post('https://www.zhihu.com/login/phone_num')
        .set(base_headers)
        .type('form')
        .send(data)
        .redirects(0)
        .end((err, ares) => {
            cookir = ares.headers["set-cookie"]
            console.log(cookir);
            /*request
                .get('https://www.zhihu.com/')
                .end(function (err, sres) {
                    console.log(sres);
                });*/
            res.send(JSON.parse(cookir))
        });
});

app.get('/home', function (req, res, next) {
    var base_header = {
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'zh-CN,zh;q=0.8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        Cookie: 'q_c1=252899e930f84ddebdab2ee6cfb26913|1504792285000|1504792285000; r_cap_id="YzFkM2RhYmRlNmE3NGQ5YTk2YjgzNzQ0OWQ2ZDk3NTE=|1504792285|3ad220487341beb09eea44fbe443d7203ddb7ba7"; cap_id="MGJmMzkyYjlkM2YxNDE0N2IyZWIxYzJhMGUwYzc3OGE=|1504792285|b1be3833ddbc9291f2e53aef9913175de717128c"; d_c0="AIDCNbA6VwyPTqRedlx1g_TfZzxNq5xkM8o=|1504792286"; _zap=280af8f7-2c88-4e6f-8184-19c3773d75a1; z_c0=Mi4xYzhZTEFBQUFBQUFBZ01JMXNEcFhEQmNBQUFCaEFsVk43dHZZV1FCNUJKY09QNnFJZFc5dGxUQ3pEZ3ZiMFc2bXln|1504792302|413d48023cd2f03a178c8db6675fc0a76cdc5e64; aliyungf_tc=AQAAAOCocVgB9w4AdV34cZpUDYI7GlWb; _xsrf=5ecbfef3-7209-437a-8332-a6c6be797c37; __utma=51854390.397423546.1504792265.1504792265.1504924833.2; __utmb=51854390.0.10.1504924833; __utmc=51854390; __utmz=51854390.1504924833.2.2.utmcsr=zhihu.com|utmccn=(referral)|utmcmd=referral|utmcct=/; __utmv=51854390.100-1|2=registration_date=20130507=1^3=entry_date=20130507=1',
        Host: 'www.zhihu.com',
        Referer: 'https://www.zhihu.com/',
        'Upgrade-Insecure-Requests': 1,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36'
    }
    var items = [];

    function req(i) {
        var url = 'https://www.zhihu.com/collection/68728362?page=' + i;
        request
            .get(url)
            .set(base_header)
            .end(function (err, sres) {
                if (err) {
                    return next(err);
                }
                var $ = cheerio.load(sres.text);

                $('#zh-list-collection-wrap .zm-item').each(function (idx, element) {
                    var $toggle = $(element).find('.toggle-expand');
                    var imgUrl = $toggle.attr('href'); 
                    if (imgUrl) {
                        if (imgUrl.indexOf('https') === -1) {
                            imgUrl = 'https://www.zhihu.com' + imgUrl;
                            items.push({
                                title: imgUrl
                            });
                        } else {
                            items.push({
                                title: imgUrl
                            });
                        }
                    }
                });
                fs.writeFile('./test2.json', JSON.stringify(items), function (err) {
                    if (err) {
                        throw err;
                    } else {
                        console.log(i);
                    }
                });
                if (i == 6) {
                    res.send('ok');
                } else {
                    i++;
                    req(i);
                }
            });
    }
    req(1);

});

app.get('/img', function (req, res, next) {
    
    var topicUrls = conf;
    var items = [];
    function requestFun(url,callback) {
        var baseheader = {
            Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'zh-CN,zh;q=0.8',
            'Cache-Control': 'no-cache',
            Connection: 'keep-alive',
            Cookie: 'q_c1=252899e930f84ddebdab2ee6cfb26913|1504792285000|1504792285000; r_cap_id="YzFkM2RhYmRlNmE3NGQ5YTk2YjgzNzQ0OWQ2ZDk3NTE=|1504792285|3ad220487341beb09eea44fbe443d7203ddb7ba7"; cap_id="MGJmMzkyYjlkM2YxNDE0N2IyZWIxYzJhMGUwYzc3OGE=|1504792285|b1be3833ddbc9291f2e53aef9913175de717128c"; d_c0="AIDCNbA6VwyPTqRedlx1g_TfZzxNq5xkM8o=|1504792286"; _zap=280af8f7-2c88-4e6f-8184-19c3773d75a1; z_c0=Mi4xYzhZTEFBQUFBQUFBZ01JMXNEcFhEQmNBQUFCaEFsVk43dHZZV1FCNUJKY09QNnFJZFc5dGxUQ3pEZ3ZiMFc2bXln|1504792302|413d48023cd2f03a178c8db6675fc0a76cdc5e64; aliyungf_tc=AQAAAOCocVgB9w4AdV34cZpUDYI7GlWb; _xsrf=5ecbfef3-7209-437a-8332-a6c6be797c37; __utma=51854390.397423546.1504792265.1504792265.1504924833.2; __utmb=51854390.0.10.1504924833; __utmc=51854390; __utmz=51854390.1504924833.2.2.utmcsr=zhihu.com|utmccn=(referral)|utmcmd=referral|utmcct=/; __utmv=51854390.100-1|2=registration_date=20130507=1^3=entry_date=20130507=1',
            Host: 'www.zhihu.com',
            Pragma: 'no-cache',
            'Upgrade-Insecure-Requests': 1,
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36'
        }
        request
            .get(url)
            .set(baseheader)
            .end(function (err, sres) {
                if (err) {
                    console.log('err',i);
                    return next(err);
                } else {
                    var $ = cheerio.load(sres.text);
                    $(".Question-mainColumn .QuestionAnswer-content .RichContent-inner noscript img").each(function (indx, ele) {
                        var $ele = $(ele);
                        items.push({
                            src: $ele.attr('data-original')
                        });
                    })
                    fs.writeFile('./src.json', JSON.stringify(items), function (err) {
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
        var downloadImg = function (asyncNum) {
            console.log("即将异步并发下载图片，当前并发数为:" + asyncNum);
            async.mapLimit(topicUrls, asyncNum, function (photo, callback) {
                console.log("已有" + asyncNum + "张图片进入下载队列");
                if (photo['title']) {
                    requestFun(photo['title'], callback);
                }
            }, function (err, result) {
                if (err) {
                    console.log(err);
                } else {
                    // console.log(result);<=会输出一个有2万多个“successful”字符串的数组
                    console.log("全部已下载完毕！");
                }
            });
        };
        downloadImg(10);
    
})

function down(imgSrc) {
    var Uurl = imgSrc;
    var requestAndwrite = function (url, callback) {
        request.get(url).end(function (err, res) {
            if (err) {
                console.log(err);
                console.log("有一张图片请求失败啦...");
            } else {
                var fileName = path.basename(url);
                fs.writeFile("./img1/" + fileName, res.body, function (err) {
                    if (err) {
                        console.log(err);
                        console.log("有一张图片写入失败啦...");
                    } else {
                        console.log(fileName);
                        callback(null, "successful !");
                        /*callback貌似必须调用，第二个参数将传给下一个回调函数的result，result是一个数组*/
                    }
                });
            }
        });
    }

    var downloadImg = function (asyncNum) {
        console.log("即将异步并发下载图片，当前并发数为:" + asyncNum);
        async.mapLimit(imgSrc, asyncNum, function (photo, callback) {
            console.log("已有" + asyncNum + "张图片进入下载队列");
            if (photo['src']) {
                requestAndwrite(photo['src'], callback);
            }else{
                
            }
        }, function (err, result) {
            if (err) {
                console.log(err);
            } else {
                // console.log(result);<=会输出一个有2万多个“successful”字符串的数组
                console.log("全部已下载完毕！");
            }
        });
    };
    downloadImg(1);
}
down(imgSrc);

app.listen(3000, function (req, res) {
    console.log('app is running at port 3000');
});