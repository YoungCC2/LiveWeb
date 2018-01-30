var express = require('express');
var request = require('superagent');
var moment = require('moment');
var bodyParser = require('body-parser');
var mysql = require('mysql');

var share = require('./share.json')
var app = express();
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

app.post('/find', function (req, res, next) {
    var connection = mysql.createConnection({
        host: 'rm-bp10i313al28j7d74go.mysql.rds.aliyuncs.com',
        port: '3306',
        user: 'root',
        password: '-TTTyh743472220',
        database: 'stock_analysis'
    });

    var baseHead = {
        "Host": "xueqiu.com",
        "Connection": "keep-alive",
        "Accept": "*/*",
        "X-Requested-With": "XMLHttpRequest",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36",
        "Referer": "https://xueqiu.com/S/SZ000055",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-CN,zh;q=0.9",
        "Cookie": "aliyungf_tc=AQAAAMnlr0M2ww0ApqVVfQy5/oZAKupe; xq_a_token=9fe68a74102e36c95d83680e70152894648189b5; xq_a_token.sig=Wp2RDfA0m2SS1--eP6TyzeJrNqE; xq_r_token=31f446a0ba3f00cf0ec805ef008a3ad7d7ef5f6e; xq_r_token.sig=-MGYDh3MlR7dkoz1vYeWUVTTyoQ; u=441516604902810; device_id=372f949cddff2c211655b0b84c47544f; s=fc121co4mh; __utma=1.1309101717.1516604915.1516604915.1516604915.1; __utmc=1; __utmz=1.1516604915.1.1.utmcsr=baidu|utmccn=(organic)|utmcmd=organic; __utmt=1; Hm_lvt_1db88642e346389874251b5a1eded6e3=1516604904,1516604913,1516604916; __utmb=1.6.10.1516604915; Hm_lpvt_1db88642e346389874251b5a1eded6e3=1516605233"
    }
    var ss = {
        "symbol": "SZ000537",

        "type": "normal",
        "begin": "1516550400000",
        "end": "1485100800000"
    }

    request
        .get("https://xueqiu.com/stock/forchartk/stocklist.json")
        .set(baseHead)
        .query(ss)
        .end(function (err, sres) {

            sres.text = JSON.parse(sres.text)
            const ll = sres.text.chartlist.length;





            connection.query(squery, function (error, results) {
                if (error) {
                    console.log(error)
                } else {
                    //       
                    console.log("success" + index);
                }

            })
            var squery = "INSERT INTO `stock_analysis`.`stock` (`open`, `close`, `high`, `low`, `chg`,`time`) VALUES (${name1})";
        
            sres.text.chartlist.map((item, index) => {

                item["time"] = moment(item["time"]).format('YYYY-MM-DD HH:mm:ss');
                item["time"] = "'"+item["time"]+"'";
                var squery = "INSERT INTO `stock_analysis`.`stock` (`open`, `close`, `high`, `low`, `chg`,`time`) VALUES (" + item.open + "," + item.close + "," + item.high + "," + item.low + "," + item.chg +","+item.time +")";
                
        
                connection.query(squery, function (error, results) {
                    if (error) {
                        console.log(error)
                    } else {
                        //       
                        console.log("success" + index);
                    }

                })

                if (index + 1 == ll) {
                    res.send("complete");
                }
            })
        })

});


app.get('/sccc', function (req, res, next) {
    res.send(share.chartlist)
})
app.listen(3389, function (req, res) {
    console.log('app is running at port 3389');
});