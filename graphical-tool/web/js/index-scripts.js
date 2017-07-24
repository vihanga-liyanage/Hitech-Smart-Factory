/**
 * Created by Vihanga Liyanage on 7/15/2017.
 */

var selectedFactoryId;
var selectedBranchId;
var selectedSectionId;

function changeTab(evt, cityName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
}

function collapseOrHide(element, name) {
    var children = element.parentElement.children;
    for (i in children) {
        // Filter out branches
        if (children[i].className && children[i].className.includes("structure-" + name)) {
            // Change classes to collapse or hide
            $(children[i]).toggleClass('structure-hide').toggleClass('structure-collapse');
        }
    }
}

function displayAddForm(id) {
    document.getElementById(id).style.display = "block";

    document.getElementById("action-form-background").style.display = "block";

    // set parent information
    var factoryName = document.getElementById("selected-factory-name").innerText;
    var branchName = document.getElementById("selected-branch-name").innerText;
    var sectionName = document.getElementById("selected-section-name").innerText;
    if (id == "create-new-branch") {
        document.getElementById("branch-parent-details").innerText = factoryName;
    } else if (id == "create-new-section") {
        document.getElementById("section-parent-details").innerText = factoryName + ", " + branchName;
    } else if (id == "create-new-prod-line") {
        document.getElementById("prod-line-parent-details").innerText = factoryName + ", " + branchName + ", " + sectionName;
    }
}

function hideAddForm(id) {
    document.getElementById(id).style.display = "none";
    // Erase data in input fields
    var inputFields = $("#" + id + " :input[type='text']");
    for (var i in inputFields) {
        inputFields[i].value = "";
    }
    document.getElementById("action-form-background").style.display = "none";
}

function displayEditForm(type, id, name, location) {
    var formId = "update-" + type;
    var form = document.getElementById(formId);
    form.style.display = "block";

    document.getElementById("action-form-background").style.display = "block";

    //set item name
    var searchTag = "update-" + type + "-name";
    document.getElementById(searchTag).value = name;

    //set location
    if (location != undefined) {
        document.getElementById("update-branch-location").value = location;
    }

    //set update function with id
    var methodName = "";
    if (type == "factory") {
        methodName = 'updateFactory(\'' + id + '\', \'' + name + '\')';
    } else if (type == "branch") {
        methodName = 'updateBranch(\'' + id + '\', \'' + name + '\', \'' + location + '\')';
    } else if (type == "section") {
        methodName = 'updateSection(\'' + id + '\', \'' + name + '\')';
    } else if (type == "prod-line") {
        methodName = 'updateProdLine(\'' + id + '\', \'' + name + '\')';
    }
    $(form).children('input[type=submit]').attr('onclick', methodName);
}

// Triggers when click on a factory box
function selectFactory(id, name, element) {
    var currentFactory = document.getElementById("selected-factory-name").innerText;
    if (currentFactory != name) {
        // change cursor
        $("body").css("cursor", "progress");

        // Set active the clicked button
        $('.factory').removeClass('active-box-btn');
        $(element).addClass('active-box-btn') ;

        // Set selected factory name and id
        document.getElementById("selected-factory-name").innerText = name;
        selectedFactoryId = id;

        // Hide below rows
        document.getElementById("sections").style.display = "none";
        document.getElementById("prod-lines").style.display = "none";

        setBranches(id);
    }
}

// Get data using ajax and populate branches of a given factory
function setBranches(factoryId) {
    // Clear old branches
    var branchesRow = document.getElementById("dynamic-branches");
    branchesRow.innerHTML = "";

    //get data by calling the servlet
    $.get('BranchController', {action: "listBranches", id: factoryId},
        function (data) {
            if (data != "") {
                var branches = JSON.parse(data);
                // populate branch boxes
                for (var i in branches) {
                    branchesRow.innerHTML +=
                        '<div class="box-btn-wrapper">' +
                            '<button class="box-btn branch" onclick="selectBranch(\'' + branches[i].bid +
                            '\', \'' + branches[i].name + '\',this)">' + branches[i].name +
                            '</button>' +
                            '<div class="edit-delete-container">' +
                                '<img src="images/hitech/icons/edit-icon.png" alt="Edit" class="edit-delete-img"' +
                                    'onclick="displayEditForm(\'branch\', \'' + branches[i].bid + '\', \'' + branches[i].name
                                    + '\', \'' + branches[i].location + '\')">' +
                                '<img src="images/hitech/icons/delete-icon.png" alt="Delete" class="edit-delete-img"' +
                                    'onclick="deleteBranch(\'' + branches[i].bid + '\')">' +
                            '</div>' +
                        '</div>';
                }
            }
            $("body").css("cursor", "default");
            document.getElementById("branches").style.display = "block";
        });
}

