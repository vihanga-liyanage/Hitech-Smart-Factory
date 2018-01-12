/**
 * Created by Vihanga Liyanage on 12/20/2017.
 */

var USERS;
var LOGGED_IN_USER;
var SELECTED_USER = null;
var FACTORIES;

function setUsers() {

    //get data by calling the servlet
    jQuery.ajax({
        url: 'UserController?action=listAllAdminUsers',
        success: function (data) {
            // console.log(JSON.parse(data));
            if (data != "") {
                USERS = JSON.parse(data);
                var userTable = $('#user-table');
                USERS.forEach(function (u) {
                    if (u.branches == null)
                        u.branches = [];
                    if (u.sections == null)
                        u.sections = [];
                    if (u.prodlines == null)
                        u.prodlines = [];
                    addUserRow(userTable, u)
                });
            }
        },
        async: false
    });
}

function addUserRow(table, user) {
    var tbody = table["0"].tBodies["0"];
    var row = document.createElement("tr");

    var idCell = document.createElement("td");
    idCell.setAttribute("style", "display:none;");
    var nameCell = document.createElement("td");
    var usernameCell = document.createElement("td");
    var factoryCell = document.createElement("td");
    var actionCell = document.createElement("td");

    var idTextNode = document.createTextNode(user.uid);
    var nameTextNode = document.createTextNode(user.name);
    var factoryTextNode = document.createTextNode(user.factoryName);
    var usernameTextNode = document.createTextNode(user.username);
    var editAction = document.createElement("a");
    editAction.setAttribute('onclick',"showEditUser(this)");
    editAction.setAttribute('style', 'cursor: pointer; margin-right:8px;');
    editAction.innerHTML = "Edit";
    var deleteAction = document.createElement("a");
    deleteAction.setAttribute('onclick',"showDeleteUser(this)");
    deleteAction.setAttribute('style', 'cursor: pointer;');
    deleteAction.innerHTML = "Delete";

    idCell.appendChild(idTextNode);
    nameCell.appendChild(nameTextNode);
    usernameCell.appendChild(usernameTextNode);
    factoryCell.appendChild(factoryTextNode);
    actionCell.appendChild(editAction);
    actionCell.appendChild(deleteAction);

    row.appendChild(idCell);
    row.appendChild(nameCell);
    row.appendChild(usernameCell);
    row.appendChild(factoryCell);
    row.appendChild(actionCell);

    tbody.appendChild(row);
}

function setFactories() {

    //get data by calling the servlet
    jQuery.ajax({
        url: 'FactoryController?action=listFactories',
        success: function (data) {
            FACTORIES = JSON.parse(data);
            var addSelect = document.getElementById('add-user-factory-select');
            FACTORIES.forEach(function (f) {
                var addOpt = document.createElement("option");
                addOpt.value= f.fid;
                addOpt.innerHTML = f.name;
                addSelect.appendChild(addOpt);
            });
        },
        async: false
    });
}

function showAddUser() {
    $("#action-form-background").show();
    $("#add-user").show();
    $("#add-user-name").focus();
}

function createNewUser() {
    console.log("createNewUser");
    var name = $("#add-user-name").val();
    var username = $("#add-user-username").val();
    var password = $("#add-user-password").val();
    var factory = $("#add-user-factory-select option:selected").val();
    if (name == "" || username == "" || password == "") {
        alert("Fields cannot be empty!");
    } else if (factory == 0) {
        alert("Please select a factory!");
    } else {
        var type = "a";
        var branches = [];
        var sections = [];
        var prodlines = [];

        $.post('UserController',
            {action: "addUser", name: name, username: username, password: password, type: type, factory: factory,
                branches: JSON.stringify(branches), sections: JSON.stringify(sections), prodlines: JSON.stringify(prodlines)},
            function (data) {
                if (data == "Success") {
                    location.reload();
                }
            });
    }
}

function showEditUser(element) {
    var uid = $(element).parent().parent()["0"].childNodes["0"].innerText;
    for (var i=0; i<USERS.length; i++) {
        if (USERS[i].uid == uid) {
            SELECTED_USER = USERS[i];
            break;
        }
    }

    var name = $(element).parent().parent()["0"].childNodes["1"].innerText;
    $("#update-user-name").val(name);

    $("#action-form-background").show();
    $("#update-user").show();
    $('#update-user-name').focus();

    // console.log(SELECTED_USER);
}

function updateUserName() {
    var newName = $("#update-user-name").val();
    if (newName == "") {
        alert("User name cannot be empty!");
    } else {
        var oldUser = {
            id: SELECTED_USER.uid,
            type: SELECTED_USER.type
        };
        var newUser = SELECTED_USER;
        newUser.name = newName;
        updateUser(oldUser, newUser);
    }
}

function updateUser(oldUser, newUser) {
    // console.log(oldUser, newUser);
    $.post('UserController',
        {action: "updateUser", uid: oldUser.id, oldType: oldUser.type, newName: newUser.name, newType: newUser.type,
            newBranches: JSON.stringify(newUser.branches), newSections: JSON.stringify(newUser.sections),
            newProdlines: JSON.stringify(newUser.prodlines)},
        function (data) {
            if (data == "Success") {
                location.reload();
            }
        });
}

function showDeleteUser(element) {
    var uid = $(element).parent().parent()["0"].childNodes["0"].innerText;
    var name = $(element).parent().parent()["0"].childNodes["1"].innerText;
    var r = confirm("Please confirm deletion of user " + name);
    if (r == true) {
        for (var i=0; i<USERS.length; i++) {
            if (USERS[i].uid == uid) {
                var type = USERS[i].type;
                deleteUser(uid, type);
                break;
            }
        }
    }
}

function deleteUser(uid, type) {
    $.post('UserController', {action: "deleteUser", uid: uid, type: type},
        function (data) {
            if (data == "Success") {
                location.reload();
            }
        });
}

function hideForm(id) {
    $('#' + id).hide();
    // Erase data in input fields
    $("#" + id + " :input[type='text']").value = "";
    $('#action-form-background').hide();
}

function signout() {
    localStorage.setItem("userObj", null);
    window.location.replace("/hitech-smart-factory");
}

function switchToAdminDashboard() {
    window.location.href = "/hitech-smart-factory/FactoryController";
}

$(document).ready(function () {
    // Authenticate user
    var userObj = JSON.parse(localStorage.getItem("userObj"));
    if (userObj != null && userObj.usertype === 'x') {
        LOGGED_IN_USER = userObj;
        setUsers(userObj.uid, userObj.fid);
        setFactories();
    } else {
        localStorage.setItem("userObj", null);
        alert("You're not authorized to be here!");
        window.location.replace("/hitech-smart-factory");
    }
});

