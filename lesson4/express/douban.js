var request = require('superagent');
var express = require('express');
var cheerio = require('cheerio');
var fs = require('fs');
var app = express();
var path = require("path");
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: false
}));

var movlist2017 = require('./movlist2017.json');
var movlist2016 = require('./movlist2016.json');
var movlist2015 = require('./movlist2015.json');
var movlist2014 = require('./movlist2014.json');
app.use(bodyParser.json());
app.get('/movlist', function(req, res, next) {
    const base_header = {
        "Host": "movie.douban.com",
        "Connection": "keep-alive",
        "Cache-Control": "max-age=0",
        "Upgrade-Insecure-Requests": 1,
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-CN,zh;q=0.9",
        "Cookie": 'bid=oM3GbsjCiV8; _pk_id.100001.4cf6=3c5287c114dc85ef.1522065602.1.1522065602.1522065602.; _pk_ses.100001.4cf6=*; __utma=30149280.1376213044.1522065602.1522065602.1522065602.1; __utmc=30149280; __utmz=30149280.1522065602.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); __utmt=1; __utmb=30149280.1.10.1522065602'
    }

    request
        .get("https://movie.douban.com/awards/doubanfilm_annual/1/nominees")
        .set(base_header)
        .query({})
        .end(function(err, sres) {
            const $ = cheerio.load(sres.text);
            const flist = [];
            $(".result_list").find(".levl2").map((k,v)=>{
                
                const movr = [];
                $(v).find(".rslt_wrap ul li").map((index,item)=>{
                    
                    movr.push({
                        link:$(item).find(".r_main a").attr("href"),
                        name:$(item).find(".r_main a").text()
                    })
                })
                flist.push({
                    t:$(v).find("h3").text(),
                    d:movr
                })
            })
            res.send(flist);
        })
})

app.get("/de",(req, res, next)=>{

 
    const base_header = {
        "Host": "movie.douban.com",
        "Connection": "keep-alive",
        "Upgrade-Insecure-Requests": 1,
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
        "Referer": "https://movie.douban.com/awards/doubanfilm_annual/1/nominees",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-CN,zh;q=0.9",
        "Cookie": 'bid=oM3GbsjCiV8; __utmc=30149280; __utmz=30149280.1522065602.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); ap=1; _pk_ses.100001.4cf6=*; __utma=30149280.1376213044.1522065602.1522065602.1522068723.2; __utmb=30149280.4.10.1522068723; ll="108309"; __utma=223695111.1940079036.1522068996.1522068996.1522068996.1; __utmb=223695111.0.10.1522068996; __utmc=223695111; __utmz=223695111.1522068996.1.1.utmcsr=localhost:8888|utmccn=(referral)|utmcmd=referral|utmcct=/movlist; _vwo_uuid_v2=D391B643215ABA97B42F7778A57A1F718|e0c581a7e23a82292bfe4137c4edb4d1; _pk_id.100001.4cf6=3c5287c114dc85ef.1522065602.2.1522069632.1522065632.'
    }
    const ffres = [];
    request
    .get("https://movie.douban.com/subject/26633257/")
    .set(base_header)
    .query({})
    .end(function (err, sres) {
        const $ = cheerio.load(sres.text);
        const flist = [];
        flist.push({
            "daoyan": $("#info").find("a[rel='v:directedBy']").text(),
            "shangyingshijian": $("#info").find("span[property='v:initialReleaseDate']").text(),
            "pianchang": $("#info").find("span[property='v:runtime']").text(),
            "jianjie": $("#link-report").find("span[class='all hidden']").text(),
            "pingfen": $("#interest_sectl").find("strong[property='v:average']").text(),
            "pingjiarenshu": $("#interest_sectl").find("span[property='v:votes']").text()
        })

        res.send(flist);
    })
    // movlist2017.forEach(element => {
    //     let i = 0;
    //     element["d"].forEach((ite) => {
    //         const fr = [];
    //         console.log(ite["link"])
    //         request
    //             .get("https://movie.douban.com/subject/26633257/")
    //             .set(base_header)
    //             .query({})
    //             .end(function (err, sres) {
    //                 const $ = cheerio.load(sres.text);
    //                 const flist = [];
    //                 flist.push({
    //                     "daoyan": $("#info").find("a[rel='v:directedBy']").text(),
    //                     "shangyingshijian": $("#info").find("span[property='v:initialReleaseDate']").text(),
    //                     "pianchang": $("#info").find("span[property='v:runtime']").text(),
    //                     "jianjie": $("#link-report").find("span[class='all hidden']").text(),
    //                     "pingfen": $("#interest_sectl").find("strong[property='v:average']").text(),
    //                     "pingjiarenshu": $("#interest_sectl").find("span[property='v:votes']").text()
    //                 })

    //                 fr.push({
    //                     name:ite['name'],
    //                     d:flist
    //                 })

    //                 ffres.push({
    //                     t:element['t'],
    //                     dd:fr
    //                 })
    //                 res.send(flist)
    //                 // if(i>=4){
                        
    //                 // }else{
    //                 //     console.log(i)
    //                 //     i++
    //                 // }
                    

    //             })
    //     })
    // });

    
  


})


app.listen(8888, function(req, res) {
    console.log('app is running at port 8888');
});