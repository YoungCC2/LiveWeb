var net = require('net');
var uuid = require('node-uuid');
var md5 = require('md5');
var request = require('request');

var HOST = '220.167.12.147';
var PORT = 8602; //8601,12602,12601

var  roomid = "606118";
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
	request({uri:'http://www.douyutv.com/' + roomid}, function(err, resp, body) {
/*		var server_config = JSON.parse(body.match(/room_args = (.*?)\}\;/g)[0].replace('room_args = ', '').replace(';', ''));
        console.log(server_config);
//		server_config = JSON.parse(unescape(server_config['server_config']));*/
	     callback("118.118.218.250", "8602");
	});
}



function getGroupId(roomid, callback)
{
	var rt = new Date().now;
	var devid = uuid.v4().replace(/-/g, '');
	var vk = md5(rt + '7oE9nPEG9xXV69phU31FYCLUagKeYtsF' + devid)
	var req = 'type@=loginreq/username@=/password@=/roomid@=' + 
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
    var req = "type@=loginreq/username@=s101yh/password@=123456/roomid@=421065/ct@=2/";
    send(socket,req);
    
});

setInterval(function() {
    send(socket, 'type@=keeplive/tick@=70/'); //send keep alive message repeatly
}, 50000);

socket.on('data', function(data) {
    if (data.indexOf('type@=loginres') >= 0) {
            //登录成功 
        //        getGroupId(roomid, function (gid) {
        //            console.log('gid of room[' + roomid + '] is ' + gid)
        //            send(socket, 'type@=joingroup/rid@=' + 65962 + '/gid@=' + 2 + '/');
        //        });
        send(socket, 'type@=joingroup/rid@=' + 208114 + '/gid@=' + -9999 + '/');
    } else if (data.indexOf('type@=chatmsg') >= 0) {
        var msg = data.toString();
        var snick = msg.match(/nn@=(.*?)\//g)[0].replace('snick@=', '');
        var content = msg.match(/txt@=(.*?)\//g) ? msg.match(/txt@=(.*?)\//g)[0].replace('content@=', '')  : "error";
        snick = snick.substring(0, snick.length - 1);
        content = content.substring(0, content.length - 1);
        console.log(snick + ': ' + content); // 弹幕
    } else if (data.indexOf('type@=userenter') >= 0 ||
        data.indexOf('type@=keeplive') >= 0 ||
        data.indexOf('type@=dgn/gfid@=131') >= 0 ||
        data.indexOf('type@=blackres') >= 0 ||
        data.indexOf('type@=dgn/gfid@=129') >= 0 ||
        data.indexOf('type@=upgrade') >= 0 ||
        data.indexOf('type@=ranklist') >= 0 ||
        data.indexOf('type@=onlinegift') >= 0) {

    } else if (data.indexOf('type@=spbc') >= 0) {
        var drid = data.toString().match(/drid@=(.*?)\//g)[0].replace('drid@=', '');
        drid = drid.substring(0, drid.length - 1);
        console.log('rocket! room id:' + drid);
    } else {
//        console.log("1"); //在这里显示其它类型的消息
    }
})



