var fs = require('fs'),
    http = require('http'),
    socketio = require('socket.io');

var i = 0,
    j = 0;

var server = http.createServer(function(req, res) {
    res.end(fs.readFileSync(__dirname + '/index.html'));
}).listen(8180, function() {});

var host = "http://img.zhiqingchen.dev.anjuke.com";


var ua = {};

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
    img: host + '/img/ajie.jpg',
    key: '陆云杰',
    string: '坂本辰马云志高杉陆晋助土方十四伊丽莎白杰',
    size: 3
}, {
    img: host + '/img/zhh.jpg',
    key: '张含会',
    string: '定含春空知英秋吉田松张阳服神乐会坂田银时',
    size: 3
}, {
    img: host + '/img/coco.jpg',
    key: '李尉亮',
    string: '明王亮子桂小太郎山崎尉退志村妙冲田总李悟',
    size: 3
}, {
    img: host + '/img/adu.jpg',
    key: '杜一凡',
    string: '杜一风之谷千与几起风了宫崎骏泡妞神器寻凡',
    size: 3
}
]
var page = 1,
    k, gassTime;
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
        var key = getUaKey(msg);
        if (ua[key]) {
            ua[key] = ua[key] + 1;
        } else {
            ua[key] = 1;
        }
    });
    socket.on('gass', function(msg) {
        if (msg.pw != "m123456") return;
        k++;
        if (!gass[k]) k = 0;
        var s = {
            img: gass[k].img,
            size: gass[k].size,
            string: gass[k].string
        }
        gassTime = (+new Date());
        socket.emit('gass', s);
        socket.broadcast.emit('gass', s);
    });
    socket.on('check', function(msg) {
        if (msg.str == gass[k].key) {
            socket.emit('check', {
                status: true
            });

            var p = {
                name: msg.name,
                time: (+new Date()) - gassTime
            }
            socket.emit('prize', p);
            socket.broadcast.emit('prize', p);

        } else {
            socket.emit('check', {
                status: false
            });
        }
    });
    socket.on('graph', function(msg) {
        if (msg.pw != "m123456") return;
        var g = ua;
        socket.emit('graph', g);
        socket.broadcast.emit('graph', g);
    })
    socket.on('disconnect', function() {
        i--;
        socket.emit('count', i);
        socket.broadcast.emit('count', i);
    });
});