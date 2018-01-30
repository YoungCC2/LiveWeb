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
var conf = require('./conf.json');
// var imgSrc = require('./src.json');
var mainMenu = require('./mainMenu.json');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var open = require("open");
var nodemailer = require('nodemailer');
const  os=require('os');


// open("http://www.baidu.com", "firefox");
var cookir;
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

//app.get('/', function(req, res, next) {
//    var base_headers = {
//        Accept: '*/*',
//        'Accept-Encoding': "gzip, deflate, br",
//        'Accept-Language': "zh-CN,zh;q=0.8",
//        'Cache-Control': "no-cache",
//        Connection: "keep-alive",
//        'Content-Length': 134,
//        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
//        Cookie: 'q_c1=62d5f26ce2fd4e5e8a38704aec45b8e9|1503283193000|1503283193000; d_c0="AICCkPW9QAyPTknAeJGK5-IE4OZpCufkBro=|1503283194"; _zap=c1a8d9a4-740c-47a5-8148-0fd79ab26673; _ga=GA1.2.689365114.1504495941; _gid=GA1.2.1908057380.1504690297; aliyungf_tc=AQAAAG+HfQKeagwAHqZVfXMIa12cSy8R; _xsrf=8273a28f-ebe9-4c36-bf93-1c60bb68b7fb; cap_id="MzRjOGM3OTM2MmE4NDQ1ZTk3Y2UyNzgwODIzNDUwMDU=|1504748488|0fd04130dc7fc89e2de20406d6ca05f2f21e3d79"; l_cap_id="MzkyN2ZmNDA0MDVkNDgyMThiZjU4ZGM5NGE5ZTk4MjU=|1504748488|0f2a2722dfa96076bc2defe8fbd02ad4b48c8298"; __utma=51854390.689365114.1504495941.1504690239.1504747604.6; __utmb=51854390.0.10.1504747604; __utmc=51854390; __utmz=51854390.1504747604.6.6.utmcsr=zhihu.com|utmccn=(referral)|utmcmd=referral|utmcct=/; __utmv=51854390.000--|2=registration_date=20130507=1^3=entry_date=20170821=1',
//        Host: 'www.zhihu.com',
//        Origin: 'https://www.zhihu.com',
//        Pragma: 'no-cache',
//        Referer: 'https://www.zhihu.com/',
//        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36',
//        'X-Requested-With': 'XMLHttpRequest',
//        'X-Xsrftoken': '8273a28f-ebe9-4c36-bf93-1c60bb68b7fb'
//    }
//
//    var data = {
//        "_xsrf": "38323733613238662d656265392d346333362d626639332d316336306262363862376662",
//        "password": "APTX4869",
//        "captcha_type": 'cn',
//        "phone_num": '18380441425'
//    }
//    request
//        .post('https://www.zhihu.com/login/phone_num')
//        .set(base_headers)
//        .type('form')
//        .send(data)
//        .redirects(0)
//        .end((err, ares) => {
//            cookir = ares.headers["set-cookie"]
//            console.log(cookir);
//            /*request
//                .get('https://www.zhihu.com/')
//                .end(function (err, sres) {
//                    console.log(sres);
//                });*/
//            res.send(JSON.parse(cookir))
//        });
//});

