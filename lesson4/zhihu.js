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
var bodyParser = require('body-parser');
var events = require("events");
var open = require("open");
var schedule = require("node-schedule");
var nodemailer = require('nodemailer');

var emitter = new events.EventEmitter()

//setCookeie();
//emitter.on("setCookeie", getTitles)            //监听setCookeie事件


app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.text());
app.use(bodyParser.json());
app.get('/', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    var _url = 'https://www.zhihu.com/api/v4/members/excited-vczh/answers';
    var baseheader = {
        "Accept": "application/json, text/plain, */*",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-CN,zh;q=0.8",
        "authorization":"Bearer Mi4xYzhZTEFBQUFBQUFBUU1LN1k1cG5EQmNBQUFCaEFsVk44dnpXV2dBMlNtelRWR1E0dTcycmt0N0tfeklONUFLRVB3|1508486898|e8955da2622f0a316c412061a10a824933e2a98c",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "Cookie": '_zap=1d25596d-92d8-4c50-ab58-bebcb79e4fe1; q_c1=5dd9c07d1d8544dab377e6eca1a91f5c|1505876343000|1505876343000; d_c0="AEDCu2OaZwyPTkFdLWgkHyfNqqT7-RRU2QU=|1505891115"; _ga=GA1.2.1072563680.1506499063; r_cap_id="YWRmYjJiNzFiZjk5NGQ3MWEyOWFhYjM2ZDBjYzdiMDY=|1508486891|a87cc7ed481727ffc0432438640a3e959cfce64d"; cap_id="MWI5ZjA3NGJiNmE0NGIzN2I0NGEyYTI3MWY3MTllMzE=|1508486891|fbeb5bdbb0ee0107457fcd4ef3924ac6894d6973"; z_c0=Mi4xYzhZTEFBQUFBQUFBUU1LN1k1cG5EQmNBQUFCaEFsVk44dnpXV2dBMlNtelRWR1E0dTcycmt0N0tfeklONUFLRVB3|1508486898|e8955da2622f0a316c412061a10a824933e2a98c; q_c1=5dd9c07d1d8544dab377e6eca1a91f5c|1508737686000|1505876343000; __utma=51854390.1072563680.1506499063.1509949933.1510020512.12; __utmz=51854390.1510020512.12.10.utmcsr=zhihu.com|utmccn=(referral)|utmcmd=referral|utmcct=/; __utmv=51854390.100-1|2=registration_date=20130507=1^3=entry_date=20130507=1; aliyungf_tc=AQAAAH7tCS/D5AEAlV5pDvKHYlSPZmx/; _xsrf=bde6f296-e4c5-4665-938b-488cdf20fb55',
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
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Content-Type", "application/json;charset=utf-8");
    console.log( 'ajax' , req.body );
    var resp = {
        "msg":'请求成功',
        "id":"1",
        "name":"req.body.name"
    }
    res.end(JSON.stringify(resp))  //回应浏览器
})


app.get('/nb',function(req,res,next){
    open("https://www.niuplay.net/", "firefox"); //耀东
    open("https://www.niuplay.net/", "chrome"); //晓东
    var _url = 'https://www.niuplay.net/UserAjax/SignInDay?t=0.4781838105684555';
    var baseheader = {
        "Accept": "application/json, text/javascript, */*; q=0.01",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-CN,zh;q=0.9",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "Cookie": 'PHPSESSID=19vq0gadf1te9mdmecp5m5j4o0; NIUGAME_think_language=zh-CN; _gat=1; NIUGAME_DIFUEIJSD=a49dcdf7dde74877a52e4659731fa631; _ga=GA1.2.84060275.1511506135; _gid=GA1.2.440742571.1511759961',
        "Host": "www.niuplay.net",
        "Pragma": "no-cache",
        "Referer": 'https://www.niuplay.net/',
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36",
        "X-Requested-With": 'XMLHttpRequest'
    }
    var XDDDDbaseheader = {
        "Accept": "application/json, text/javascript, */*; q=0.01",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-CN,zh;q=0.9",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "Cookie": 'NIUGAME_think_language=zh-CN; PHPSESSID=m88r3u43f77133t7g8rvc89j85; _ga=GA1.2.1649831064.1512008753; _gid=GA1.2.1723359070.1512008753; _gat=1; NIUGAME_DIFUEIJSD=54de7f9457856b87f34233a83de37765',
        "Host": "www.niuplay.net",
        "Pragma": "no-cache",
        "Referer": 'https://www.niuplay.net/',
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36",
        "X-Requested-With": 'XMLHttpRequest'
    }
    var count = 0;
    setTimeout(function(){
        request
        .get(_url)
        .set(XDDDDbaseheader)
        .end(function (err, ss) {
            if (err) {
                console.log('err');
                return next(err);
            } else {
                count++;
                console.log("耀东",count,ss.text);
                if (count == 2) {
                    res.send('所有请求完毕')
                }
            }
        })
    },5000)
    setTimeout(function(){
        request
        .get(_url)
        .set(baseheader)
        .end(function (err, ss) {
            if (err) {
                console.log('err');
                return next(err);
            } else {
                count++;
                console.log("晓东",count,ss.text);
                if (count == 2) {
                    res.send('所有请求完毕')
                }
            }
        })
    },5000)
    
    
});
app.get('/net',function(req,res,next){
    var _url = 'http://music.163.com/weapi/point/dailyTask?csrf_token=2d3fc4aaf219f561b0b598c4bef8af97';
    var baseheader = {
        "Accept": "application/json, text/javascript, */*; q=0.01",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-CN,zh;q=0.9",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "Content-Length":"410",
        "Content-Type":"application/x-www-form-urlencoded",
        "Cookie": 'JSESSIONID-WYYY=ml8%2Fb674N9DdP3xk%5Cp7fubW7IMdB18m2rvBwRPFqCzjgaMhhu4%5C3F%2FtkDHF9d3OJfSkTJR04Jta%2B7ttBzgDCBCWfn822Bhj51TSX8k3sJMNBfyGHA7BQxxSToVYTZ2gTwpBj%5CfZnTkitH7aa8a%2FyPdp4xZckGrwt4I0VnzcH8wdbAzpj%3A1511172962906; _iuqxldmzr_=32; _ntes_nnid=6fc3b1bb93daf2ea239a0f115276697f,1511171162937; _ntes_nuid=6fc3b1bb93daf2ea239a0f115276697f; __remember_me=true; MUSIC_U=93181d58e76bc8684b776ba7d9000ba337ec05c0e61b284fa5fad1e08ee7da7bec419a81eb06bd7eeb42834e2608436941049cea1c6bb9b6; __csrf=2d3fc4aaf219f561b0b598c4bef8af97; __utma=94650624.1121442284.1511171163.1511171163.1511171163.1; __utmb=94650624.6.10.1511171163; __utmc=94650624; __utmz=94650624.1511171163.1.1.utmcsr=baidu|utmccn=(organic)|utmcmd=organic',
        "Host": "music.163.com",
        "Origin":"http://music.163.com",
        "Pragma":"no-cache",
        "Referer":'http://music.163.com/discover',
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36"
    }

    var param = function(){
        return {
            params:'o50oV3MhU2SdBkeNVeIQoega9qP4BpjXGa+xeKB+1+tUxRSSPsQdpPoRSp1Sex46DijUsTKz9zTR7j/bakWFLmJiFTP3metIVmdbe7Za8U3dHa5HGyq07KRtAy6X6301',
            encSecKey:'b0945f2363118d1514723cf494c42ebee9e4f616c4b5851c63dc719b8e2aaf3aa620a1964d5cee60d2305fea35ea7d09a3a6f602ad61b8f133b8d486aac5abcaad33b70e4aa3f9c89dbcc9c170826cd17781356ec2c568238c15bfb0396c35f8eb17d5c9a911450035be471e0206472b2b4189977c08cb6c6ece745b3fe2ae23'
        }
    }
    request
        .post(_url)
        .set(baseheader)
        .send(param())
        .end(function(err,sres){
            if(err){
                console.log('err');
                return next(err);
            }else{
                res.send(sres.text)
            }
        })

})

