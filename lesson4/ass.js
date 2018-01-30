var request = require('superagent');
var openId = require('./openId.json');
var fs = require('fs');

var param = function () {
    return {
        "touser": "o_-fCvsj1HvzGkEIIGtaJeRPaJ-w",
        "template_id": "m1vUZ9DnQ9PGUuKBm9b6MJ7KtdLXJ9PMNHhpWtEkEwc",
        "url": "http://weixin.qq.com/download",
        "topcolor": "#FF0000",
        "data": {
            "first": {
                "value": "yhh的查询结果",
                "color": "#173177"
            },
            "keyword1": {
                "value": "2017-11-29",
                "color": "#173177"
            },
            "keyword2": {
                "value": "2017-12-29",
                "color": "#173177"
            },
            "keyword3": {
                "value": "110Whz",
                "color": "#173177"
            },
            "remark": {
                "value": "美女,你好！",
                "color": "#173177"
            }
        }
    }
}

request
    .get("https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx5ac9c5301cbced7b&secret=0fe8b998368104a39f56d3556e42710c")
    .end(function (err, ss) {
        if (err) {
            console.log('err');
            return next(err);
        } else {
            var access_token = JSON.parse(ss.text).access_token;
            console.log(access_token);
//            var items = [];
//            var count = 0;
//            openId.data.openid.map(function (item) {
//                
//                request
//                    .get("https://api.weixin.qq.com/cgi-bin/user/info?access_token=" + access_token + "&openid=" + item + "&lang=zh_CN")
//                    .end(function (err, ss) {
//                        if (err) {
//                            console.log('err');
//                            return next(err);
//                        } else {
//                            items.push(ss.text)
//                            fs.writeFile('./src.json', items, function (err) {
//                                if (err) {
//                                    throw err;
//                                } else {
//                                    count++;
//                                    console.log(count);
//                                }
//                            });
//                        }
//                    })
//            })



                        request
                            .post("https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=" + access_token)
                            .send(param())
                            .end(function (err, sres) {
                                if (err) {
                                    console.log('err');
                                    return next(err);
                                } else {
                                    console.log(sres.text);
                                }
                            })

        }
    })