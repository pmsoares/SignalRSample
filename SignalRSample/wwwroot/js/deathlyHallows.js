"use strict";

var cloakSpan = document.getElementById("cloakCounter");
var stoneSpan = document.getElementById("stoneCounter");
var wandSpan = document.getElementById("wandCounter");

const connectionDeathlyHallows = new signalR.HubConnectionBuilder()
    .withUrl("/deathlyhallowsHub")
    .configureLogging(signalR.LogLevel.Information)
    .build()

connectionDeathlyHallows.on("updateDeathlyHallowCount", (cloak, stone, wand) => {
    cloakSpan.innerText = cloak.toString();
    stoneSpan.innerText = stone.toString();
    wandSpan.innerText = wand.toString();
});

async function start() {
    try {
        await connectionDeathlyHallows.start();
        console.log("SignalR Connected: DeathlyHallows");

        await connectionDeathlyHallows.invoke("GetRaceStatus").then((raceCounter) => {
            cloakSpan.innerText = raceCounter.cloak.toString();
            stoneSpan.innerText = raceCounter.stone.toString();
            wandSpan.innerText = raceCounter.wand.toString();
        });
    } catch (err) {
        console.log(err);
        setTimeout(start, 5000);
    }
};

connectionDeathlyHallows.onclose(async () => {
    await start();
});

// Start the connection.
start();
