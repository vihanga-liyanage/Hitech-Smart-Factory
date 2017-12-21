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
                        },
                        {
                            "BranchName": "Other Branch",
                            "bid": 2,
                            "Sections": {
                                "Section": [
                                    {
                                        "SectionName": "Cleaning Section",
                                        "sid": 2,
                                        "Productionlines": {
                                            "Productionline": [
                                                {
                                                    "Name": "Test",
                                                    "pid": 2
                                                },
                                                {
                                                    "Name": "Saw-1",
                                                    "pid": 4
                                                }
                                            ]
                                        }
                                    },
                                    {
                                        "SectionName": "Molding Section",
                                        "sid": 3,
                                        "Productionlines": {
                                            "Productionline": [
                                                {
                                                    "Name": "Prod-1",
                                                    "pid": 5
                                                },
                                                {
                                                    "Name": "Mold-2",
                                                    "pid": 6
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
var SELECTED_USER = null;
var CHECKED_BRANCHES = [], CHECKED_SECTIONS = [], CHECKED_PRODLINES = [];

function setUsers(uid, factoryId) {

    //get data by calling the servlet
    jQuery.ajax({
        url: 'UserController?action=listAllUsers&id=' + factoryId,
        success: function (data) {
            console.log(JSON.parse(data));
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

                buildDataJSON(uid);
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
    editAction.setAttribute('onclick',"showEditUser(this)");
    editAction.setAttribute('style', 'cursor: pointer; margin-right:8px;');
    editAction.innerHTML = "Edit";
    var deleteAction = document.createElement("a");
    deleteAction.setAttribute('onclick',"showDeleteUser()");
    deleteAction.setAttribute('style', 'cursor: pointer;');
    deleteAction.innerHTML = "Delete";

    idCell.appendChild(idTextNode);
    nameCell.appendChild(nameTextNode);
    if (user.type == 'a') {
        var temp = document.createElement("b");
        temp.appendChild(document.createTextNode(" (Admin)"));
        nameCell.appendChild(temp);
    }
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

function showEditUser(element) {
    var uid = $(element).parent().parent()["0"].childNodes["0"].innerText;
    var name = $(element).parent().parent()["0"].childNodes["1"].innerText;

    $("#update-user-name").val(name);

    $("#action-form-background").show();
    $("#update-user").show();

    for (var i=0; i<USERS.length; i++) {
        if (USERS[i].uid == uid) {
            SELECTED_USER = USERS[i];
            break;
        }
    }
    console.log(SELECTED_USER);
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
    console.log(oldUser, newUser);
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

function setUserPermissions(id) {
    for (var i=0; i<USERS.length; i++) {
        var user = USERS[i];
        if (user.uid == id) {
            // uncheck all
            $('#permission-grid-wrapper').find('input[type=checkbox]:checked').removeAttr('checked');
            $('#permission-grid-wrapper').find('input[type=checkbox]').prop("disabled", false);

            //clear out checked variables
            CHECKED_BRANCHES = []; CHECKED_SECTIONS = []; CHECKED_PRODLINES = [];

            // check relevant checkboxes
            if (user.type == 'f') {
                $('#factory-' + user.factory + "-check").click();
            } else if (user.type == 'b') {
                user.branches.forEach(function (b) {
                    $('#branch-' + b + "-check").click();
                });
            } else if (user.type == 's') {
                user.sections.forEach(function (s) {
                    $('#section-' + s + "-check").click();
                });
            }else if (user.type == 'p') {
                user.prodlines.forEach(function (p) {
                    $('#prodline-' + p + "-check").click();
                });
            }

            // set title
            $('#permission-grid-header').text("Permissions of " + user.name);

            //special case - admin user
            if (user.type == 'a') {
                $('#permission-grid-wrapper').find('input, button').prop("disabled", true);
                $('#permission-grid-header').text("Please select a user to view permissions");
            } else {
                $('#permission-grid-wrapper').find('button').prop("disabled", false);
            }

            // set selected user
            SELECTED_USER = user;
            break;
        }
    }
}

function buildDataJSON(uid) {

    $.ajax({
        type: "POST",
        // todo use a config file for url
        url: "http://35.202.158.138:9763/services/getDashboardDetailsOfFactoryUser/get_dashboard_details_of_factory_user",
        headers: {
            "Content-Type":"application/json"
        },
        data: JSON.stringify({
            _postget_dashboard_details_of_factory_user: {
                uid: uid
            }
        }),
        dataType: "json",
        success: function (response) {
            var out = {};
            var userObj = JSON.parse(localStorage.getItem("userObj"));
            out.factoryID = userObj.fid;
            out.factory = userObj.factoryName;

            var branches;
            var newBranches;
            branches = response.Factories.Factory["0"].Branches.Branch;
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
        },
        error: function (xhr, status, error) {
            console.log(xhr);
            console.log(status, error);
        }
    });
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
    var factoryDiv = document.createElement('div');
    factoryDiv.id = 'factory-' + data.factoryID + '-div';

    data.branches.forEach(function (branch) {
        addCheckbox(factoryDiv, 'branch', branch.id, branch.name);
        var branchDiv = document.createElement('div');
        branchDiv.id = 'branch-' + branch.id + '-div';
        branchDiv.className = "sections";

        // setup sections of the branch
        branch.sections.forEach(function (section) {
            addCheckbox(branchDiv, 'section', section.id, section.name);
            var sectionDiv = document.createElement('div');
            sectionDiv.id = 'section-' + section.id + '-div';
            sectionDiv.className = "prodlines";

            section.prod_lines.forEach(function (prodLine) {
                addCheckbox(sectionDiv, 'prodline', prodLine.id, prodLine.name);
            });
            branchDiv.appendChild(sectionDiv);
        });
        factoryDiv.appendChild(branchDiv);
    });
    container.appendChild(factoryDiv);

    setPermissionCheckBoxesEvent();
}

function addCheckbox(container, type, id, name) {
    var checkbox = document.createElement('input');
    checkbox.type = "checkbox";
    checkbox.value = id;
    checkbox.id = type + "-" + id + "-check";
    checkbox.className = type + "-check";

    var label = document.createElement('label');
    label.htmlFor = type + "-" + id + "-check";
    label.appendChild(document.createTextNode(name));

    var br = document.createElement('br');

    container.appendChild(checkbox);
    container.appendChild(label);
    container.appendChild(br);
}

function setPermissionCheckBoxesEvent() {
    // permission checkbox check event
    $("input:checkbox").on('click', function () {
        var checkID = $(this)["0"].id;
        var checkDivID = checkID.substring(0, checkID.length - 5) + 'div';
        var type = checkID.split('-')[0];

        // update variables, disable checkboxes as necessary
        if ($(this).prop("checked")) {
            if (type == 'factory') {
                $('#' + checkDivID + ' :input').prop("disabled", true);
                $('#' + checkDivID).find('input[type=checkbox]').prop('checked', true);
                CHECKED_BRANCHES = [];
                CHECKED_SECTIONS = [];
                CHECKED_PRODLINES = [];
            } else if (type == 'branch') {
                $('.sections :input').prop("disabled", true);
                CHECKED_BRANCHES.push(checkDivID);
                CHECKED_SECTIONS = [];
                CHECKED_PRODLINES = [];
                checkChildren(CHECKED_BRANCHES);
            } else if (type == 'section') {
                $('.prodlines :input').prop("disabled", true);
                CHECKED_SECTIONS.push(checkDivID);
                CHECKED_PRODLINES = [];
                checkChildren(CHECKED_SECTIONS);
            } else if (type == 'prodline') {
                CHECKED_PRODLINES.push(checkDivID);
            }
        } else {
            if (type == 'factory') {
                $('#' + checkDivID + ' :input').prop("disabled", false);
            } else if (type == 'branch') {
                CHECKED_BRANCHES.splice(CHECKED_BRANCHES.indexOf(checkDivID), 1);
                if (CHECKED_BRANCHES.length == 0)
                    $('.sections :input').prop("disabled", false);
            } else if (type == 'section') {
                CHECKED_SECTIONS.splice(CHECKED_SECTIONS.indexOf(checkDivID), 1);
                if (CHECKED_SECTIONS.length == 0)
                    $('.prodlines :input').prop("disabled", false);
            } else if (type == 'prodline') {
                CHECKED_PRODLINES.splice(CHECKED_PRODLINES.indexOf(checkID), 1);
            }
            $('#' + checkDivID).find('input[type=checkbox]').prop('checked', false);
        }

        // console.log(CHECKED_BRANCHES, CHECKED_SECTIONS, CHECKED_PRODLINES);
    });
}

function updatePermissionsBtnClick() {
    if (SELECTED_USER == null) {
        alert("Please select a user to update permissions");
    } else {
        var r = confirm("Please confirm permission update for " + SELECTED_USER.name);
        if (r == true) {
            var checkedBoxes = $('#permission-grid-wrapper').find('input[type=checkbox]:checked');
            var newType = "";
            var temp = "";
            for (var i=0; i<checkedBoxes.length; i++) {
                temp += $(checkedBoxes[i])['0'].id;
            }
            //determine new user type (if no permissions selected, type considers as prodline
            if (temp.indexOf("factory") >= 0) {
                newType = "f";
            } else if (temp.indexOf("branch") >= 0) {
                newType = "b";
            } else if (temp.indexOf("section") >= 0) {
                newType = "s";
            } else {
                newType = "p";
            }

            //construct branch, section or prodline id array
            var idArray = [];
            for (i=0; i<checkedBoxes.length; i++) {
                var id = $(checkedBoxes[i])['0'].id;
                if (id.indexOf(newType) >= 0) {
                    idArray.push(parseInt(id.split("-")[1]));
                }
            }

            var oldUser = {
                id: SELECTED_USER.uid,
                type: SELECTED_USER.type
            };
            var newUser = {
                name: SELECTED_USER.name,
                type: newType,
                branches: [],
                sections: [],
                prodlines: []
            };
            if (newType == 'b') {
                newUser.branches = idArray;
            } else if (newType == 's') {
                newUser.sections = idArray;
            } else if (newType == 'p') {
                newUser.prodlines = idArray;
            }
            updateUser(oldUser, newUser);
        }
    }
}

function checkChildren(parent) {
    $('#permission-grid-wrapper').find('input[type=checkbox]:checked').removeAttr('checked');

    parent.forEach(function (checkDivID) {
        var checkID = checkDivID.substring(0, checkDivID.length - 3) + 'check';
        $('#' + checkID).prop('checked', true);
        $('#' + checkDivID).find('input[type=checkbox]').prop('checked', true);
    });
}

$(document).ready(function () {
    // Authenticate user
    var userObj = JSON.parse(localStorage.getItem("userObj"));
    if (userObj != null && userObj.usertype === 'a') {
        setUsers(userObj.uid, userObj.fid);
    } else if (userObj != null && userObj.usertype === 'x') {
        // setFactory('all');
    } else {
        localStorage.setItem("userObj", null);
        alert("You're not authorized to be here!");
        window.location.replace("/hitech-smart-factory");
    }

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

});

