var socket = io.connect(`${location.protocol}//${location.host}`, {
    path: '/socket.io',
});

socket.on('news', function (data) {
    var chatbox = document.getElementById("chatbox");
    if(data.type == "chat") {
        chatbox.innerHTML = `${chatbox.innerHTML}<p class="normal_chat"><xmp>${data.username} : ${data.chat}</xmp></p>`
        chatbox.scrollTo(0, chatbox.scrollHeight);
    }
    if(data.type == "notice") {
        chatbox.innerHTML = `${chatbox.innerHTML}<p class="notice">${data.chat}</p>`
        chatbox.scrollTo(0, chatbox.scrollHeight);
    }
    console.log("서버 소켓 메시지 : " + JSON.stringify(data));
});

function send() {
    var textbox = document.getElementById("textbox");
    var myname = document.getElementById("myname");
    if (textbox.value != "" && myname.value != "") {
        socket.emit('news', {"type": "chat", "username": myname.value, "chat": textbox.value});
        textbox.value = "";
    }
}

pressedkey = [];

function addkey() {
    pressedkey[window.event.keyCode] = true
    if(pressedkey[13]) {
        send();
    }
}

function removekey() {
    pressedkey[window.event.keyCode] = false
}