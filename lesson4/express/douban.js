var request = require('superagent');
var express = require('express');
var cheerio = require('cheerio');
var async = require('async');
var fs = require('fs');
var http = require('http');  
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
const imdb = require("./imdb.json")
const docDetails = require("./doc.json")
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
        "Cookie": process.env.DOUBAN_COOKIE || ""
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
    
const sc = [
    {
        "t": "评分最高的外语电影 / Best Foreign Film",
        "d": [
            {
                "link": "https://movie.douban.com/subject/1889243/",
                "name": "\n                            星际穿越 Interstellar\n                        "
            }, {
                "link": "https://movie.douban.com/subject/1793929/",
                "name": "\n                            达拉斯买家俱乐部 Dallas Buyers Club\n                     " +
                        "   "
            }, {
                "link": "https://movie.douban.com/subject/2133323/",
                "name": "\n                            白日梦想家 The Secret Life of Walter Mitty\n           " +
                        "             "
            }, {
                "link": "https://movie.douban.com/subject/2209575/",
                "name": "\n                            少年时代 Boyhood\n                        "
            }, {
                "link": "https://movie.douban.com/subject/6538833/",
                "name": "\n                            内布拉斯加 Nebraska\n                        "
            }, {
                "link": "https://movie.douban.com/subject/6722879/",
                "name": "\n                            她 Her\n                        "
            }, {
                "link": "https://movie.douban.com/subject/6874403/",
                "name": "\n                            再次出发之纽约遇见你 Begin Again\n                        "
            }, {
                "link": "https://movie.douban.com/subject/10485647/",
                "name": "\n                            X战警：逆转未来 X-Men: Days of Future Past\n             " +
                        "           "
            }, {
                "link": "https://movie.douban.com/subject/11525673/",
                "name": "\n                            布达佩斯大饭店 The Grand Budapest Hotel\n                " +
                        "        "
            }, {
                "link": "https://movie.douban.com/subject/21318488/",
                "name": "\n                            消失的爱人 Gone Girl\n                        "
            }
        ]
    }
];

//    let i = 0;
//    setInterval(()=>{
//            ff(movlist2017[i])
//            i++;
//    },5000)
    const base_header = {
        "Host": "movie.douban.com",
        "Connection": "keep-alive",
        "Upgrade-Insecure-Requests": 1,
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
        "Referer": "https://movie.douban.com/awards/doubanfilm_annual/1/nominees",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-CN,zh;q=0.9",
        "Cookie": process.env.DOUBAN_COOKIE || ""
    }  
    
    const resUrl  = (url,cb,t) =>{
            const flist = [];
            const fres = [];
            request
                .get(url["link"])
                .set(base_header)
                .query({})
                .end(function (err, sres) {
                    if(err){
                        return next(err);
                    }
                    const $ = cheerio.load(sres.text);
                    flist.push({
                        "daoyan": $("#info").find("a[rel='v:directedBy']").text(),
                        "shangyingshijian": $("#info").find("span[property='v:initialReleaseDate']").text(),
                        "pianchang": $("#info").find("span[property='v:runtime']").text(),
                        "jianjie": $("#link-report").find("span[property='v:summary']").text(),
                        "pingfen": $("#interest_sectl").find("strong[property='v:average']").text(),
                        "pingjiarenshu": $("#interest_sectl").find("span[property='v:votes']").text(),
                        "movname":url["name"],
                        'title':t
                    })
                    cb(null,flist)

                })
    }
    
    const detail = (ditem,cb) => {
        const rfres = [];
        async.mapLimit(ditem["d"], 1, (item, callback) => {
            console.log(item['name'])
            resUrl(item, callback,ditem['t']);
        }, (err, result) => {
            if (err) {
                console.log(err, item["name"]);
            } else {
                cb(null,result);
            }
        })
    }
    
    const ff = (itsc) => {
        async.mapLimit(itsc, 1, (item, cb) => {
            console.log(item['t'])
            detail(item, cb);
        }, (err, result) => {
            if (err) {
                console.log(err, item["t"]);
            } else {
                res.send(result);
                console.log("全部已爬取完毕！");
            }
        })
    }

})