app.get('/down',function(){
    res.send(filesss);
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
    host: 'smtp.163.com',
    port: 465,
    auth: {
        user: 'yh4063254@163.com',
        pass: 'APTX4869'
    }
};
var transporter = nodemailer.createTransport(smtpConfig);
var sendmail = function (html) {
    var option = {
        from: "yh4063254@163.com",
        to: "743472220@qq.com",
        subject: '来自node的邮件',
        html: html,
        attachments: []
    }
    transporter.sendMail(option, function (error, response) {
        if (error) {
            console.log("fail: " + error);
        } else {
            console.log("success: " + response.messageID);
        }
    });
}
var rule = new schedule.RecurrenceRule();
rule.hour =10;rule.minute =26;rule.second =0;
schedule.scheduleJob(rule, function () {　　
    open("https://www.niuplay.net/", "firefox"); //耀东
    open("https://www.niuplay.net/", "chrome"); //晓东
    var _url = 'https://www.niuplay.net/UserAjax/SignInDay?t=0.4781838105684555';
    var baseheader = {
        "Accept": "application/json, text/javascript, */*; q=0.01",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-CN,zh;q=0.9",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "Cookie": 'PHPSESSID=19vq0gadf1te9mdmecp5m5j4o0; NIUGAME_think_language=zh-CN; _gat=1; NIUGAME_DIFUEIJSD=a49dcdf7dde74877a52e4659731fa631; _ga=GA1.2.84060275.1511506135; _gid=GA1.2.440742571.1511759961',
        "Host": "www.niuplay.net",
        "Pragma": "no-cache",
        "Referer": 'https://www.niuplay.net/',
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36",
        "X-Requested-With": 'XMLHttpRequest'
    }
    var XDDDDbaseheader = {
        "Accept": "application/json, text/javascript, */*; q=0.01",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-CN,zh;q=0.9",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "Cookie": 'NIUGAME_think_language=zh-CN; PHPSESSID=m88r3u43f77133t7g8rvc89j85; _ga=GA1.2.1649831064.1512008753; _gid=GA1.2.1723359070.1512008753; _gat=1; NIUGAME_DIFUEIJSD=54de7f9457856b87f34233a83de37765',
        "Host": "www.niuplay.net",
        "Pragma": "no-cache",
        "Referer": 'https://www.niuplay.net/',
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36",
        "X-Requested-With": 'XMLHttpRequest'
    }
    function requestUrl(baseHeader,cb){
        request
        .get(_url)
        .set(baseHeader)
        .end(function (err, ss) {
            if (err) {
                console.log('err');
                return next(err);
            } else {
                cb(null, 'str_b');
                console.log("成功一条",ss.text);
                
            }
        })
    }
    var headerArr = [baseheader,XDDDDbaseheader];
    function res(num) {
        async.mapLimit(headerArr, num, function (item, callback) {
            requestUrl(item, callback)
        },function(err,result){
              if (err) {
                console.log(err);
                sendmail("邮件内容：<br/>签到失败!"+new Date().toString())
            } else {
                console.log("全部已爬取完毕！");
                sendmail("邮件内容：<br/>全部签到完毕!"+new Date().toString())
            }
        });
    }
    setTimeout(function () {
        res(2);
    }, 5000)
    
    
});

//app.listen(3000, function(req, res) {
//    console.log('app is running at port 3000');
//});




