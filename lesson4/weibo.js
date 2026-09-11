var request = require('superagent');
var express = require('express');
var cheerio = require('cheerio');
var async = require('async');
var fs = require('fs');
var app = express();
var bodyParser = require('body-parser');
var pluginsFun = require("./pluglns/common")

const weiboData = require("./weibo/weibo.json");

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

app.get("/cs", (req, res, next) => {
    const pageParam = req.query;

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

    var pageArr = [];
    for (var i = 5; i <= 200; i++) {
        pageArr[i] = i;
    }

    var pageCallback = [];
    pageArr.forEach((e) => {
        const cbs = (cb) => {
            pluginsFun.superagentFun(base_header, e, "http://weibo.com/p/1005051916825084/home", function (sres, callback) {
                var $ = cheerio.load(sres.text);
                var mc = [];
                var items = [];
                $('script').each(function (k, v) {
                    if (k > 3) {
                        var temp = $('script').eq(k).html();
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
                mc.forEach(function (k, v) {
                    if (mc[v]["domid"] === "Pl_Official_MyProfileFeed__21") {
                        mainStr = mc[v]["html"];
                    }
                });
                $ = cheerio.load(mainStr);
                $(".WB_feed_v4 .WB_feed_like").each(function (ids, ele) {
                    var st = $(ele).find('.media_box');
                    if (st) {
                        st.find("img").each(function (idsa, eele) {
                            var tempUrl = $(eele).attr('src');
                            if (pluginsFun.matchUrl(tempUrl)) {
                                tempUrl = "https:" + pluginsFun.bigImg(tempUrl);
                                items.push({
                                    src: tempUrl
                                });
                            }
                        });
                    }
                });

                items.forEach((e) => {
                    fs.appendFile('./weibo/weibo.json', `${JSON.stringify(e)},`, function (err) {
                        if (err) throw err;
                        //                console.log('The "data to append" was appended to file!');
                    });
                })
                callback(null, items);
            })
            cb(null,"success");
        }
        pageCallback.push(cbs);
    });
    
    async.parallelLimit(pageCallback, 5, (err, results) => {
        console.log(results);
        res.send(results);
    })
})


app.get("/wb",(req,res,next)=>{
    res.send(weiboData);
})
app.listen(9090, function (req, res) {
    console.log('app is running at port 9090');
});


/*wget --no-check-certificate -O shadowsocks.sh https://raw.githubusercontent.com/teddysun/shadowsocks_install/master/shadowsocks.sh 
chmod +x shadowsocks.sh 
./shadowsocks.sh 2>&1 | tee shadowsocks.log*/
