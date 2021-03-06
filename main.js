const express = require('express');
const http = require('http');
const https = require('https');
const url = require('url');
const querystring = require('querystring');
const fs = require('fs');

const socketio = require('socket.io');

const app = express();

const setting = require('./setting.json')

const staticoptions = {
    index: setting.index
}

if(setting.use_ssl) {
    protocol = "https://"
    options = {
        cert: fs.readFileSync(setting.ssl_cert),
        key: fs.readFileSync(setting.ssl_key)
    }
}
else {
    protocol = "http://"
}

app.use(express.static(__dirname + "/public/", staticoptions));

if(setting.use_ssl) {
    server = https.createServer(options, app).listen(setting.port, function() {
        console.log('Server running...');
    });
}
else {
    server = http.createServer(app).listen(setting.port, function() {
        console.log('Server running...');
    });
}

const ws = socketio(server, {path: '/socket.io'});

ws.on('connection', (socket) => {
    const req = socket.request;
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    ws.emit('news', { "type":"notice" , "chat" : "새로운 유저가 들어왔습니다!" });
    console.log(`${ip}가 접속하였습니다.`);
    socket.on('disconnect', () => {
        ws.emit('news', { "type":"notice" , "chat" : "누군가 나갔습니다!" });
        console.log(`${ip}가 접속을 해제하였습니다.`);
    });
    socket.on('news', (data) => {
        if(data.type == "chat") {
            if(data.chat.startsWith('/')) {
               switch(data.chat.replace('/', '')) {
                   case 'clear':
                       socket.emit('news', { "type" : "action" , "value" : "clear_chat" });
                       break;
                   default:
                       socket.emit('news', { "type" : "notice" , "chat" : "명령어 목록<br>/clear : 채팅창을 비웁니다." });
               }
           }
           else {
               ws.emit('news', data);
           }
       }
       console.log("Client Socket Message : " + JSON.stringify(data));
    });
    socket.on('error', (error) => {
        console.error(error);
    })
});