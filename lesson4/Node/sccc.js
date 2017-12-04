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
     
var loginUrl = "https://www.niuplay.net/Index/Index/Login.html";
     var loginBaseheader = {
        "Accept": "application/json, text/javascript, */*; q=0.01",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-CN,zh;q=0.9",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
         "Content-Length":61,
         "Content-Type":"application/x-www-form-urlencoded; charset=UTF-8",
        "Cookie": 'PHPSESSID=19vq0gadf1te9mdmecp5m5j4o0; NIUGAME_think_language=zh-CN',
        "Host": "www.niuplay.net",
         Origin:"https://www.niuplay.net",
        "Pragma":"no-cache",
        "Referer":'https://www.niuplay.net/Index/Index/Login.html',
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36",
        "X-Requested-With":'XMLHttpRequest'
    }

    
    var _url = 'https://www.niuplay.net/UserAjax/SignInDay?t=0.4781838105684555';
    var baseheader = {
        "Accept": "application/json, text/javascript, */*; q=0.01",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-CN,zh;q=0.9",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "Cookie": 'PHPSESSID=19vq0gadf1te9mdmecp5m5j4o0; NIUGAME_think_language=zh-CN',
        "Host": "www.niuplay.net",
        "Pragma":"no-cache",
        "Referer":'https://www.niuplay.net/',
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36",
        "X-Requested-With":'XMLHttpRequest'
    }

    var param = function(){
        return {
            include:'data[*].is_normal,admin_closed_comment,reward_info,is_collapsed,annotation_action,annotation_detail,collapse_reason,collapsed_by,suggest_edit,comment_count,can_comment,content,voteup_count,reshipment_settings,comment_permission,mark_infos,created_time,updated_time,review_info,question,excerpt,relationship.is_authorized,voting,is_author,is_thanked,is_nothelp,upvoted_followees;data[*].author.badge[?(type=best_answerer)].topics',
            offset:20,
            limit:20,
            sort_by:'created'
        }
    }
    var loginJon = function () {
        return {
            "username": "76659978",
            "password": "921210",
            "auto_login": 1
        }
    }
    
    request
        .post(loginUrl)
        .send(loginJon())
        .end(function(err,sres){
            if(err){
                console.log('err');
                return next(err);
            }else{
                console.log(sres.text)
//                request
//                    .get(_url)
//                    .set(baseheader)
//                    .end(function(err,ss){
//                        if(err){
//                            console.log('err');
//                            return next(err);
//                        }else{
//                            res.send(ss.text)
//                        }
//                    })
            }
        })
        