app.get('/imdb',(req, res, next)=>{
    const base_header = {
        "Host": "www.imdb.com",
        "Connection": "keep-alive",
        "Cache-Control": "max-age=0",
        "Upgrade-Insecure-Requests": 1,
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)" +
                " Chrome/65.0.3325.181 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;" +
                "q=0.8",
        "Accept-Encoding": "gzip, deflate",
        "Accept-Language": "zh-CN,zh;q=0.9",
        "Cookie": process.env.IMDB_COOKIE || ""
    }

    const url = "http://www.imdb.com/chart/top?sort=rk,asc&mode=simple&page=1";
    request
    .get(url)
    .set(base_header)
    .query({})
    .end(function(err, sres) {
        const $ = cheerio.load(sres.text);
        const flist = [];
        $(".lister").find("table tbody tr").map((k,v)=>{
            flist.push({
                t:$(v).find(".titleColumn a").text(),
                link:$(v).find(".titleColumn a").attr("href"),
                y:$(v).find(".titleColumn span.secondaryInfo").text(),
            })
        })
        res.send(flist);
    })
})

app.get('/imdbe',(req, res, next)=>{
    const base_header = {
        "Host": "www.imdb.com",
        "Connection": "keep-alive",
        "Cache-Control": "max-age=0",
        "Upgrade-Insecure-Requests": 1,
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
        "Accept-Encoding": "gzip, deflate",
        "Accept-Language": "zh-CN,zh;q=0.9",
        "Cookie": process.env.IMDB_COOKIE || ""
    }
    const rest = (item,cb) =>{
        request
        .get("http://www.imdb.com"+item["link"])
        .set(base_header)
        .query({})
        .end(function(err, sres) {
            const flist = [];
            if(!err){
                const $ = cheerio.load(sres.text);
                
                flist.push(JSON.stringify({
                    n:item['t'],
                    y:item['y'],
                    d:$(".plot_summary span[itemprop='director'] span").text(),
                    sl:$("#titleStoryLine div[itemprop='description'] p").text()
                }))
                
                cb(null,flist);
            }else{
                cb(null,flist.push(JSON.stringify({
                    n:item['t'],
                    y:item['y'],
                    d:"",
                    sl:""
                })));
            }
            // res.send(flist);
        })
    }


    async.mapLimit(imdb, 1, (item, cb) => {
        console.log(item['t'])
        rest(item, cb);
    }, (err, result) => {
        if (err) {
            console.log(err, item["t"]);
            res.send(result);
        } else {
            // res.send(result);
            fs.writeFile('./src.json', result, function(err) {
                if (err) {
                    throw err;
                } else {
                    console.log('success');
                    
                }
            });
            console.log("全部已爬取完毕！");
        }
    })

})


app.get("/doc",(req, res, next)=>{
    const rest = (index,cb)=>{
        request
            .get("https://api.douban.com/v2/movie/search")
            .query({
                tag:"纪录片",
                start:index
            })
            .end(function(err, sres) {
                if(!err){
                    const ffres = [];
                    JSON.parse(sres.text).subjects.map((item,index)=>{
                        
                        ffres.push(JSON.stringify(
                        {
                            "title":item["title"],
                            "rating":item["rating"]["average"],
                            "link":item["alt"],
                            "id":item["id"]
                        }))
                    });
                    console.log(index);
                    cb(null,ffres)
                }else{
                    cb(null,ffres)
                }
            })
    }

    const arr = [0,20,40,60,80,100,120,140,160,180,200];
    async.mapLimit(arr, 1, (item, cb) => {
        console.log(item)
        rest(item, cb);
    }, (err, result) => {
        if (err) {
            console.log(err, item);
            res.send(result);
        } else {

            fs.writeFile('./src.json', result, function(err) {
                if (err) {
                    throw err;
                } else {
                    console.log('success');
                    
                }
            });
            console.log("全部已爬取完毕！");
        }
    })


})


app.get("/docDetail", (req, res, next) => {

    const rest = (item,cb) =>{
        request
            .get("https://api.douban.com/v2/movie/subject/"+item["id"])
            .end(function (err, sres) {
            const ffres = [];
                if (!err) {
                    ffres.push(JSON.stringify({
                        summary:JSON.parse(sres.text)["summary"],
                        title:item["title"],
                        rating:item["rating"],
                        link:item["link"],
                    }))
                   
                    setTimeout(function() { 
                        console.log(item['title']);
                        cb(null, ffres[0])
                      }, 5000);
                } else {
                    cb(null, ffres[0])
                }
            })
    }
    const task = [];
    // docDetails.map((item,index)=>{
    //     task.push((cb)=>{
    //         rest(item,cb)
    //     })
    // });
    // async.series(task, function(err,result){  
    //     if(err) return console.log(err);  
    //     res.send(result);  
    //   })  
   
   console.info(docDetails.length)
    
})
app.listen(8888, function(req, res) {
    console.log('app is running at port 8888');
});
