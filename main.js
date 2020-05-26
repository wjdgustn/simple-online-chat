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
        console.log('서버 구동중!');
    });
}
else {
    server = http.createServer(app).listen(setting.port, function() {
        console.log('서버 구동중!');
    });
}

const ws = socketio(server, {path: '/socket.io'});

ws.on('connection', (socket) => {
    const req = socket.request;
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    ws.emit('news', { "type":"notice" , "chat" : "새로운 유저가 들어왔습니다!" });
    socket.on('disconnect', () => {
        ws.emit('news', { "type":"notice" , "chat" : "누군가 나갔습니다!" });
    });
    socket.on('news', (data) => {
       if(data.type == "chat") {
           ws.emit('news', data);
           console.log("send");
       }
       console.log("클라이언트 소켓 메시지 : " + JSON.stringify(data));
    });
    socket.on('error', (error) => {
        console.error(error);
    })
});