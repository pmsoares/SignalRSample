"use strict";

// Criar a ligação
var connectionUserCount = new signalR.HubConnectionBuilder()
    .withUrl("/userHub")
    .configureLogging(signalR.LogLevel.Information)
    .build();

// Ligar aos métodos que o hub invoca, isto é, receber as notificações do hub
connectionUserCount.on("updateTotalViews", (value) => {
    document.getElementById("totalViewsCounter").innerText = value.toString();
});

connectionUserCount.on("updateTotalUsers", (value) => {
    document.getElementById("totalUsersCounter").innerText = value.toString();
});

async function start() {
    try {
        await connectionUserCount.start();
        console.log("SignalR Connected: UserCount");
        // invocar os métodos no hub, isto é, enviar notificações para o hub
        await connectionUserCount.invoke("NewWindowLoaded", "Pedro").then((value) => console.log(value));
    } catch (err) {
        console.log(err);
        setTimeout(start, 5000);
    }
};

connectionUserCount.onclose(async () => {
    await start();
});

// Start the connection.
start();
