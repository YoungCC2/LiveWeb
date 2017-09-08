var request = require('superagent');
var est = require("request");
var express = require('express');
var utility = require('utility');
var cheerio = require('cheerio');
var eventproxy = require('eventproxy');
var mkdirp = require('mkdirp');
var fs = require('fs');  
var app = express();
var conf = require('./conf.json');
var imgSrc = require('./src.json');
var cookir ;
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
        Cookie: 'q_c1=f17d446552694d5fbbf0af2ab7619a0a|1504753247000|1504753247000; d_c0="AJBCKcWlVgyPTvVdkjkV8YLnZgvgvUcZpSE=|1504753248"; _zap=d719f1f5-26c3-4d96-94a0-b4c90e5c8859; r_cap_id="NjhlNWYzNDgwMWZiNDJlNGJkNGNkZDBhNTgwNjEzNmI=|1504753993|0e70a70a135f80b938a4f5c5b1302becefcaeefc"; cap_id="ZTBhOGI3NjZkYzIyNGY1YzgxYTVlNjhhOTFkMDkwY2M=|1504753993|79abac452198f777371b1c977310c7288d113c78"; z_c0=Mi4xYzhZTEFBQUFBQUFBa0VJcHhhVldEQmNBQUFCaEFsVk5UMGpZV1FDRWRKajUzZlhjRV9fZjlIcFNuSUtMa3NOcTFR|1504754511|065c87cce59c0589bcbffd22c14cef97450d09f1; aliyungf_tc=AQAAACB1ohSpiAUAY6dVfS/yvIMAh4Zh; __utma=51854390.1519459293.1504753249.1504774315.1504834535.6; __utmb=51854390.0.10.1504834535; __utmc=51854390; __utmz=51854390.1504834535.6.5.utmcsr=zhihu.com|utmccn=(referral)|utmcmd=referral|utmcct=/; __utmv=51854390.100-1|2=registration_date=20130507=1^3=entry_date=20130507=1; _xsrf=a62366c8-a88c-456c-8024-df276212f00c',
        Host: 'www.zhihu.com',
        Referer: 'https://www.zhihu.com/',
        'Upgrade-Insecure-Requests': 1,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36'
    }
    var items = [];
    function req(i) {
        var url = 'https://www.zhihu.com/collection/61913303?page=' + i;
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
                    items.push({
                        title: $toggle.attr('href')
                    });
                });
                fs.writeFile('./test2.json', JSON.stringify(items), function (err) {
                    if (err) {
                        throw err;
                    } else {
                        console.log(i);
                    }
                });
                if(i==116){
                    res.send('ok');
                }else{
                    i++;
                    req(i);
                }
            });
    }
    req(1);

});

app.get('/img', function (req, res, next) {
    var baseheader = {
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'zh-CN,zh;q=0.8',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        Cookie: 'q_c1=f17d446552694d5fbbf0af2ab7619a0a|1504753247000|1504753247000; d_c0="AJBCKcWlVgyPTvVdkjkV8YLnZgvgvUcZpSE=|1504753248"; _zap=d719f1f5-26c3-4d96-94a0-b4c90e5c8859; r_cap_id="NjhlNWYzNDgwMWZiNDJlNGJkNGNkZDBhNTgwNjEzNmI=|1504753993|0e70a70a135f80b938a4f5c5b1302becefcaeefc"; cap_id="ZTBhOGI3NjZkYzIyNGY1YzgxYTVlNjhhOTFkMDkwY2M=|1504753993|79abac452198f777371b1c977310c7288d113c78"; z_c0=Mi4xYzhZTEFBQUFBQUFBa0VJcHhhVldEQmNBQUFCaEFsVk5UMGpZV1FDRWRKajUzZlhjRV9fZjlIcFNuSUtMa3NOcTFR|1504754511|065c87cce59c0589bcbffd22c14cef97450d09f1; aliyungf_tc=AQAAACB1ohSpiAUAY6dVfS/yvIMAh4Zh; anc_cap_id=bbfe20f016e74449b25db35c22eed358; __utma=51854390.1519459293.1504753249.1504850713.1504852601.9; __utmc=51854390; __utmz=51854390.1504852601.9.8.utmcsr=zhihu.com|utmccn=(referral)|utmcmd=referral|utmcct=/collections; __utmv=51854390.100-1|2=registration_date=20130507=1^3=entry_date=20130507=1; _xsrf=a62366c8-a88c-456c-8024-df276212f00c',
        Host: 'www.zhihu.com',
        Pragma: 'no-cache',
        'Upgrade-Insecure-Requests': 1,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36'
    }
    var topicUrls = conf;
    function df(){
        var data = [];
        topicUrls.forEach(function (topicUrl, k) {
            if (topicUrl['title']) {
                topicUrl = topicUrl['title'] + '';
                if (topicUrl.slice(0, 1) === '/') {
                    topicUrl = 'https://www.zhihu.com' + topicUrl;
                }
                data[k] = topicUrl;
            }
        });
        return data;
    }
    df();
    var items = [];
    function req(i) {
        if (df()[i]) {
            request
                .get(df()[i])
                .set(baseheader)
                .end(function (err, sres) {
                    if (err) {
                        console.log(i);
                        req(i);
                        //                        return next(err);
                    } else {
                        var $ = cheerio.load(sres.text);
                        $(".Question-mainColumn .QuestionAnswer-content .RichContent-inner noscript img").each(function (indx, ele) {
                            var $ele = $(ele);
                            items.push({
                                src: $ele.attr('data-original')
                            });
                        })
                        fs.writeFile('./src02.json', JSON.stringify(items), function (err) {
                            if (err) {
                                throw err;
                            } else {
                                console.log(df()[i],i);
                            }
                        });
                        if (i == 1200) {
                            res.send('ok');
                            return 0;
                        } else {
                            i++;
                            return setTimeout(function () {
                                req(i);
                            }, 2000)
                        }
                    }
                })
        } else {
            i++;
            return setTimeout(function () {
                req(i);
            }, 2000)
        }
    }
    req(0);
})

app.get('/downloadImg',function(req, res, next){
    var Uurl = imgSrc;
    
    //本地存储目录
	var dir = './images';
	 
	//创建目录
	mkdirp(dir, function(err) {
		if(err){
			console.log(err);
		}
	});

    var download = function(url, dir, filename){
		/*est.head(url, function(err, res, body){
            if (!err && res.statusCode == 200) {
                est(url).pipe(fs.createWriteStream(dir + "/" + filename));
            }else if(err){
                console.log('sd');
                return next(err);
            }
		});*/
        request
            .get(url)
            .end(function (err, sres) {
                request(url).pipe(fs.createWriteStream(dir + "/" + filename));
            })
	};
    Uurl.forEach(function (src) {
        if(src['src']){
            src['src'] = src['src']+'';
            download(src['src'], dir, src['src'].substr(-38,32) + src['src'].substr(-4, 4));
            console.log('下载完成',src['src'].substr(-38,32));

        }
    });
});



app.listen(3000, function (req, res) {
    console.log('app is running at port 3000');
});