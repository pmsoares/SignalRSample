"use strict";

let lbl_houseJoined = document.getElementById("lbl_houseJoined");

let btn_un_gryffindor = document.getElementById("btn_un_gryffindor");
let btn_un_slytherin = document.getElementById("btn_un_slytherin");
let btn_un_hufflepuff = document.getElementById("btn_un_hufflepuff");
let btn_un_ravenclaw = document.getElementById("btn_un_ravenclaw");

let btn_gryffindor = document.getElementById("btn_gryffindor");
let btn_slytherin = document.getElementById("btn_slytherin");
let btn_hufflepuff = document.getElementById("btn_hufflepuff");
let btn_ravenclaw = document.getElementById("btn_ravenclaw");

let trigger_gryffindor = document.getElementById("trigger_gryffindor");
let trigger_slytherin = document.getElementById("trigger_slytherin");
let trigger_hufflepuff = document.getElementById("trigger_hufflepuff");
let trigger_ravenclaw = document.getElementById("trigger_ravenclaw");

var connection = new signalR.HubConnectionBuilder().withUrl("/houseGroupHub").build();

btn_gryffindor.addEventListener("click", function (event) {
    connection.send("JoinHouse", "Gryffindor");
    event.preventDefault();
});
btn_slytherin.addEventListener("click", function (event) {
    connection.send("JoinHouse", "Slytherin");
    event.preventDefault();
});
btn_hufflepuff.addEventListener("click", function (event) {
    connection.send("JoinHouse", "Hufflepuff");
    event.preventDefault();
});
btn_ravenclaw.addEventListener("click", function (event) {
    connection.send("JoinHouse", "Ravenclaw");
    event.preventDefault();
});

btn_un_gryffindor.addEventListener("click", function (event) {
    connection.send("LeaveHouse", "Gryffindor");
    event.preventDefault();
});
btn_un_slytherin.addEventListener("click", function (event) {
    connection.send("LeaveHouse", "Slytherin");
    event.preventDefault();
});
btn_un_hufflepuff.addEventListener("click", function (event) {
    connection.send("LeaveHouse", "Hufflepuff");
    event.preventDefault();
});
btn_un_ravenclaw.addEventListener("click", function (event) {
    connection.send("LeaveHouse", "Ravenclaw");
    event.preventDefault();
});

trigger_gryffindor.addEventListener("click", function (event) {
    connection.send("TriggerHouseNotify", "Gryffindor");
    event.preventDefault();
});
trigger_slytherin.addEventListener("click", function (event) {
    connection.send("TriggerHouseNotify", "Slytherin");
    event.preventDefault();
});
trigger_hufflepuff.addEventListener("click", function (event) {
    connection.send("TriggerHouseNotify", "Hufflepuff");
    event.preventDefault();
});
trigger_ravenclaw.addEventListener("click", function (event) {
    connection.send("TriggerHouseNotify", "Ravenclaw");
    event.preventDefault();
});

connection.on("triggerHouseNotification", (houseName) => {
    toastr.success(`A new notification for ${houseName} has been launched.`);
});

connection.on("newMemberAddedToHouse", (houseName) => {
    toastr.success(`Member has subscribed to ${houseName}`);
});

connection.on("newMemberRemovedFromHouse", (houseName) => {
    toastr.warning(`Member has unsubscribed to ${houseName}`);
});

connection.on("subscriptionStatus", (strGroupsJoined, houseName, hasSubscribed) => {
    lbl_houseJoined.innerText = strGroupsJoined;

    if (hasSubscribed) {
        switch (houseName) {
            case 'Gryffindor':
                btn_gryffindor.style.display = "none";
                btn_un_gryffindor.style.display = "";
                break;

            case 'Slytherin':
                btn_slytherin.style.display = "none";
                btn_un_slytherin.style.display = "";
                break;

            case 'Hufflepuff':
                btn_hufflepuff.style.display = "none";
                btn_un_hufflepuff.style.display = "";
                break;

            case 'Ravenclaw':
                btn_ravenclaw.style.display = "none";
                btn_un_ravenclaw.style.display = "";
                break;

            default:
                break;
        }

        toastr.success(`You have subscribed successfully to ${houseName}`);
    }
    else {
        switch (houseName) {
            case 'Gryffindor':
                btn_gryffindor.style.display = "";
                btn_un_gryffindor.style.display = "none";
                break;

            case 'Slytherin':
                btn_slytherin.style.display = "";
                btn_un_slytherin.style.display = "none";
                break;

            case 'Hufflepuff':
                btn_hufflepuff.style.display = "";
                btn_un_hufflepuff.style.display = "none";
                break;

            case 'Ravenclaw':
                btn_ravenclaw.style.display = "";
                btn_un_ravenclaw.style.display = "none";
                break;

            default:
                break;
        }

        toastr.success(`You have unsubscribed successfully to ${houseName}`);
    }
})

connection.start().then(fulfilled, rejected);

function fulfilled() {
}

function rejected() {
}