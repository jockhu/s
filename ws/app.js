var fs = require('fs'),
    http = require('http'),
    socketio = require('socket.io');

var i = 0,
    j = 0;

var server = http.createServer(function(req, res) {
    res.end(fs.readFileSync(__dirname + '/index.html'));
}).listen(8180, function() {});

var host = "http://img.zhiqingchen.dev.anjuke.com";


var ua = {},sizes = {};

function getUaKey(ua) {
    if (ua.match(/UCBrowser/i)) { //is UC
        return 'UC' + ua.match(/UCBrowser\/(\d)/)[1];
    } else if (ua.match(/MQQBrowser/i)) { //is qq
        return 'QQ' + ua.match(/MQQBrowser\/(\d)/)[1];
    } else if(ua.match(/baiduboxapp/i)){
        return 'Baidu' + ua.match(/baiduboxapp\/(\d)/)[1];
    } else if (ua.match(/CriOS|Chrome/i)) {
        return 'Chrome';
    } else if (ua.match(/Mozilla\/\d\.\d\s*\((?:iPhone)|(?:iPod)|(?:iPad).*Mac\s*OS.*\)\s*AppleWebKit\/\d*.*Version\/\d.*Mobile\/\w*\s*Safari\/\d*\.\d*\.*\d*$/i)) { //is iphone safari
        return 'Safari';
    } else if (ua.match(/AppleWebKit\/.*Version\/\d(?:\.\d)?\s?Mobile\s*Safari\/\w*\.\w*$/i)) { //is other android self
        return 'Android'
    } else {
        return "other"; //test
    }
}
//socket
var gass = [{
    img: host + '/img/xzy.png',
    key: '徐震宇',
    string: '张尔宁振许胡宇游徐符震嘉户明家敬友时霖岳',
    size: 3
}, {
    img:host + '/img/kjq.png',
    key:'蒯佳祺',
    string:'奇陈家昊蒯克鲁程宣祺梁爱佳郝蔺良宇百致亲',
    size: 3
},{
    img:host + '/img/kjq.png',
    key:'胡志明',
    string:'安兆明英科民居志富赵胡客鹏岸置飞杨环燕于',
    size: 3
},{
    img: host + '/img/youzi.png',
    key: '柚子',
    string: '子田万勇超海果云杨悠珊江玉柚勤冯马庆苹徐',
    size: 2
}, {
    img: host + '/img/coco.png',
    key: '陈志庆',
    string: '程庆郝二志蒋居君陈家驹良昊葛智俊杨祥尔李',
    size: 3
}
]
var page = 1,gassTime,k;
var chat = socketio.listen(server).on('connection', function(socket) {

    socket.emit('topage', page);
    socket.on('chat', function(msg) {
        socket.emit('chat', msg);
        socket.broadcast.emit('chat', msg);
    });
    socket.on('topage', function(msg) {
        if (msg.pw != "m123456") return;
        page = msg.i;
        socket.emit('topage', msg.i);
        socket.broadcast.emit('topage', msg.i);
    })
    socket.on('count', function(msg) {
        i++;
        socket.emit('count', i);
        socket.broadcast.emit('count', i);

    });
    socket.on('add', function(msg) {
        if (!msg) return;
        var key = getUaKey(msg.ua);
        if (ua[key]) {
            ua[key] = ua[key] + 1;
        } else {
            ua[key] = 1;
        }
        var size = msg.size;
        if(sizes[size]){
            sizes[size] += 1;
        }else{
            sizes[size] = 1;
        }
    });
    socket.on('gass', function(msg) {
        if (msg.pw != "m123456") return;
        k = msg.index;
        if(!gass[k])return;
        var s = {
            img: gass[k].img,
            size: gass[k].size,
            string: gass[k].string,
            index: k
        }
        gassTime = (+new Date());
        socket.emit('gass', s);
        socket.broadcast.emit('gass', s);
    });
    socket.on('check', function(msg) {
        if (msg.str == gass[k].key) {
            socket.emit('check', {
                status: true,
                index:k
            });

            var p = {
                name: msg.name,
                time: (+new Date()) - gassTime,
                index:k
            }
            socket.emit('prize', p);
            socket.broadcast.emit('prize', p);

        } else {
            socket.emit('check', {
                status: false,
                index:k
            });
        }
    });
    socket.on('graph', function(msg) {
        if (msg.pw != "m123456") return;
        var g = ua;
        socket.emit('graph', g);
        socket.broadcast.emit('graph', g);
    });
    socket.on('size', function(msg) {
        if (msg.pw != "m123456") return;
        var g = sizes;
        socket.emit('size', g);
        socket.broadcast.emit('size', g);
    });
    socket.on('disconnect', function() {
        i--;
        socket.emit('count', i);
        socket.broadcast.emit('count', i);
    });
});