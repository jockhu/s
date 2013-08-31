var fs = require('fs'), http = require('http'), socketio = require('socket.io');

var i = 0,j=0;

var server = http.createServer(function(req, res) {
 console.log(req.headers)
    res.end(fs.readFileSync(__dirname + '/index.html'));
}).listen(8180, function() {
});




var ua={};
    function getUaKey(ua){
        if(ua.match(/UCBrowser/i)){ //is UC
            return ua.match(/(?:Android)|(?:iPhone)/)+'UC'+ ua.match(/UCBrowser\/(\d)/)[1];
        }
        else if(ua.match(/MQQBrowser/i)){ //is qq
            return ua.match(/(?:Android)|(?:iPhone)/)+'QQ'+ ua.match(/MQQBrowser\/(\d)/)[1];
        }else if(ua.match(/CriOS/i)){
            return 'chrome';
        }
        else if(ua.match(/Mozilla\/\d\.\d\s*\((?:iPhone)|(?:iPod).*Mac\s*OS.*\)\s*AppleWebKit\/\d*.*Version\/\d.*Mobile\/\w*\s*Safari\/\d*\.\d*\.*\d*$/i)){//is iphone safari
            return 'Mobile_Safari';
        }
        else if(ua.match(/MI.*\/.*AppleWebKit\/.*Version\/\d(?:\.\d)?\s?Mobile\s*Safari\/\w*\.\w*$/i)||ua.match(/AppleWebKit\/.*Version\/\d(?:\.\d)?\s?Mobile\s*Safari\/\w*\.\w*.*XiaoMi\/miuiBrowser/i)){ //is Mi self
            return 'XIAOMI';
        }
        else if(ua.match(/AppleWebKit\/.*Version\/\d(?:\.\d)?\s?Mobile\s*Safari\/\w*\.\w*$/i)){ //is other android self
            return 'Android_Others'
        }
        else if(ua.match(/Mozilla\/.*\(compatible\;Android\;.*\)/)){ //is special UC
            return 'AndroidUC9';
        }
        else{
            return "unknow";//test
        }
    }
//socket
var chat = socketio.listen(server).on('connection', function (socket) {
    socket.on('message', function (msg) {
        socket.emit('message', msg);
        socket.broadcast.emit('message', msg);
    });
    socket.on('chat',function(msg){
        socket.emit('chat',msg);
        socket.broadcast.emit('chat',msg);
    });
    socket.on('count', function(msg){
        var key = getUaKey(msg);
        if(ua[key]){
            ua[key] = ua[key]+1;
        }else{
            ua[key] = 1;
        }
        i++;
        console.log(ua);
     socket.emit('count', i);
     socket.broadcast.emit('count', i);
    });
    socket.on('disconnect', function() {
        i--;
     socket.emit('count', i);
     socket.broadcast.emit('count', i);
    });
});


// var chat = socketio.listen(server).on('connection', function (socket) {
//     socket.on('message', function (msg) {
//         chat.emit('message', msg);
//         console.log(msg);
//     });
//     socket.on('count', function(msg){
//         var key = getUaKey(msg);
//         if(ua[key]){
//             ua[key] = ua[key]+1;
//         }else{
//             ua[key] = 1;
//         }
//         i++;
//         console.log(ua);
//      chat.emit('count', i);    });
//     socket.on('disconnect', function() {
//         i--;
//      chat.emit('count', i);
//     });
// });
