"use strict";

// Criar a ligação
var connectionUserCount = new signalR.HubConnectionBuilder().withUrl("/userHub").build();

// Ligar aos métodos que o hub invoca, isto é, receber as notificações do hub
connectionUserCount.on("updateTotalViews", (value) => {
    var newCountSpan = document.getElementById("totalViewsCounter");
    newCountSpan.innerText = value.toString();
});

connectionUserCount.on("updateTotalUsers", (value) => {
    var newCountSpan = document.getElementById("totalUsersCounter");
    newCountSpan.innerText = value.toString();
});

// iniciar a ligação
connectionUserCount.start().then(fulfilled, rejected);

function fulfilled() {
    console.log("Connection to UserHub successful");
    // invocar os métodos no hub, isto é, enviar notificações para o hub
    connectionUserCount.invoke("NewWindowLoaded", "Pedro").then((value) => console.log(value));
}

function rejected() {
    // rejected logs
}