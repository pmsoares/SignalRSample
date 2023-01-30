// Criar a ligação
var connectionUserCount = new signalR.HubConnectionBuilder().withUrl("/hubs/userCount").build();

// Ligar aos métodos que o hub invoca, isto é, receber as notificações do hub
connectionUserCount.on("updateTotalViews", (value) => {
    var newCountSpan = document.getElementById("totalViewsCounter");
    newCountSpan.innerText = value.toString();
});

// invocar os métodos do hub, isto é, enviar notificações para o hub
function newWindowLoadedOnClient() {
    connectionUserCount.send("NewWindowLoaded");
}


// iniciar a ligação
function fulfilled() {
    //fazer alguma coisa no início
    console.log("Connection to UserHub successful");
    newWindowLoadedOnClient();
}

function rejected() {
    // rejected logs
}

connectionUserCount.start().then(fulfilled, rejected);