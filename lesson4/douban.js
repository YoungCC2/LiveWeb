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
        "Cookie": process.env.DOUBAN_COOKIE || ""
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