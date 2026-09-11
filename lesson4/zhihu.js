var request = require('superagent');
var express = require('express');
var cheerio = require('cheerio');
var eventproxy = require('eventproxy');
var mkdirp = require('mkdirp');
var async = require('async');
var path = require('path');
var fs = require('fs');
var app = express();
var bodyParser = require('body-parser');
var events = require("events");
var open = require("open");
var schedule = require("node-schedule");
var nodemailer = require('nodemailer');
var child_process = require('child_process')
var emitter = new events.EventEmitter()
var { createClient } = require("redis");
var client = createClient({
    url: process.env.REDIS_URL || 'redis://127.0.0.1:6379/0'
});
//setCookeie();
//emitter.on("setCookeie", getTitles)            //监听setCookeie事件

var session = require('express-session');
var { RedisStore } = require('connect-redis');

client.on("error", function (err) {
    console.log("Error " + err);
});
client.connect().catch(function (err) {
    console.log("Redis connection error " + err);
});


app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.text());
app.use(bodyParser.json());

if (!process.env.SESSION_SECRET) {
    throw new Error('SESSION_SECRET is required');
}

app.use(session({
    store: new RedisStore({
        client: client,
        "ttl" : 3600, //秒 3600秒 1小时
     }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));



//设置session
app.post("/setSe",(req,res,next)=>{
    client.set("foo_rand000000000000", "OK");
    res.send("s");
})

//获取session
app.get("/sc",(req,res,next)=>{
    client.get("foo_rand000000000000", function (err, reply) {
        console.log(reply.toString()); // Will print `OK`
    });
    res.send("sdsd");
})



app.get('/', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    var _url = 'https://www.zhihu.com/api/v4/members/excited-vczh/answers';
    var baseheader = {
        "Accept": "application/json, text/plain, */*",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-CN,zh;q=0.8",
        "authorization": process.env.ZHIHU_AUTHORIZATION || "",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "Cookie": process.env.ZHIHU_COOKIE || "",
        "Host": "www.zhihu.com",
        "Pragma":"no-cache",
        "Referer":'https://www.zhihu.com/people/excited-vczh/answers?page=2',
        "Upgrade-Insecure-Requests": 1,
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36",
        "X-UDID":'AEDCu2OaZwyPTkFdLWgkHyfNqqT7-RRU2QU='
    }

    var param = function(pages){
        return {    
           include:'data[*].is_normal,admin_closed_comment,reward_info,is_collapsed,annotation_action,annotation_detail,collapse_reason,collapsed_by,suggest_edit,comment_count,can_comment,content,voteup_count,reshipment_settings,comment_permission,mark_infos,created_time,updated_time,review_info,question,excerpt,relationship.is_authorized,voting,is_author,is_thanked,is_nothelp,upvoted_followees;data[*].author.badge[?(type=best_answerer)].topics',
            offset:pages,
            limit:20,
            sort_by:'created'
        }
    }
    var topicUrls = [1,2,3,4,5,6,7,8,9,10];
    var requestFun = function(num,callback){
        request
            .get(_url)
            .set(baseheader)
            .query(param(num))
            .end(function(err,sres){
                if(err){
                    console.log('err');
                    return next(err);
                }else{
                    var resData = JSON.parse(sres.text);
                    var question = [];
                    var totals = resData.paging.totals; //所有消息数
                    var totalPage = totals%20 === 0 ? parseInt(totals/20) : parseInt(totals/20+1); //所有页数
                    resData.data.map(function(k,v){
                        question.push({
                            title:k['question']['title'],
                            url:k['question']['url'],
                            content:{
                                s:k['content']
                            }
                        })
                    })
                    
                    if(num==9){
                        res.send(question)
                    }else{
                        callback(null, "successful !");
                    }

                }
            })
       
    }
    
    
    var awaits = function(num){
        async.mapLimit(topicUrls, num, function(item, callback) {
            console.log("已开始爬取" + item + "页");
            requestFun(item*20, callback);
        }, function(err, result) {
            if (err) {
                console.log(err);
            } else {
                res.send('ok');
                console.log("全部已爬取完毕！");
            }
        });
    }
    awaits(1);

})


app.post('/test',function(req, res, next){
//    res.header('Access-Control-Allow-Origin', '*');
//    res.header("Content-Type", "application/json;charset=utf-8");
//    console.log( 'ajax' , req.body );
//    var resp = {
//        "msg":'请求成功',
//        "id":"1",
//        "name":"req.body.name"
//    }
//    res.end(JSON.stringify(resp))  //回应浏览器
        function bilibili() {
        var _url = 'https://api.live.bilibili.com/sign/doSign';
        var baseheader = {
            "Accept": "application/json, text/plain, */*",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "zh-CN,zh;q=0.9",
            "Connection": "keep-alive",
            "Cookie": process.env.BILIBILI_COOKIE || "",
            "Host": "api.live.bilibili.com",
            "Origin": "https://live.bilibili.com",
            "Referer": 'https://live.bilibili.com/p/eden/area-tags',
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36"
        }

        var param = function () {
            return {
                params: 'o50oV3MhU2SdBkeNVeIQoega9qP4BpjXGa+xeKB+1+tUxRSSPsQdpPoRSp1Sex46DijUsTKz9zTR7j/bakWFLmJiFTP3metIVmdbe7Za8U3dHa5HGyq07KRtAy6X6301',
                encSecKey: 'b0945f2363118d1514723cf494c42ebee9e4f616c4b5851c63dc719b8e2aaf3aa620a1964d5cee60d2305fea35ea7d09a3a6f602ad61b8f133b8d486aac5abcaad33b70e4aa3f9c89dbcc9c170826cd17781356ec2c568238c15bfb0396c35f8eb17d5c9a911450035be471e0206472b2b4189977c08cb6c6ece745b3fe2ae23'
            }
        }
        request
            .get(_url)
            .set(baseheader)
            .end(function (err, sres) {
                if (err) {
                    console.log('err');
                    return next(err);
                } else {
                    console.log(sres.text)
                }
            })
    }
    
    bilibili();
    
})


app.get('/nb', function (req, res, next) {
    open("https://www.niuplay.net/", "firefox"); //耀东
//    open("https://www.niuplay.net/", "chrome"); //晓东
//    child_process.exec("D:\\360Brower\\360Chrome\\Chrome\\Application\\360chrome.exe  https://www.niuplay.net/");
    const _url = 'https://www.niugamevip.com/UserAjax/SignInDay?t=0.23646105944909923';
    const baseheader = {
        "Accept": "application/json, text/javascript, */*; q=0.01",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-CN,zh;q=0.9",
        "Connection": "keep-alive",
        "Content-Length":0,
        "Cookie": process.env.NIUGAME_COOKIE || "",
        "Host": "www.niugamevip.com",
        "Origin":"https://www.niugamevip.com",
        "Referer": 'https://www.niugamevip.com/',
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36",
        "X-Requested-With": 'XMLHttpRequest'
    }
    //76659978
    //921210


    //l206xd   money514
    request
        .get(_url)
        .set(baseheader)
        .end(function (err, ss) {
            if (err) {
                console.log('err');
                return next(err);
            } else {
                res.send(ss.text);
            }
        })
});
app.get('/net', function (req, res, next) {
    var _url = 'https://api.live.bilibili.com/sign/doSign';
    var baseheader = {
        "Accept": "application/json, text/plain, */*",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-CN,zh;q=0.9",
        "Connection": "keep-alive",
        "Cookie": process.env.BILIBILI_COOKIE || "",
        "Host": "api.live.bilibili.com",
        "Origin": "https://live.bilibili.com",
        "Referer": 'https://live.bilibili.com/p/eden/area-tags',
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36"
    }

    var param = function () {
        return {
            params: 'o50oV3MhU2SdBkeNVeIQoega9qP4BpjXGa+xeKB+1+tUxRSSPsQdpPoRSp1Sex46DijUsTKz9zTR7j/bakWFLmJiFTP3metIVmdbe7Za8U3dHa5HGyq07KRtAy6X6301',
            encSecKey: 'b0945f2363118d1514723cf494c42ebee9e4f616c4b5851c63dc719b8e2aaf3aa620a1964d5cee60d2305fea35ea7d09a3a6f602ad61b8f133b8d486aac5abcaad33b70e4aa3f9c89dbcc9c170826cd17781356ec2c568238c15bfb0396c35f8eb17d5c9a911450035be471e0206472b2b4189977c08cb6c6ece745b3fe2ae23'
        }
    }
    request
        .get(_url)
        .set(baseheader)
        .end(function (err, sres) {
            if (err) {
                console.log('err');
                return next(err);
            } else {
                res.send(sres.text)
            }
        })

})

app.get('/down',function(req, res, next){
    res.header('Access-Control-Allow-Origin', '*');
            request
            .post("http://safone.iok.la:6666/image/webAsk")
            .set({
                'Content-Type': 'application/json;charset=UTF-8'
            })
            .send({
          "askMessage":"1"
        })
            .end(function (err, sres) {
                res.send(JSON.parse(sres.text))
            })
    
})



/*var rule = new schedule.RecurrenceRule();
rule.second = 10;
这是每当秒数为10时打印时间。如果想每隔10秒执行，设置 rule.second =[0,10,20,30,40,50]即可。
rule支持设置的值有second,minute,hour,date,dayOfWeek,month,year
同理:
每秒执行就是rule.second =[0,1,2,3......59]
每分钟0秒执行就是rule.second =0
每小时30分执行就是rule.minute =30;rule.second =0;
每天0点执行就是rule.hour =0;rule.minute =0;rule.second =0;
....
每月1号的10点就是rule.date =1;rule.hour =10;rule.minute =0;rule.second =0;
每周1，3，5的0点和12点就是rule.dayOfWeek =[1,3,5];rule.hour =[0,12];rule.minute =0;rule.second =0;*/


var smtpConfig = {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 465),
    secure: process.env.SMTP_SECURE !== 'false',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    }
};
var transporter = nodemailer.createTransport(smtpConfig);
var sendmail = function (html) {
    var option = {
        from: process.env.MAIL_FROM || process.env.SMTP_USER,
        to: process.env.MAIL_TO,
        subject: '来自node的邮件',
        html: html,
        attachments: []
    }
    transporter.sendMail(option, function (error, response) {
        if (error) {
            console.log("fail: " + error);
        } else {
//            console.log("success: " + response.messageID);
        }
    });
}
var rule = new schedule.RecurrenceRule();
rule.hour =0;
rule.minute =0;
rule.second =0;