// Triggers when click on a branch box
function selectBranch(id, name, element) {
    var currentBranch = document.getElementById("selected-branch-name").innerText;
    if (currentBranch != name) {
        // Set active the clicked button
        $('.branch').removeClass('active-box-btn');
        $(element).addClass('active-box-btn') ;

        // Add factory name to branches row
        document.getElementById("selected-branch-name").innerText = name;
        selectedBranchId = id;

        // Hide below rows
        document.getElementById("prod-lines").style.display = "none";

        setSections(id);
    }
}

// Get data using ajax and populate sections of a given branch
function setSections(branchId) {
    // Clear old sections
    var sectionsRow = document.getElementById("dynamic-sections");
    sectionsRow.innerHTML = "";

    //get data by calling the servlet
    $.get('SectionController', {action: "listSections", id: branchId},
        function (data) {
            if (data != "") {
                var sections = JSON.parse(data);
                // populate branch boxes
                for (var i in sections) {
                    sectionsRow.innerHTML +=
                        '<div class="box-btn-wrapper">' +
                            '<button class="box-btn section" onclick="selectSection(\'' + sections[i].sid +
                            '\', \'' + sections[i].name + '\',this)">' + sections[i].name +
                            '</button>' +
                            '<div class="edit-delete-container">' +
                                '<img src="images/hitech/icons/edit-icon.png" alt="Edit" class="edit-delete-img"' +
                                    'onclick="displayEditForm(\'section\', \'' + sections[i].sid + '\', \'' + sections[i].name + '\')">' +
                                '<img src="images/hitech/icons/delete-icon.png" alt="Delete" class="edit-delete-img"' +
                                    'onclick="deleteSection(\'' + sections[i].sid + '\')">' +
                            '</div>' +
                        '</div>';
                }
            }
            document.getElementById("sections").style.display = "block";
        });
}

// Triggers when click on a section box
function selectSection(id, name, element) {
    var currentSection = document.getElementById("selected-section-name").innerText;
    if (currentSection != name) {
        // Set active the clicked button
        $('.section').removeClass('active-box-btn');
        $(element).addClass('active-box-btn') ;

        // Add factory name to branches row
        document.getElementById("selected-section-name").innerText = name;
        selectedSectionId = id;

        setProdLines(id);
    }
}

// Get data using ajax and populate production lines of a given section
function setProdLines(sectionId) {
    // Clear old prod lines
    var prodLinesRow = document.getElementById("dynamic-prod-lines");
    prodLinesRow.innerHTML = "";

    //get data by calling the servlet
    $.get('ProdLineController', {action: "listProdLines", id: sectionId},
        function (data) {
            if (data != "") {
                var prodLines = JSON.parse(data);
                // populate branch boxes
                for (var i in prodLines) {
                    prodLinesRow.innerHTML +=
                        '<div class="box-btn-wrapper">' +
                            '<button class="box-btn prod-line">' + prodLines[i].name + '</button>' +
                            '<div class="edit-delete-container">' +
                                '<img src="images/hitech/icons/edit-icon.png" alt="Edit" class="edit-delete-img"' +
                                    'onclick="displayEditForm(\'prod-line\', \'' + prodLines[i].pid + '\', \'' + prodLines[i].name + '\')">' +
                                '<img src="images/hitech/icons/delete-icon.png" alt="Delete" class="edit-delete-img"' +
                                    'onclick="deleteProdLine(\'' + prodLines[i].pid + '\')">' +
                            '</div>' +
                        '</div>';
                }
            }
            document.getElementById("prod-lines").style.display = "block";
        });
}

function createNewBranch() {
    var branchName = document.getElementById("branch-name").value;
    var branchLocation = document.getElementById("branch-location").value;
    console.log("Creating new branch " + branchName + " " + branchLocation);
    $.post('BranchController', {action: "addBranch", name: branchName, location: branchLocation, factory: selectedFactoryId},
        function (data) {
            if (data == "Success") {
                // Hide action form and regenerate branches
                hideAddForm("create-new-branch");
                setBranches(selectedFactoryId);
            }
        });
}

