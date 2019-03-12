var net = require('net');
var uuid = require('node-uuid');
var md5 = require('md5');
var request = require('request');
//118.118.218.253   
var gift = require("./dygift.json");
var streamGift = require("./dyStream.json");
var HOST = 'openbarrage.douyutv.com';//
var PORT = 8601; //8601,12602,12601,8602


var  rid = "97376";
var user = ""
var password = "123456"

function send(socket, payload) {
        var data = new Buffer(4 + 4 + 4 + payload.length + 1)
        data.writeInt32LE(4 + 4 + payload.length + 1, 0); //length
        data.writeInt32LE(4 + 4 + payload.length + 1, 4); //code
        data.writeInt32LE(0x000002b1, 8); //magic
        data.write(payload, 12); //payload
        data.writeInt8(0, 4 + 4 + 4 + payload.length); //end of string
        socket.write(data)
    }

function getGroupServer(roomid, callback)
{
	request({uri:'https://www.douyutv.com/' + roomid}, function(err, resp, body) {
/*		var server_config = JSON.parse(body.match(/room_args = (.*?)\}\;/g)[0].replace('room_args = ', '').replace(';', ''));
        console.log(server_config);
//		server_config = JSON.parse(unescape(server_config['server_config']));*/
	     callback(HOST, PORT);
	});
}


function getGroupId(roomid, callback)
{
	var rt = new Date().now;
	var devid = uuid.v4().replace(/-/g, '');
	var vk = md5(rt + '7oE9nPEG9xXV69phU31FYCLUagKeYtsF' + devid)
	var req = 'type@=loginreq/username@=s101yh/password@=123456/roomid@=' + 
		roomid + '/ct@=0/vk@=' + vk + '/devid@=' + 
		devid + '/rt@=' + rt + '/ver=@20150929/';
	
	getGroupServer(roomid, function(server, port) {
		console.log('group server: ' + server + ':' + port);
		var socket = net.connect(port, server, function() {
			send(socket, req);
		});
		
		socket.on('data', function(data) {
            var sd = data.toString();  
            console.log(sd);
			if (data.indexOf('type@=setmsggroup') >= 0) {
				var gid = data.toString().match(/gid@=(.*?)\//g)[0].replace('gid@=', '');
//				gid = gid.substring(0, gid.length - 1);
                gid = 18;
				socket.destroy();
				callback(gid);
			}
		});	
	});
}

var socket = net.connect(PORT, HOST, function () {
    console.log('连接到服务器！');
    //登录  房间号不是固定/
//    var req = 'type@=loginreq/username@=s101yh/password@=123456/roomid@=421065';
    var req = `type@=loginreq/username@=s101yh/password@=123456/roomid@=${rid}/ct@=2/`;
    send(socket,req);
});

setInterval(function() {
    let a = Date.now();
    send(socket, `type@=keeplive/tick@=${a}/`); //send keep alive message repeatly
}, 50000);
//532152
//1720665  安迪
socket.on('data', function(data) {
    // console.log(data.toString());
    if (data.indexOf('type@=loginres') >= 0) {
            //登录成功 
        // getGroupId(rid, function (gid) {
        //     console.log('gid of room[' + rid + '] is ' + gid)
        //     send(socket, 'type@=joingroup/rid@=' + rid + '/gid@=' + 2 + '/');
        // });
        send(socket, 'type@=joingroup/rid@=' + rid + '/gid@=' + -9999 + '/');
    } else if (data.indexOf('type@=chatmsg') >= 0) {
        var msg = data.toString();
        // console.log(msg);
        var snick = msg.match(/nn@=(.*?)\//g)[0].replace('snick@=', '');
        var content = msg.match(/txt@=(.*?)\//g) ? msg.match(/txt@=(.*?)\//g)[0].replace('content@=', '')  : "error";
        snick = snick.substring(0, snick.length - 1);
        content = content.substring(0, content.length - 1);
        console.log(snick + ': ' + content); // 弹幕
    } else if (data.indexOf('type@=uenter') >= 0 ||
        //用户进入消息
        data.indexOf('type@=keeplive') >= 0 ||
        data.indexOf('type@=dgn/gfid@=131') >= 0 ||
        data.indexOf('type@=blackres') >= 0 ||
        data.indexOf('type@=dgn/gfid@=129') >= 0 ||
        data.indexOf('type@=upgrade') >= 0 ||
        data.indexOf('type@=ranklist') >= 0 ||
        data.indexOf('type@=onlinegift') >= 0) {

    } else if (data.indexOf('type@=spbc') >= 0) {
        //礼物广播消息
        var drid = data.toString().match(/drid@=(.*?)\//g)[0].replace('drid@=', '');
        drid = drid.substring(0, drid.length - 1);
        console.log('rocket! room id:' + drid);
    } else if(data.indexOf('type@=dgb') >= 0){
        //当前房间礼物消息
        var msg = data.toString();
        var snick = msg.match(/nn@=(.*?)\//g)[0].replace('snick@=', '');
        var gfid = msg.match(/gfid@=(.*?)\//g)[0].replace('gfid@=', '');
        var gfcnt = msg.match(/gfcnt@=(.*?)\//g)[0].replace('gfcnt@=', '');
        gfid = gfid.substring(0, gfid.length - 1);
        
        try{
            gift["data"][gfid]["name"] ? 
            console.log(`${snick}：送出 ${gift["data"][gfid]["name"]} -- ${gfcnt} 个`):
            console.log(`${snick}：送出 ${streamGift["gift"][gfid]["name"]} -- ${gfcnt} 个`);
        }catch(e){
            console.log(`---${gfid}----`);
            
        }
    }else if(data.indexOf('type@=bc_buy_deserve') >= 0){
        //当前放假酬勤消息
        console.log(data.toString());
    }else if(data.indexOf('type@=rss') >= 0){
        //当前房间直播状态
        console.log(data.toString());
        var ss = msg.match(/ss@=(.*?)\//g)[0].replace('ss@=', '') == 0 ?"没有直播":"正在直播";
        var endtime = msg.match(/endtime@=(.*?)\//g)[0].replace('endtime@=', '') == 0 ?"没有直播":"正在直播";
        console.log(`房间直播状态-${ss}-关播时间：${endtime}`);
    }else{
//        console.log("1"); //在这里显示其它类型的消息
    }
})



