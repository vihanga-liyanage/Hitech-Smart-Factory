/**
 * Created by Vihanga Liyanage on 12/20/2017.
 */

var data = {
    "Factories": {
        "Factory": [
            {
                "Branches": {
                    "Branch": [
                        {
                            "BranchName": "Main Branch",
                            "bid": 1,
                            "Sections": {
                                "Section": [
                                    {
                                        "SectionName": "Sawing Section",
                                        "sid": 1,
                                        "Productionlines": {
                                            "Productionline": [
                                                {
                                                    "Name": "Test",
                                                    "pid": 1
                                                },
                                                {
                                                    "Name": "Saw-1",
                                                    "pid": 3
                                                }
                                            ]
                                        }
                                    },
                                    {
                                        "SectionName": "Molding Section",
                                        "sid": 6,
                                        "Productionlines": {
                                            "Productionline": [
                                                {
                                                    "Name": "Prod-1",
                                                    "pid": 7
                                                },
                                                {
                                                    "Name": "Mold-2",
                                                    "pid": 17
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        }
                    ]
                }
            }
        ]
    }
};

// todo edit delete actions, permissions changing, add new user
var USERS;

function setUsers(factoryId) {

    //get data by calling the servlet
    jQuery.ajax({
        url: 'UserController?action=listAllUsers&id=' + factoryId,
        success: function (data) {
            console.log(JSON.parse(data));
            if (data != "") {
                USERS = JSON.parse(data);
                var userTable = $('#user-table');
                USERS.forEach(function (u) {
                    addUserRow(userTable, u)
                });

                buildDataJSON();
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
    var actionCell = document.createElement("td");

    var idTextNode = document.createTextNode(user.uid);
    var nameTextNode = document.createTextNode(user.name);
    var usernameTextNode = document.createTextNode(user.username);
    var editAction = document.createElement("a");
    editAction.setAttribute('onclick',"editUser()");
    editAction.setAttribute('style', 'cursor: pointer; margin-right:8px;');
    editAction.innerHTML = "Edit";
    var deleteAction = document.createElement("a");
    deleteAction.setAttribute('onclick',"deleteUser()");
    deleteAction.setAttribute('style', 'cursor: pointer;');
    deleteAction.innerHTML = "Delete";

    idCell.appendChild(idTextNode);
    nameCell.appendChild(nameTextNode);
    usernameCell.appendChild(usernameTextNode);
    actionCell.appendChild(editAction);
    actionCell.appendChild(deleteAction);

    row.appendChild(idCell);
    row.appendChild(nameCell);
    row.appendChild(usernameCell);
    row.appendChild(actionCell);

    tbody.appendChild(row);
}

function createNewUser() {
    console.log("createNewUser");
    var name = "Test 1";
    var username = "test-1";
    var type = "b";
    var factory = 3;
    var branches = JSON.stringify(['2', '4']);
    var sections = JSON.stringify([]);
    var prodlines = JSON.stringify([]);

    console.log("Creating new user " + name + " " + username + " " + type + " " + factory);
    $.post('UserController',
        {action: "addUser", name: name, username: username, type: type, factory: factory,
            branches: branches, sections: sections, prodlines: prodlines},
        function (data) {
            if (data == "Success") {
                console.log("Success");
            }
        });
}

function updateUser() {
    console.log("updateUser");
    var uid = 21;
    var oldName = "Test 3";
    var oldType = "s";

    var newName = "Test 4";
    var newType = "p";
    var newBranches = JSON.stringify([]);
    var newSections = JSON.stringify([]);
    var newProdlines = JSON.stringify(['2', '5']);

    console.log("Updating user: " + oldName);
    $.post('UserController',
        {action: "updateUser", uid: uid, oldName: oldName, oldType: oldType,
            newName: newName, newType: newType, newBranches: newBranches, newSections: newSections, newProdlines: newProdlines},
        function (data) {
            if (data == "Success") {
                console.log("Success");
            }
        });
}

function deleteUser() {
    var r = confirm("Please confirm user deletion.");
    var uid = 22;
    var type = 'b';
    if (r == true) {
        $.post('UserController', {action: "deleteUser", uid: uid, type: type},
            function (data) {
                if (data == "Success") {
                    console.log("User deleted");
                }
            });
    }
}

function signout() {
    localStorage.setItem("userObj", null);
    window.location.replace("/hitech-smart-factory");
}

function switchToAdminDashboard() {
    window.location.href = "/hitech-smart-factory/FactoryController";
}

function setUserPermissions(id) {
    for (var i=0; i<USERS.length; i++) {
        var user = USERS[i];
        if (user.uid == id) {
            // uncheck all
            $('#permission-grid-wrapper').find('input[type=checkbox]:checked').removeAttr('checked');

            if (user.type == 'b') {
                user.branches.forEach(function (b) {
                    $('#branch-' + b).prop( "checked", true );
                });
            } else if (user.type == 's') {
                user.sections.forEach(function (s) {
                    $('#section-' + s).prop( "checked", true );
                });
            }else if (user.type == 'p') {
                user.prodlines.forEach(function (p) {
                    $('#prodline-' + p).prop( "checked", true );
                });
            }
            break;
        }
    }
}

function buildDataJSON() {
    // todo call DSS to get data

    var out = {};
    var userObj = JSON.parse(localStorage.getItem("userObj"));
    out.factoryID = userObj.fid;
    out.factory = userObj.factoryName;

    var branches;
    var newBranches;
    branches = data.Factories.Factory["0"].Branches.Branch;
    newBranches = [];
    branches.forEach(function (b) {
        var temp = {
            id: b.bid,
            name: b.BranchName,
            sections: resolveSection(b.Sections.Section)
        };
        newBranches.push(temp);
    });

    out.branches = newBranches;
    setupFactoryMenu(out);
}

function resolveSection(sections) {
    var out = [];
    sections.forEach(function (s) {
        var temp = {
            id: s.sid,
            name: s.SectionName,
            prod_lines: resolveProdline(s.Productionlines.Productionline)
        };
        out.push(temp);
    });
    return out;
}

function resolveProdline(prodlines) {
    var out = [];
    prodlines.forEach(function (p) {
        var temp = {
            id: p.pid,
            name: p.Name
        };
        out.push(temp);
    });
    return out;
}

function setupFactoryMenu(data) {
    var container = document.getElementById("permission-grid-wrapper");

    // set factory
    addCheckbox(container, 'factory', data.factoryID, data.factory);

    data.branches.forEach(function (branch) {
        addCheckbox(container, 'branch', branch.id, branch.name);

        // setup sections of the branch
        branch.sections.forEach(function (section) {
            addCheckbox(container, 'section', section.id, section.name);

            section.prod_lines.forEach(function (prodLine) {
                addCheckbox(container, 'prodline', prodLine.id, prodLine.name);
            });
        });
    });
}

function addCheckbox(container, type, id, name) {
    var checkbox = document.createElement('input');
    checkbox.type = "checkbox";
    checkbox.value = id;
    checkbox.id = type + "-" + id;
    checkbox.className = type + "-check";

    var label = document.createElement('label');
    label.htmlFor = type + "-" + id;
    label.appendChild(document.createTextNode(name));

    var br = document.createElement('br');

    container.appendChild(checkbox);
    container.appendChild(label);
    container.appendChild(br);
}

$(document).ready(function () {
    // user table row select event
    var selectedRow;
    $("#user-table").delegate("tr", "click", function(){
        if (selectedRow != null) {
            selectedRow.css( "background-color", "#f7f7f7" );
        }
        $( this ).css( "background-color", "#acceea" );

        selectedRow = $( this );
        var id = $(this).find("td").eq(0).html();
        setUserPermissions(id);
    });

    // Authenticate user
    var userObj = JSON.parse(localStorage.getItem("userObj"));
    if (userObj != null && userObj.usertype === 'a') {
        setUsers(userObj.fid);
    } else if (userObj != null && userObj.usertype === 'x') {
        // setFactory('all');
    } else {
        localStorage.setItem("userObj", null);
        alert("You're not authorized to be here!")
        window.location.replace("/hitech-smart-factory");
    }
});

