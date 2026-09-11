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
        host: process.env.MYSQL_HOST || '127.0.0.1',
        port: Number(process.env.MYSQL_PORT || 3306),
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.STOCK_MYSQL_DATABASE || 'stock_analysis'
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
        "Cookie": process.env.XUEQIU_COOKIE || ""
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