app.get('/home', function(req, res, next) {
    var connection = mysql.createConnection({
        host: 'localhost',
        port: '3306',
        user: 'root',
        password: '123456',
        database: 'world'
    });
    var base_header = {
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'zh-CN,zh;q=0.8',
        'Connection': 'keep-alive',
        'Cache-Control': 'max-age=0',
        Cookie: 'SINAGLOBAL=3025813996998.969.1503034766074; wb_cmtLike_1662736405=1; wvr=6; UOR=,,www.happyge.com; YF-Ugrow-G0=1eba44dbebf62c27ae66e16d40e02964; SSOLoginState=1505269772; YF-V5-G0=d45b2deaf680307fa1ec077ca90627d1; _s_tentry=-; Apache=610506355751.2435.1505269776456; ULV=1505269776633:13:13:5:610506355751.2435.1505269776456:1505264517861; YF-Page-G0=c47452adc667e76a7435512bb2f774f3; SCF=Ap9KrOm1nN4UNPRFCDcI0uu4l8uHK5gkmMcqozyNrehN0PMMOElI-yXXz07wkAUSPuEjtzPscJeJMDdzLsNFo2g.; SUB=_2A250vM12DeRhGedI7VAW8yjIyzmIHXVXy7m-rDV8PUJbmtBeLVjAkW8B1_X8l5RyIIxC3lg1e6nyMC2GCQ..; SUBP=0033WrSXqPxfM725Ws9jqgMF55529P9D9W5WyNw0a83_.-6ZDQivLDSl5JpX5o2p5NHD95QpSoqES0ecSh5fWs4DqcjUxsvfqJpLi--Xi-zRi-zcggvfdJMLxKnL1hnLB-2t; SUHB=06ZEuseM4UYGBU; ALF=1536805772; wb_cusLike_1662736405=N',
        Host: 'weibo.com',
        'Upgrade-Insecure-Requests': 1,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36'
    }
    var getParam = {
        ajwvr: '6',
        domain: '100505',
        is_search: '0',
        visible: '0',
        is_all: 1,
        is_tag: 0,
        profile_ftype: '1',
        page: '1',
        pagebar: '0',
        pl_name: 'Pl_Official_MyProfileFeed__22',
        id: '1005051916825084',
        script_uri: '/p/1005051916825084/home',
        feed_type: '0',
        pre_page: '1',
        domain_op: '100505',
        __rnd: '1505200425930'
    }
    function setParam(page, pagebar) {
        return {
            ajwvr: '6',
            domain: '100505',
            is_search: '0',
            visible: '0',
            is_all: 1,
            is_tag: 0,
            profile_ftype: '1',
            page: page,
            pagebar: pagebar,
            pl_name: 'Pl_Official_MyProfileFeed__22',
            id: '1005051916825084',
            script_uri: '/vczh',
            feed_type: '0',
            pre_page: page,
            domain_op: '100505',
            __rnd: '1505200425930'
        }
    }

    function defaultParam(page) {
        return {
            is_search: '0',
            visible: '0',
            is_all: '1',
            is_tag: '0',
            profile_ftype: '1',
            page: page
        }
    }

    var sccc = '';
    var count = -1;

    function requestGet(page, pagebar, callback) {
        if (pagebar == -1) {
            var queryObj = defaultParam(page);
        } else {
            var queryObj = setParam(page, pagebar);
        }
        request
            .get("http://weibo.com/p/1005051916825084/home")
            .set(base_header)
            .query(queryObj)
            .end(function(err, sres) {
                if (err) {
                    res.send('e');
                    return next(err);
                } else {
                    var $ = cheerio.load(sres.text);
                    var mc = [];
                    var items = [];
                    $('script').each(function(k, v) {
                        if (k > 3) {
                            var temp = $('script').eq(k).text();
                            if (temp.substr(-1) === ';') {
                                temp = temp.substring(8, temp.length - 2);
                            } else {
                                temp = temp.substring(8, temp.length - 1);
                            }
                            temp = JSON.parse(temp);
                            mc.push({
                                'html': temp.html,
                                'domid': temp.domid
                            });
                        }
                    });
                    var mainStr = "";
                    mc.forEach(function(k, v) {
                        if (mc[v]["domid"] === "Pl_Official_MyProfileFeed__22") {
                            mainStr = mc[v]["html"];
                        }
                    });
                    $ = cheerio.load(mainStr);
                    connection.connect(function(err) {
                        if (!err) {
                            console.log('sc');
                        }
                    });
                    $(".WB_feed_v4 .WB_feed_like").each(function(ids, ele) {
                        var st = $(ele).find('.media_box');
                        if (st) {
                            st.find("img").each(function(idsa, eele) {
                                items.push({
                                    src: $(eele).attr('src')
                                });
                            });
                        }
                    });
                    items.forEach(function(item, k) {
                        var squery = "insert into img(src,page) values('" + item['src'] + "'," + page + ")"
                        connection.query(squery, function(error, results) {
                            if (error) {
                                res.send(error);
                            } else {
                                //                                console.log(k);
                            }
                        });
                    });
                    callback(err, res);
                }
            })
    };

    function pageDate(page) {
        if (page) {
            var pages = page;
            var tasks = ['-1', '0', '1'];
            async.eachSeries(tasks, function(item, callback) {
                requestGet(pages, item, callback);
            }, function(err, result) {
                console.log(page + "end");
            });
        }
    }
    var pageArr = [];
    for (var i = 200; i <= 204; i++) {
        pageArr[i] = i;
    }
    async.mapLimit(pageArr, 2, function(item, callback) {
        if (item) {
            setTimeout(function() {
                pageDate(item);
                callback(null, item + '!!!');
            }, 2000)
        } else {
            callback(null, item + '!!!');
        }
    }, function(err, result) {
        console.log("ennnnnnnnnnnnnnnd!");
    });


});

