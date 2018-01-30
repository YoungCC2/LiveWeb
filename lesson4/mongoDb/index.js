'use strict';
var User = require("./db");
var {insert} = require("./saveResource");

/**
 * 插入
 */
function insert() {

    var user = new User({
        username: 'mike', //用户账号
        userpwd: '1234', //密码
        userage: 10, //年龄
        logindate: new Date() //最近登录时间
    });

    user.save(function (err, res) {
        if (err) {
            console.log("Error:" + err);
        } else {
            console.log("Res:" + res);
        }

    });
}


function getByConditions(){
    var wherestr = {};
    
    User.find(wherestr, function(err, res){
        if (err) {
            console.log("Error:" + err);
        }
        else {
            console.log("Res:" + res);
        }
    })
}
insert();
//getByConditions();
//insert();