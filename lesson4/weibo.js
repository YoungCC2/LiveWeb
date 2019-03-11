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
        Cookie: "SINAGLOBAL=5990615888547.856.1534920679405; _s_tentry=gank.io; login_sid_t=6d7876fc2b0d45db00d93d1b4c810af5; cross_origin_proto=SSL; Ugrow-G0=169004153682ef91866609488943c77f; TC-V5-G0=7975b0b5ccf92b43930889e90d938495; Apache=1003406712671.706.1548379977812; ULV=1548379977819:6:1:1:1003406712671.706.1548379977812:1545631517933; TC-Page-G0=6fdca7ba258605061f331acb73120318; WBtopGlobal_register_version=d16df5b876e30246; SSOLoginState=1548383969; un=yojgni785968@game.weibo.com; UOR=www.css88.com,widget.weibo.com,www.baidu.com; wvr=6; wb_view_log_6685000996=1920*10801; SUBP=0033WrSXqPxfM725Ws9jqgMF55529P9D9WhoDDUyP5F4HMvFxa9Ofi8V5JpX5KMhUgL.Foqc1h-7eh541Kq2dJLoIp7LxKML1KBLBKnLxKqL1hnLBoMcSonfeh571K.c; ALF=1580282858; SCF=Ai4hHKl8qoDqGr38HDmipZwUWaCCNQhjRFT330hs2Es---iT3yLesOMepqm6rGovcBg08BzTkmTgXEMS_Ur0e64.; SUB=_2A25xVHA7DeRhGeBI41cR8C7FwjqIHXVSIObzrDV8PUNbmtAKLUrTkW9NRnqt1BEjXF1lkL9m7dmr9CM9B5rklvTz; SUHB=0KAhvgdeNWCe6O",
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
