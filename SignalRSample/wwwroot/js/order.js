"use strict";

var dataTable;
var connectionOrder = new signalR.HubConnectionBuilder()
    .withAutomaticReconnect()
    .withUrl("/orderHub")
    .build();

$(document).ready(function () {
    loadDataTable();
});

function loadDataTable() {

    dataTable = $('#tblData').DataTable({
        "ajax": {
            "url": "/Home/GetAllOrder"
        },
        language: {
            url: '//cdn.datatables.net/plug-ins/1.13.2/i18n/pt-PT.json'
        },
        "lengthMenu": [
            [10, 25, 50, -1],
            [10, 25, 50, "All"]
        ],
        "pageLength": 50,
        "columns": [
            { "data": "id", "width": "5%" },
            { "data": "name", "width": "15%" },
            { "data": "itemName", "width": "15%" },
            { "data": "count", "width": "15%" },
            {
                "data": "id",
                "render": function (data) {
                    return `
                        <div class="w-75 btn-group" role="group">
                        <a href=""
                        class="btn btn-primary mx-2"> <i class="bi bi-pencil-square"></i> </a>
					    </div>
                        `
                },
                "width": "5%"
            }
        ]
    });
}

connectionOrder.on("newOrder", () => {
    dataTable.ajax.reload();
    toastr.success("New order received!");
});

function fulfilled() {
}

function rejected() {
}

connectionOrder.onclose((error) => {
    document.body.style.background = "red";
});

connectionOrder.onreconnected((connectionId) => {
    document.body.style.background = "green";
    dataTable.ajax.reload();
});

connectionOrder.onreconnecting((error) => {
    document.body.style.background = "orange";
});

connectionOrder.start().then(fulfilled, rejected);