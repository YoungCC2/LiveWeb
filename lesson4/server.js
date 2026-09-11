var request = require('superagent');
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

// Authentication headers must be supplied through environment variables.
//        Host: 'www.zhihu.com',
//        Origin: 'https://www.zhihu.com',
//        Pragma: 'no-cache',
//        Referer: 'https://www.zhihu.com/',
//        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36',
//        'X-Requested-With': 'XMLHttpRequest',
//        'X-Xsrftoken': '8273a28f-ebe9-4c36-bf93-1c60bb68b7fb'
//    }
//
//    Authentication data must be supplied through environment variables.
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
        host: process.env.MYSQL_HOST || '127.0.0.1',
        port: Number(process.env.MYSQL_PORT || 3306),
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE || 'world'
    });
    var base_header = {
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'zh-CN,zh;q=0.8',
        'Connection': 'keep-alive',
        'Cache-Control': 'max-age=0',
        Cookie: process.env.WEIBO_COOKIE || "",
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
            Cookie: process.env.ZHIHU_COOKIE || "",
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
        host: process.env.MYSQL_HOST || '127.0.0.1',
        port: Number(process.env.MYSQL_PORT || 3306),
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.ZHIHU_MYSQL_DATABASE || 'zjh'
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
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 465),
        secure: process.env.SMTP_SECURE !== 'false',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD
        }
    };
    var transporter =  nodemailer.createTransport(smtpConfig);
    var sendmail = function (html) {
        var option = {
            from: process.env.MAIL_FROM || process.env.SMTP_USER,
            to: process.env.MAIL_TO,
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


app.post("/",(req,res,next)=>{
    res.send({
        port:"8888",
        sc:"sc"
    })
})
app.listen(8888, function(req, res) {
    console.log('app is running at port 8888');
});
