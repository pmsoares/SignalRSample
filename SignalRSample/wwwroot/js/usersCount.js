"use strict";

// Criar a ligação
var connection = new signalR.HubConnectionBuilder()
    //.configureLogging(signalR.LogLevel.Information)
    .withUrl("/userHub", signalR.HttpTransportType.WebSockets).build();

// Ligar aos métodos que o hub invoca, isto é, receber as notificações do hub
connection.on("updateTotalViews", (value) => {
    var newCountSpan = document.getElementById("totalViewsCounter");
    newCountSpan.innerText = value.toString();
});

connection.on("updateTotalUsers", (value) => {
    var newCountSpan = document.getElementById("totalUsersCounter");
    newCountSpan.innerText = value.toString();
});

// invocar os métodos do hub, isto é, enviar notificações para o hub
function newWindowLoadedOnClient() {
    connection.invoke("NewWindowLoaded", "Pedro").then((value) => console.log(value));
}

// iniciar a ligação
connection.start().then(fulfilled, rejected);

function fulfilled() {
    console.log("Connection to UserHub successful");
    newWindowLoadedOnClient();
}

function rejected() {
    // rejected logs
}