app.get('/img', function(req, res, next) {

    var topicUrls = conf;
    var items = [];

    function requestFun(url, callback) {
        var baseheader = {
            Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'zh-CN,zh;q=0.8',
            'Cache-Control': 'no-cache',
            Connection: 'keep-alive',
            Cookie: 'q_c1=f17d446552694d5fbbf0af2ab7619a0a|1504753247000|1504753247000; d_c0="AJBCKcWlVgyPTvVdkjkV8YLnZgvgvUcZpSE=|1504753248"; _zap=d719f1f5-26c3-4d96-94a0-b4c90e5c8859; r_cap_id="NjhlNWYzNDgwMWZiNDJlNGJkNGNkZDBhNTgwNjEzNmI=|1504753993|0e70a70a135f80b938a4f5c5b1302becefcaeefc"; cap_id="ZTBhOGI3NjZkYzIyNGY1YzgxYTVlNjhhOTFkMDkwY2M=|1504753993|79abac452198f777371b1c977310c7288d113c78"; z_c0=Mi4xYzhZTEFBQUFBQUFBa0VJcHhhVldEQmNBQUFCaEFsVk5UMGpZV1FDRWRKajUzZlhjRV9fZjlIcFNuSUtMa3NOcTFR|1504754511|065c87cce59c0589bcbffd22c14cef97450d09f1; __utma=51854390.1519459293.1504753249.1504850713.1504852601.9; __utmz=51854390.1504852601.9.8.utmcsr=zhihu.com|utmccn=(referral)|utmcmd=referral|utmcct=/collections; __utmv=51854390.100-1|2=registration_date=20130507=1^3=entry_date=20130507=1; aliyungf_tc=AQAAAGAU5E7QEw0An6RVfZD0T2fxpHYy; _xsrf=5c4e6162-1a6c-4104-83e9-9838adbbf26d',
            Host: 'www.zhihu.com',
            Pragma: 'no-cache',
            'Upgrade-Insecure-Requests': 1,
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36'
        }
        request
            .get(url)
            .set(baseheader)
            .end(function(err, sres) {
                if (err) {
                    console.log('err', i);
                    return next(err);
                } else {
                    var $ = cheerio.load(sres.text);
                    $(".Question-mainColumn .QuestionAnswer-content .RichContent-inner noscript img").each(function(indx, ele) {
                        var $ele = $(ele);
                        /*  items.push({
                              src: $ele.attr('data-original')
                          });*/
                        var z = '"' + $ele.attr('data-original') + '"';
                        items.push(z);
                    })
                    fs.writeFile('./src.json', items, function(err) {
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

    var downloadImg = function(asyncNum) {
        console.log("即将异步并发爬取，当前并发数为:" + asyncNum);
        async.mapLimit(topicUrls, asyncNum, function(photo, callback) {
            console.log("已有" + asyncNum + "个链家开始爬取");
            if (photo['title']) {
                requestFun(photo['title'], callback);
            } else {

            }
        }, function(err, result) {
            if (err) {
                console.log(err);
            } else {
                res.send('ok');
                console.log("全部已爬取完毕！");
            }
        });
    };
    downloadImg(1);
})

app.get('/downloadImg', function(req, res, next) {
  

    function down(imgSrc) {
        var Uurl = imgSrc;
        var requestAndwrite = function(url, callback) {
            var countUrl = 0;

            request.get(url).end(function(err, res) {
                if (err) {
                    console.log(err);
                    console.log("有一张图片请求失败啦...");
                } else {
                    var fileName = path.basename(url);
                    fs.writeFile("./img1/" + fileName, res.body, function(err) {
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

        var downloadImg = function(asyncNum) {
            console.log("即将异步并发下载图片，当前并发数为:" + asyncNum);
            async.mapLimit(imgSrc, asyncNum, function(photo, callback) {
                console.log("已有" + asyncNum + "张图片进入下载队列");
                if (photo) {
                    requestAndwrite(photo, callback);
                } else {

                }
            }, function(err, result) {
                if (err) {
                    console.log(err);
                } else {
                    // console.log(result);<=会输出一个有2万多个“successful”字符串的数组
                    console.log("全部已下载完毕！");
                }
            });
        };
        downloadImg(10);
    }
    down(imgSrc);
});

app.get('/mysql', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    var connection = mysql.createConnection({
        host: 'localhost',
        port: '3306',
        user: 'root',
        password: '123456',
        database: 'world'
    });
    //开始连接
    connection.connect(function(err) {
        if (err) {
            console.log('[query] - :' + err);
            return;
        }
    });

    function resStr(err, resData) {
        var resCode = 0,
            msg = "",
            data = 0;
        if (err !== "error") {
            resCode = 200;
            msg = "请求成功";
            data = resData
        } else {
            resCode = 404;
            msg = "请求失败";
            data = null
        }
        return {
            "resCode": resCode,
            "resStr": msg,
            "data": data
        }
    }
    //执行查询
    var src = req.body.src;
    var squery = "SELECT Code,Name,SurfaceArea,IndepYear,Population FROM country";
    connection.query(squery, function(error, results, fields) {
        if (error) {
            res.send(resStr('error'));
        } else {
//            res.send(resStr(null, results))
            res.send(results)
        }
    });
    connection.end();
})

app.get('/asyncs', function(req, res, next) {
    var taskJson = {
        a: function(cb) {
            cb(null, 'str_a');
        },
        b: function(cb) {
            cb(null, 'str_b');
        },
        c: function(cb) {
            cb(null, 'str_c');
        }
    }
    async.series(taskJson, function(err, result) {
        console.log(result);
        res.end();
    });
});

app.get('/email',function(req,res,next){
    var smtpConfig = {
        host: 'smtp.163.com',
        port: 465,
        auth: {
            user: 'yh4063254@163.com',
            pass: 'APTX4869'
        }
    };
    var transporter =  nodemailer.createTransport(smtpConfig);
    var sendmail = function (html) {
        var option = {
            from: "yh4063254@163.com",
            to: "743472220@qq.com",
            subject: '来自node的邮件',
            html: html,
            attachments:[
                {
                    filename :'photo.gif',
                    path:'http://www.h3bpm.com/uploadfile/1488956248.gif'
                },{
                    filename:'content',
                    content :'发送内容'
                }
            ]
        }
        transporter.sendMail(option, function (error, response) {
            if (error) {
                console.log("fail: " + error);
                res.send(error);
            } else {
                console.log("success: " + response.messageID);
                res.send('ok');
            }
        });
    }

    sendmail("邮件内容：<br/>这是来自nodemailer发送的邮件");
})

app.get('/elma',function(req,res,next){
    console.log(req);
    res.header('Access-Control-Allow-Origin', '*');
    var url = 'https://www.ele.me/restapi/shopping/restaurants';
    var baseHead = {
        "accept":'application/json, text/plain, */*',
        "accept-encoding":"gzip, deflate, br",
        "referer":'https://www.ele.me/place/wm5zbt1gyfv?latitude=29.51543&longitude=106.54811',
        "user-agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.91 Safari/537.36",
        "x-shard":"loc=106.54811,29.51543"
    }
    function setQuery(offset,ids){
        return {
            "extras[]":"activities",
            "geohash":"wm5zbt1gyfv",
            "latitude":"29.51543",
            "limit":"24",
            "longitude":"106.54811",
            "offset":offset,
            "terminal":"web",
            "restaurant_category_ids[]":ids
        }
    }

    request
        .get(url)
        .query(setQuery(req.query.offset,req.query.ids))
        .set(baseHead)
        .end(function(err,sres){
            var s = JSON.parse(sres['text']);
            var outson = [];
            s.some(function(item,k){
                outson.push({
                    'name':item['name'],
                    "piecewise_agent_fee":item['piecewise_agent_fee']['description'],
                    "distance":item['distance'],
                    "phone":item["phone"],
                    "status":item['status'] == 1?"开张":"打烊",
                    "recent_order_num":item['recent_order_num'],
                    "address":item["address"],
                    "url":"https://www.ele.me/shop/"+item['id']
                })
            });
            res.send(outson);
        })
});

//下载图片
app.get('/cs', function (req, res, next) {
    var currDir = path.normalize(req.query.dir),
        fileName = req.query.name,
        currFile = path.join(currDir, fileName),
        fReadStream;
    fs.exists(currFile, function (exist) {
        if (exist) {
            res.set({
                "Content-type": "application/octet-stream",
                "Content-Disposition": "attachment;filename=" + encodeURI(fileName)
            });
            fReadStream = fs.createReadStream(currFile);
            fReadStream.on("data", (chunk) => res.write(chunk, "binary"));
            fReadStream.on("end", function () {
                res.end();
            });
        } else {
            res.set("Content-type", "text/html");
            res.send("file not exist!");
            res.end();
        }
    });
})

app.get('/find', function (req, res, next) {
    res.send({
        hostname:os.hostname(),
        networkInterfaces:os.networkInterfaces(),
        release:os.release(),
        totalmem:os.totalmem()/1024/1024/1024,
        type:os.type(),
        uptime:os.uptime(),
        platform:os.platform(),
        endianness:os.endianness(),
        cpus:os.cpus(),
        freemem:os.freemem()/1024/1024/1024
    });
//    console.log(arch);
})

app.listen(8888, function(req, res) {
    console.log('app is running at port 8888');
});