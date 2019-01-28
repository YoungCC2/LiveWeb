var request = require('superagent');
var express = require('express');
var cheerio = require('cheerio');
var async = require('async');
var fs = require('fs');
var app = express();
var bodyParser = require('body-parser');
var pluginsFun = require("./pluglns/common")



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
        Cookie: 'SINAGLOBAL=3025813996998.969.1503034766074; wb_cmtLike_1662736405=1; wvr=6; UOR=,,www.happyge.com; YF-Ugrow-G0=1eba44dbebf62c27ae66e16d40e02964; SSOLoginState=1505269772; YF-V5-G0=d45b2deaf680307fa1ec077ca90627d1; _s_tentry=-; Apache=610506355751.2435.1505269776456; ULV=1505269776633:13:13:5:610506355751.2435.1505269776456:1505264517861; YF-Page-G0=c47452adc667e76a7435512bb2f774f3; SCF=Ap9KrOm1nN4UNPRFCDcI0uu4l8uHK5gkmMcqozyNrehN0PMMOElI-yXXz07wkAUSPuEjtzPscJeJMDdzLsNFo2g.; SUB=_2A250vM12DeRhGedI7VAW8yjIyzmIHXVXy7m-rDV8PUJbmtBeLVjAkW8B1_X8l5RyIIxC3lg1e6nyMC2GCQ..; SUBP=0033WrSXqPxfM725Ws9jqgMF55529P9D9W5WyNw0a83_.-6ZDQivLDSl5JpX5o2p5NHD95QpSoqES0ecSh5fWs4DqcjUxsvfqJpLi--Xi-zRi-zcggvfdJMLxKnL1hnLB-2t; SUHB=06ZEuseM4UYGBU; ALF=1536805772; wb_cusLike_1662736405=N',
        Host: 'weibo.com',
        'Upgrade-Insecure-Requests': 1,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36'
    }
    var getParam = {
        ajwvr: '6',
        domain: '100505',
        is_search: '0',
        visible: '0',
        is_all: 1,
        is_tag: 0,
        profile_ftype: '1',
        page: '1',
        pagebar: '0',
        pl_name: 'Pl_Official_MyProfileFeed__22',
        id: '1005051916825084',
        script_uri: '/p/1005051916825084/home',
        feed_type: '0',
        pre_page: '1',
        domain_op: '100505',
        __rnd: '1505200425930'
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
            .query(queryObj)
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
                        if (mc[v]["domid"] === "Pl_Official_MyProfileFeed__22") {
                            mainStr = mc[v]["html"];
                        }
                    });
                    $ = cheerio.load(mainStr);
                    $(".WB_feed_v4 .WB_feed_like").each(function (ids, ele) {
                        var st = $(ele).find('.media_box');
                        if (st) {
                            st.find("img").each(function (idsa, eele) {
                                items.push({
                                    src: $(eele).attr('src')
                                });
                            });
                        }
                    });
                    items.forEach(function (item, k) {
                        fs.appendFile('./weibo.json', item["src"], function (err) {
                            if (err) throw err;
                            console.log('The "data to append" was appended to file!');
                        });
                    });
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
        Cookie: 'SINAGLOBAL=5990615888547.856.1534920679405; _s_tentry=gank.io; login_sid_t=6d7876fc2b0d45db00d93d1b4c810af5; cross_origin_proto=SSL; Ugrow-G0=169004153682ef91866609488943c77f; TC-V5-G0=7975b0b5ccf92b43930889e90d938495; Apache=1003406712671.706.1548379977812; ULV=1548379977819:6:1:1:1003406712671.706.1548379977812:1545631517933; TC-Page-G0=6fdca7ba258605061f331acb73120318; WBtopGlobal_register_version=d16df5b876e30246; SSOLoginState=1548383969; un=yojgni785968@game.weibo.com; SUBP=0033WrSXqPxfM725Ws9jqgMF55529P9D9WhoDDUyP5F4HMvFxa9Ofi8V5JpX5KMhUgL.Foqc1h-7eh541Kq2dJLoIp7LxKML1KBLBKnLxKqL1hnLBoMcSonfeh571K.c; ALF=1580184164; SCF=Ai4hHKl8qoDqGr38HDmipZwUWaCCNQhjRFT330hs2Es-MxK6ud6rX-Wi4YrroAlSWy-obb7zN9Hif7k1nNvdoss.; SUB=_2A25xSg61DeRhGeBI41cR8C7FwjqIHXVSPmd9rDV8PUNbmtAKLWqhkW9NRnqt1FfhpvHKLcuS2Zy6p1tICwYtc499; SUHB=0k1Svf2MRerbcu; wb_view_log_6685000996=1920*10801; UOR=www.css88.com,widget.weibo.com,www.baidu.com; wvr=6',
        Host: 'weibo.com',
        'Upgrade-Insecure-Requests': 1,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36'
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
            pl_name: 'Pl_Official_MyProfileFeed__21',
            id: '1005051916825084',
            script_uri: '/p/1005051916825084/home',
            feed_type: '0',
            pre_page: page,
            domain_op: '100505',
            __rnd: '1548663494039'
        }
    }

    function defaultParam(page) {
        return {
            is_search: 0,
            visible: 0,
            is_all: 1,
            is_tag: 0,
            profile_ftype: 1,
            page: page
        }
    }

    pluginsFun.superagentFun(base_header, setParam(1, 1), "http://weibo.com/p/1005051916825084/home", function (sres) {
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
                    items.push({
                        src: $(eele).attr('src')
                    });
                });
            }
        });
        fs.appendFile('./weibo/weibo.json', JSON.stringify(items), function (err) {
            if (err) throw err;
            console.log('The "data to append" was appended to file!');
        });
        res.send(items);
    })
})
app.listen(9090, function (req, res) {
    console.log('app is running at port 9090');
});