console.log(rule);
// schedule.scheduleJob(rule, function () {
// //    child_process.exec("D:\\360Brower\\360Chrome\\Chrome\\Application\\360chrome.exe  https://www.niuplay.net/");
//     //网易云签到
//     function netest(callback) {
//         var _url = 'http://music.163.com/weapi/point/dailyTask?csrf_token=2d3fc4aaf219f561b0b598c4bef8af97';
//         var baseheader = {
//             "Accept": "application/json, text/javascript, */*; q=0.01",
//             "Accept-Encoding": "gzip, deflate, br",
//             "Accept-Language": "zh-CN,zh;q=0.9",
//             "Cache-Control": "no-cache",
//             "Connection": "keep-alive",
//             "Content-Length": "410",
//             "Content-Type": "application/x-www-form-urlencoded",

// Cookie must be supplied through environment variables.
//             "Host": "music.163.com",
//             "Origin": "http://music.163.com",
//             "Pragma": "no-cache",
//             "Referer": 'http://music.163.com/discover',
//             "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36"
//         }

//         var param = function () {
//             return {
//                 params: 'o50oV3MhU2SdBkeNVeIQoega9qP4BpjXGa+xeKB+1+tUxRSSPsQdpPoRSp1Sex46DijUsTKz9zTR7j/bakWFLmJiFTP3metIVmdbe7Za8U3dHa5HGyq07KRtAy6X6301',
//                 encSecKey: 'b0945f2363118d1514723cf494c42ebee9e4f616c4b5851c63dc719b8e2aaf3aa620a1964d5cee60d2305fea35ea7d09a3a6f602ad61b8f133b8d486aac5abcaad33b70e4aa3f9c89dbcc9c170826cd17781356ec2c568238c15bfb0396c35f8eb17d5c9a911450035be471e0206472b2b4189977c08cb6c6ece745b3fe2ae23'
//             }
//         }
//         request
//             .post(_url)
//             .set(baseheader)
//             .send(param())
//             .end(function (err, sres) {
//                 if (err) {
//                     console.log('err');
//                     callback(null,"丁三石你大爷.签到失败109")
//                     return next(err);
//                 } else {
//                     callback(null,"丁三石你大爷.签到成功109"+JSON.stringify(sres.text))
//                 }
//             })
//     }
//     //B站签到
//     function bilibili(callback) {
//         var _url = 'https://api.live.bilibili.com/sign/doSign';
//         var baseheader = {
//             "Accept": "application/json, text/plain, */*",
//             "Accept-Encoding": "gzip, deflate, br",
//             "Accept-Language": "zh-CN,zh;q=0.9",
//             "Connection": "keep-alive",

// Cookie must be supplied through environment variables.
//             "Host": "api.live.bilibili.com",
//             "Origin": "https://live.bilibili.com",
//             "Referer": 'https://live.bilibili.com/p/eden/area-tags',
//             "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36"
//         }


//         request
//             .get(_url)
//             .set(baseheader)
//             .end(function (err, sres) {
//                 if (err) {
//                     console.log('err');
//                     callback(null,"死肥宅.签到失败109")
//                     return next(err);
//                 } else {
//                     console.log(sres.text);
//                     callback(null,"死肥宅签到成功109"+JSON.stringify(sres.text));
                    
//                 }
//             })
        
        
//     }

//     async.series([netest, bilibili], (err, result) => {
//         if (err) {
//             console.log(err);
//         }
//         let str = '';
//         result.forEach((item)=>{
//             str = str + item + "<br/>";
//         });
//         console.log(str);
//         sendmail("邮件内容：<br/>全部签到完毕!<hr/>" + new Date().toString() +"<hr/>"+str )
//     })
    
// });



//hyhycx 
//a123456


app.listen(3000, function(req, res) {
   console.log('app is running at port 3000');
});