function createNewSection() {
    var sectionName = document.getElementById("section-name").value;
    $.post('SectionController', {action: "addSection", name: sectionName, branch: selectedBranchId},
        function (data) {
            if (data == "Success") {
                // Hide action form and regenerate sections
                hideAddForm("create-new-section");
                setSections(selectedBranchId);
            }
        });
}

function createNewProdLine() {
    var prodLineName = document.getElementById("prod-line-name").value;
    $.post('ProdLineController', {action: "addProdLine", name: prodLineName, section: selectedSectionId},
        function (data) {
            if (data == "Success") {
                // Hide action form and regenerate prod lines
                hideAddForm("create-new-prod-line");
                setProdLines(selectedSectionId);
            }
        });
}

// Appear update and delete icons for box buttons
// $(document).on("mouseenter mouseleave", ".box-btn-wrapper", function() {
//     var element = $(this)["0"].children["1"];
//     if (element) {
//         if (element.style.display == "block") {
//             element.style.display = "none";
//         } else {
//             element.style.display = "block";
//         }
//     }
// });

function updateFactory(id, name) {
    var newName = document.getElementById("update-factory-name").value;
    if (name == newName) {
        alert("Please change the factory name to update!");
    } else {
        $.post('FactoryController', {action: "updateFactory", id:id, 'factory-name': newName},
            function (data) {
                if (data == "Success") {
                    // Refresh page
                    location.reload();
                }
            });
    }
}

function updateBranch(id, name, location) {
    var newName = document.getElementById("update-branch-name").value;
    var newLocation = document.getElementById("update-branch-location").value;
    if (name == newName && location == newLocation) {
        alert("Please change the branch name or location to update!");
    } else {
        $.post('BranchController', {action: "updateBranch", id:id, name: newName, location: newLocation},
            function (data) {
                if (data == "Success") {
                    // Hide action form and regenerate branches
                    hideAddForm('update-branch');
                    setBranches(selectedFactoryId);
                }
            });
    }
}

function updateSection(id, name) {
    var newName = document.getElementById("update-section-name").value;
    if (name == newName) {
        alert("Please change the section name to update!");
    } else {
        $.post('SectionController', {action: "updateSection", id:id, name: newName},
            function (data) {
                if (data == "Success") {
                    // Hide action form and regenerate sections
                    hideAddForm("update-section");
                    setSections(selectedBranchId);
                }
            });
    }
}

function updateProdLine(id, name) {
    var newName = document.getElementById("update-prod-line-name").value;
    if (name == newName) {
        alert("Please change the production line name to update!");
    } else {
        $.post('ProdLineController', {action: "updateProdLine", id:id, name: newName},
            function (data) {
                if (data == "Success") {
                    // Hide action form and regenerate prod lines
                    hideAddForm("update-prod-line");
                    setProdLines(selectedSectionId);
                }
            });
    }
}

function deleteFactory(id, name) {
    var r = confirm("Please confirm factory deletion.\n" +
        "All existing branches, sections and production lines of this factory will be deleted.");
    if (r == true) {
        $.post('FactoryController', {action: "deleteFactory", id:id},
            function (data) {
                if (data == "Success") {
                    // Refresh page
                    location.reload();
                }
            });
    }
}

function deleteBranch(id) {
    var r = confirm("Please confirm branch deletion.\n" +
        "All existing sections and production lines of this branch will be deleted.");
    if (r == true) {
        $.post('BranchController', {action: "deleteBranch", id:id},
            function (data) {
                if (data == "Success") {
                    // Hide below rows
                    document.getElementById("sections").style.display = "none";
                    document.getElementById("prod-lines").style.display = "none";
                    // Regenerate branches
                    setBranches(selectedFactoryId);
                }
            });
    }
}

function deleteSection(id) {
    var r = confirm("Please confirm section deletion.\n" +
        "All existing production lines of this section will be deleted.");
    if (r == true) {
        $.post('SectionController', {action: "deleteSection", id:id},
            function (data) {
                if (data == "Success") {
                    // Hide below rows
                    document.getElementById("prod-lines").style.display = "none";
                    // Regenerate sections
                    setSections(selectedBranchId);
                }
            });
    }
}

function deleteProdLine(id) {
    var r = confirm("Please confirm production line deletion.");
    if (r == true) {
        $.post('ProdLineController', {action: "deleteProdLine", id:id},
            function (data) {
                if (data == "Success") {
                    // Regenerate prod lines
                    setProdLines(selectedSectionId);
                }
            });
    }
}