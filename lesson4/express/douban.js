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
        "Cookie": 'bid=5hI5NKF7SOc; __utmc=30149280; ll="108309"; __utmc=223695111; ap=1; _vwo_uuid_v2=D5F79271851E9469C1DAF201C57A5AB4B|8be1cf4a2445b06d6e0346ea49065a25; _pk_ses.100001.4cf6=*; __utma=30149280.2068144489.1522056382.1522117833.1522121511.4; __utmz=30149280.1522121511.4.2.utmcsr=baidu|utmccn=(organic)|utmcmd=organic; ps=y; __utmb=30149280.2.10.1522121511; ue="743472220@qq.com"; push_noty_num=0; push_doumail_num=0; dbcl2="75148841:4p8ot1uTuso"; ck=WmOj; __utma=223695111.741874987.1522056425.1522117833.1522122069.4; __utmb=223695111.0.10.1522122069; __utmz=223695111.1522122069.4.2.utmcsr=baidu|utmccn=(organic)|utmcmd=organic; _pk_id.100001.4cf6=7e876ee64fd47d07.1522056382.3.1522122108.1522112424.'
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
        "Cookie": "uu=BCYqGJeNNKq9FPqhLc2tM-lQ_kvvCs9C_t1GrqFsnydNNZjlgareuuk3HZnUj__l-dlqyyOH58D1%" +
                "0D%0AdDvwC4AnCmGomz1z2CbVZyfqRZ05P1bXyO5qZA1RcvwWh5QzP1tLAA8lJ5QHwR8HjuvuXa1jhFA" +
                "6%0D%0AeBq6I1OYODD4kvnAepZUwvb6faaU3ia4LXsJ3BLuBZ2byydABFrN3sYL39AWi2aEoRiNVhDKI" +
                "U30%0D%0AjqGZLiYj6QoOnpHv6NGvSW0_VXJ9HSoh1EHP56lZpoKNk3dp0BuJvw%0D%0A; session-i" +
                "d=132-3239285-4553411; session-id-time=2152837476; ubid-main=132-1381116-4697301" +
                "; session-token=royPfxHC+EeHDcGI1D/b8kbhj3Jw4pqhcWTkWNX4/D+pmGEJwufBaxuu/HzSMzZX" +
                "Apkw4yuq3r8X64EsJO8nmBbROJ6tJNwVh9BeAwryTbA/W5hR635g5wFWSu4a8SjUoeDU8XLJoCxROXBy" +
                "mJXelaY/9huCmxYTpWpfmD6VtyGAg3Y8ed1NOc5Hh6jKrT3O; as=%7B%22n%22%3A%7B%22t%22%3A%" +
                "5B0%2C0%5D%2C%22tr%22%3A%5B300%2C250%5D%2C%22in%22%3A%5B0%2C0%5D%2C%22ib%22%3A%5" +
                "B0%2C0%5D%7D%7D; csm-hit=11H2Q51T68P56W79V4W7+s-11H2Q51T68P56W79V4W7|15221995078" +
                "84"
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
        "Cookie": "uu=BCYqGJeNNKq9FPqhLc2tM-lQ_kvvCs9C_t1GrqFsnydNNZjlgareuuk3HZnUj__l-dlqyyOH58D1%0D%0AdDvwC4AnCmGomz1z2CbVZyfqRZ05P1bXyO5qZA1RcvwWh5QzP1tLAA8lJ5QHwR8HjuvuXa1jhFA6%0D%0AeBq6I1OYODD4kvnAepZUwvb6faaU3ia4LXsJ3BLuBZ2byydABFrN3sYL39AWi2aEoRiNVhDKIU30%0D%0AjqGZLiYj6QoOnpHv6NGvSW0_VXJ9HSoh1EHP56lZpoKNk3dp0BuJvw%0D%0A; session-id=132-3239285-4553411; session-id-time=2152837476; ubid-main=132-1381116-4697301; session-token=royPfxHC+EeHDcGI1D/b8kbhj3Jw4pqhcWTkWNX4/D+pmGEJwufBaxuu/HzSMzZXApkw4yuq3r8X64EsJO8nmBbROJ6tJNwVh9BeAwryTbA/W5hR635g5wFWSu4a8SjUoeDU8XLJoCxROXBymJXelaY/9huCmxYTpWpfmD6VtyGAg3Y8ed1NOc5Hh6jKrT3O; as=%7B%22n%22%3A%7B%22t%22%3A%5B0%2C0%5D%2C%22tr%22%3A%5B300%2C250%5D%2C%22in%22%3A%5B0%2C0%5D%2C%22ib%22%3A%5B0%2C0%5D%7D%7D; csm-hit=0292K3A7H7ESJVD70NK3+s-0292K3A7H7ESJVD70NK3|1522202036291"
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