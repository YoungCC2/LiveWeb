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
var open = require("open");

// open("http://www.baidu.com", "firefox");
var cookir;
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

app.get('/home', function (req, res, next) {
    var base_header = {
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'zh-CN,zh;q=0.8',
        'Connection': 'keep-alive',
        'Cache-Control': 'max-age=0',
        Cookie: 'SINAGLOBAL=5990615888547.856.1534920679405; _s_tentry=gank.io; login_sid_t=6d7876fc2b0d45db00d93d1b4c810af5; cross_origin_proto=SSL; Ugrow-G0=169004153682ef91866609488943c77f; TC-V5-G0=7975b0b5ccf92b43930889e90d938495; wb_view_log=1920*10801; Apache=1003406712671.706.1548379977812; ULV=1548379977819:6:1:1:1003406712671.706.1548379977812:1545631517933; UOR=www.css88.com,widget.weibo.com,www.baidu.com; TC-Page-G0=6fdca7ba258605061f331acb73120318; WBtopGlobal_register_version=d16df5b876e30246; SCF=Ai4hHKl8qoDqGr38HDmipZwUWaCCNQhjRFT330hs2Es-VJVSCBNBPBmwzhjTOSCJ3KrRWNzeS8G5PMtzPXTHu0o.; SUB=_2A25xTgaxDeRhGeBI41cR8C7FwjqIHXVSOn95rDV8PUNbmtAKLVTykW9NRnqt1KDxKft8g7Yx9A8N9te-WWdujimw; SUBP=0033WrSXqPxfM725Ws9jqgMF55529P9D9WhoDDUyP5F4HMvFxa9Ofi8V5JpX5K2hUgL.Foqc1h-7eh541Kq2dJLoIp7LxKML1KBLBKnLxKqL1hnLBoMcSonfeh571K.c; SUHB=0OM0jGJoHZDkdn; ALF=1548988770; SSOLoginState=1548383969; un=yojgni785968@game.weibo.com; wb_view_log_6685000996=1920*10801',
        Host: 'weibo.com',
        'Upgrade-Insecure-Requests': 1,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36'
    }
    var getParam = {
        pids: "Pl_Official_MyProfileFeed__21",
        is_search: 0,
        visible: 0,
        is_all: 1,
        is_tag: 0,
        profile_ftype: 1,
        page: 1,
        ajaxpagelet: 1,
        ajaxpagelet_v6: 1,
        __ref: "/p/1005051916825084/home?from=page_100505_profile&wvr=6&mod=data&is_all=1#place",
        _t: "FM_154838397258526"
    }

    function setParam(page, pagebar) {
        return {
            ajwvr: '6',
            domain: '100505',
            is_search: '0',
            visible: '0',
            is_all: 1,
            is_tag: 0,
            profile_ftype: '1',
            page: page,
            pagebar: pagebar,
            pl_name: 'Pl_Official_MyProfileFeed__22',
            id: '1005051916825084',
            script_uri: '/vczh',
            feed_type: '0',
            pre_page: page,
            domain_op: '100505',
            __rnd: '1505200425930'
        }
    }


    function defaultParam(page) {
        return {
            is_search: '0',
            visible: '0',
            is_all: '1',
            is_tag: '0',
            profile_ftype: '1',
            page: page
        }
    }

    var sccc = '';
    var count = -1;

    function requestGet(page, pagebar, callback) {
        if (pagebar == -1) {
            var queryObj = defaultParam(page);
        } else {
            var queryObj = setParam(page, pagebar);
        }
        request
            .get("http://weibo.com/p/1005051916825084/home")
            .set(base_header)
            .query(defaultParam(1))
            .end(function (err, sres) {
                if (err) {
                    res.send('e');
                    return next(err);
                } else {
                    var $ = cheerio.load(sres.text);
                    var mc = [];
                    var items = [];
                    $('script').each(function (k, v) {
                        if (k > 3) {
                            var temp = $('script').eq(k).text();
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
                        if (mc[v]["domid"] === "Pl_Official_MyProfileFeed__22") {
                            mainStr = mc[v]["html"];
                        }
                    });
                    $ = cheerio.load(mainStr);
                    $(".WB_feed_v4 .WB_feed_like").each(function (ids, ele) {
                        var st = $(ele).find('.media_box');
                        if (st) {
                            st.find("img").each(function (idsa, eele) {
                                console.log($(eele).attr('src'));
                                items.push({
                                    src: $(eele).attr('src')
                                });
                            });
                        }
                    });
                    //                    items.forEach(function (item, k) {
                    //                        fs.writeFile('./weibo.json', items, function (err) {
                    //                            if (err) {
                    //                                throw err;
                    //                            } else {
                    //                                console.log('success');
                    //                                callback(null, "successful !");
                    //                            }
                    //                        });
                    //                    });
                    callback(err, res);
                }
            })
    };

    function pageDate(page) {
        if (page) {
            var pages = page;
            var tasks = ['-1', '0', '1'];
            async.eachSeries(tasks, function (item, callback) {
                requestGet(pages, item, callback);
            }, function (err, result) {
                console.log(page + "end");
            });
        }
    }
    var pageArr = [];
    for (var i = 200; i <= 204; i++) {
        pageArr[i] = i;
    }
    async.mapLimit(pageArr, 2, function (item, callback) {
        if (item) {
            setTimeout(function () {
                pageDate(item);
                callback(null, item + '!!!');
            }, 2000)
        } else {
            callback(null, item + '!!!');
        }
    }, function (err, result) {
        console.log("ennnnnnnnnnnnnnnd!");
    });
});

app.get("/cs", (req, res, next) => {
    var base_header = {
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'zh-CN,zh;q=0.8',
        'Connection': 'keep-alive',
        'Cache-Control': 'max-age=0',
        Cookie: 'SINAGLOBAL=5990615888547.856.1534920679405; _s_tentry=gank.io; login_sid_t=6d7876fc2b0d45db00d93d1b4c810af5; cross_origin_proto=SSL; Ugrow-G0=169004153682ef91866609488943c77f; TC-V5-G0=7975b0b5ccf92b43930889e90d938495; wb_view_log=1920*10801; Apache=1003406712671.706.1548379977812; ULV=1548379977819:6:1:1:1003406712671.706.1548379977812:1545631517933; UOR=www.css88.com,widget.weibo.com,www.baidu.com; TC-Page-G0=6fdca7ba258605061f331acb73120318; WBtopGlobal_register_version=d16df5b876e30246; SCF=Ai4hHKl8qoDqGr38HDmipZwUWaCCNQhjRFT330hs2Es-VJVSCBNBPBmwzhjTOSCJ3KrRWNzeS8G5PMtzPXTHu0o.; SUB=_2A25xTgaxDeRhGeBI41cR8C7FwjqIHXVSOn95rDV8PUNbmtAKLVTykW9NRnqt1KDxKft8g7Yx9A8N9te-WWdujimw; SUBP=0033WrSXqPxfM725Ws9jqgMF55529P9D9WhoDDUyP5F4HMvFxa9Ofi8V5JpX5K2hUgL.Foqc1h-7eh541Kq2dJLoIp7LxKML1KBLBKnLxKqL1hnLBoMcSonfeh571K.c; SUHB=0OM0jGJoHZDkdn; ALF=1548988770; SSOLoginState=1548383969; un=yojgni785968@game.weibo.com; wb_view_log_6685000996=1920*10801',
        Host: 'weibo.com',
        'Upgrade-Insecure-Requests': 1,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36'
    }

    function defaultParam(page) {
        return {
            is_search: '0',
            visible: '0',
            is_all: '1',
            is_tag: '0',
            profile_ftype: '1',
            page: page
        }
    }
    //Pl_Official_MyProfileFeed__21

    request
        .get("http://weibo.com/p/1005051916825084/home")
        .set(base_header)
        .query(defaultParam(1))
        .end(function (err, sres) {
            if (err) {
                res.send('e');
                return next(err);
            } else {
                var $ = cheerio.load(sres.text);
                var mc = [];
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

                })
                var items = [];
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
//                            console.log($(eele).attr('src'));
                            items.push({
                                src: $(eele).attr('src')
                            });
                        });
                    }
                });
//                items.forEach(function (item, k) {
//                   
//                });
                 fs.appendFile('./weibo.json', items, function (err) {
                        if (err) {
                            throw err;
                        } else {
                            console.log('success');
//                            callback(null, "successful !");
                        }
                    });
            }
        })
})

app.listen(9090, function (req, res) {
    console.log('app is running at port 9090');
});