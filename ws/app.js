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
var gass = [{
    img:'http://localhost/img/yilishabai.jpg',
    key:'伊丽莎白',
    string:'坂本辰马志村新八高杉晋助土方十四伊丽莎白',
    size:4
},{
    img:'http://localhost/img/dingchun.jpg',
    key:'定春',
    string:'定春空知英秋吉田松阳服部全蔵神乐坂田银时',
    size:2
},{
    img:'http://localhost/img/hata.jpg',
    key:'HATA王子',
    string:'HATA王子桂小太郎山崎退志村妙冲田总悟',
    size:6
}]
var page = 1,k;
var chat = socketio.listen(server).on('connection', function (socket) {

    socket.emit('topage',page);
    socket.on('chat',function(msg){
        socket.emit('chat',msg);
        socket.broadcast.emit('chat',msg);
    });
    socket.on('topage',function(msg){
        console.log(msg);
        if(msg.pw!="m123456") return;
        page = msg.i;
        socket.emit('topage',msg.i);
        socket.broadcast.emit('topage',msg.i);
    })
    socket.on('count', function(msg){
        i++; 
        socket.emit('count', i);
        socket.broadcast.emit('count', i);

    });
    socket.on('add',function(msg){
        var key = getUaKey(msg);
        if(ua[key]){
            ua[key] = ua[key]+1;
        }else{
            ua[key] = 1;
        }
        console.log(ua);
    });
    socket.on('gass',function(msg){
        if(msg.pw!="m123456") return;
        k++;
        if(!gass[k]) k=0;
        console.log(k);
        var s = {
            img : gass[k].img,
            size : gass[k].size,
            string : gass[k].string
        }
        socket.emit('gass',s);
        socket.broadcast.emit('gass',s);
    })
    socket.on('disconnect', function() {
        i--;
        socket.emit('count', i);
        socket.broadcast.emit('count', i);
    });
});


