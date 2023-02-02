"use strict";

var connectionNotification = new signalR.HubConnectionBuilder()
    .withUrl("/notificationHub")
    .configureLogging(signalR.LogLevel.Information)
    .build();

document.getElementById("sendButton").disabled = true;

connectionNotification.on("LoadNotification", function (messages, counter) {
    document.getElementById("messageList").innerHTML = "";
    document.getElementById("notificationCounter").innerHTML = "<span> (" + counter + ")</span>";

    for (let i = messages.length - 1; i >= 0; i--) {
        var li = document.createElement("li");
        li.textContent = "Notification: " + messages[i];
        document.getElementById("messageList").appendChild(li);
    }
});

document.getElementById("sendButton").addEventListener("click", function (event) {
    connectionNotification.send("SendMessage", document.getElementById("notificationInput").value)
        .then(function () {
            document.getElementById("notificationInput").value = "";
        });

    event.preventDefault();
});

connectionNotification.start().then(function () {
    connectionNotification.send("LoadMessages");
    document.getElementById("sendButton").disabled = false;
});