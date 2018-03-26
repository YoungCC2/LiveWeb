const request = require('superagent');
const express = require('express');
const cheerio = require('cheerio');
const async = require('async');
const path = require('path');
const fs = require('fs');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());


app.get('/result_list', function(req, res, next) {

    const url = "https://movie.douban.com/awards/doubanfilm_annual/4/nominees?qq-pf-to=pcqq.c2c";
    const base_header = {
        "Host": "movie.douban.com",
        "Connection": "keep-alive",
        "Cache-Control": "max-age=0",
        "Upgrade-Insecure-Requests": 1,
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-CN,zh;q=0.9",
        "Cookie": 'bid=5hI5NKF7SOc; _pk_ses.100001.4cf6=*; __utma=30149280.2068144489.1522056382.1522056382.1522056382.1; __utmc=30149280; __utmz=30149280.1522056382.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); __utmt=1; ll="108309"; __utma=223695111.741874987.1522056425.1522056425.1522056425.1; __utmb=223695111.0.10.1522056425; __utmc=223695111; __utmz=223695111.1522056425.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); _pk_id.100001.4cf6=7e876ee64fd47d07.1522056382.1.1522056574.1522056382.; __utmb=30149280.3.10.1522056382'
    }
    const resarr = [];
    resarr.push('s')
    // request
    //     .get(url)
    //     .set(base_header)
    //     .query({})
    //     .end(function (err, sres) {
    //         const $ = cheerio.load(sres.text);
    //         const resarr = [];
    //         $(".result_list").find(".levl2").map((item,index)=>{
    //             $(index).find(".rslt_wrap ul li").map((key, v)=>{
    //                     resarr.push({
    //                         title:$(index).find("h3").text(),
    //                         detail:{
    //                             href:$(v).find(".r_main a").attr("href"),
    //                             mov:$(v).find(".r_main a").text()
    //                         }
    //                     })
    //             })
    //         })

            fs.writeFile('./resarr.json', resarr, function(err) {
                if (err) {
                    throw err;
                } else {
                    console.log('success');
                    // callback(null, "successful !");
                }
            });
    //     })
})


app.listen(8888, function(req, res) {
    console.log('app is running at port 8888');
});