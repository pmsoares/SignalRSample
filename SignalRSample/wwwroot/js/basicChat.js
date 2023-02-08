"use strict";

var connectionBasicChat = new signalR.HubConnectionBuilder()
    .withUrl("/basicChatHub")
    .build();

document.getElementById("sendMessage").disabled = true;

connectionBasicChat.on("MessageReceived", function (user, message) {
    var li = document.createElement("li");
    document.getElementById("messagesList").appendChild(li);
    li.textContent = `${user} - ${message}`;
});

document.getElementById("sendMessage").addEventListener("click", function (event) {
    var sender = document.getElementById("senderEmail").value;
    var receiver = document.getElementById("receiverEmail").value;
    var message = document.getElementById("chatMessage").value;

    if (receiver.length > 0) {
        connectionBasicChat.send("SendMessageToReceiver", sender, receiver, message);
    }
    else {
        // enviar mensagem para todos os utilizadores
        connectionBasicChat.send("SendMessageToAll", sender, message).catch(function (err) {
            return console.error(err.toString());
        });
    }

    event.preventDefault();
});

connectionBasicChat.start().then(function () {
    document.getElementById("sendMessage").disabled = false;
});