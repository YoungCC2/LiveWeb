//http://news.maxjia.com/bbs/app/api/web/share?link_id=3442720

var request = require('superagent');
var express = require('express');
var cheerio = require('cheerio');
var async = require('async');
var fs = require('fs');
var app = express();
var bodyParser = require('body-parser');
var path = require("path");
const querystring = require('querystring');
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

app.all('*', function (req, res, next) { // console.log('跨域请求');
    //跨域传递cookie 当他设置为true的时候  Access-Control-Allow-Origin不能设置为* 必须是指定的IP或者域名
    //1.
    // res.header('Access-Control-Allow-Origin', 'http://10.244.250.228:3000');
    // res.header('Access-Control-Allow-Credentials','true');
    //2.
    res.header('Access-Control-Allow-Origin', `*`);
    // res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Headers', 'Origin,Content-Type,Accept,token,X-Requested-With');
    res.header('Access-Control-Allow-Methods', 'POST, GET');
    res.header('X-XSS-Protection', '1; mode=block');
    res.header('Strict-Transport-Security', 'max-age=7776000;includeSubDomains');
    res.header('X-Frame-Options', 'SAMEORIGIN');
    res.header('X-Content-Type-Options', 'nosniff');
    if (req.method == 'OPTIONS') {
        res.sendStatus(200); //让options请求快速返回
    } else {
        next()
    }
});



app.post("/link", (req, res, next) => {
    const params = {
        ...req.body
    }

    var url = params["link"];
    var linkid = querystring.parse(path.parse(url).name)["share?link_id"];

    //
    request
        .get(`http://news.maxjia.com/bbs/app/api/share/data/?link_id=${linkid}&offset=0&limit=50`)
        .set({})
        .query()
        .end(function (err, sres) {
            if (err) {
                res.send({
                    errmsg: "异常",
                    code: "400"
                })
            }

            const imgarr = [];
            const comments = JSON.parse(sres.text)["comments"];
            const links = JSON.parse(sres.text)["link"]["content"];
            comments.map((item, index) => {
                if (item["comment"][0]["imgs"]) {
                    item["comment"][0]["imgs"].map((ele, ins) => {
                        imgarr.push(ele["url"]);
                    })
                }
            })

            links.map((item, index) => {
                if (item["url"]) {
                    imgarr.push(item["url"]);
                }
            })

            var folder_exists = fs.existsSync(path.join(__dirname, `weibo/linkid-${linkid}.json`));
            if (folder_exists) {
                fs.unlinkSync(path.join(__dirname, `weibo/linkid-${linkid}.json`));
            }
            imgarr.forEach((e) => {
                fs.appendFile(`./weibo/linkid-${linkid}.json`, `${JSON.stringify(e)},`, function (err) {
                    if (err) throw err;
                });
            });

            res.send({
                code: "200",
                imgs: imgarr
            });
        })
})


app.listen(9437, function (req, res) {
    console.log('app is running at port 9437');
});