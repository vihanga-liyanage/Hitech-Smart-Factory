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

function displayActionForm(id) {
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

function hideActionForm(id) {
    document.getElementById(id).style.display = "none";
    // Erase data in input fields
    var inputFields = $("#" + id + " :input[type='text']");
    for (var i in inputFields) {
        inputFields[i].value = "";
    }
    document.getElementById("action-form-background").style.display = "none";
}

// Triggers when click on a factory box
function selectFactory(id, name, element) {
    var currentFactory = document.getElementById("selected-factory-name").innerText;
    if (currentFactory != name) {
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
                        '\', \'' + branches[i].name + '\',this)">' + branches[i].name + '</button>' +
                        '</div>';
                }
            }
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
                        '\', \'' + sections[i].name + '\',this)">' + sections[i].name + '</button>' +
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
                        '</div>';
                }
            }
            document.getElementById("prod-lines").style.display = "block";
        });
}

function createNewBranch() {
    var branchName = document.getElementById("branch-name").value;
    var branchLocation = document.getElementById("branch-location").value;
    $.post('BranchController', {action: "addBranch", name: branchName, location: branchLocation, factory: selectedFactoryId},
        function (data) {
            if (data == "Success") {
                // Hide action form and regenerate branches
                hideActionForm("create-new-branch");
                setBranches(selectedFactoryId);
            }
        });
}

function createNewSection() {
    var sectionName = document.getElementById("section-name").value;
    $.post('SectionController', {action: "addSection", name: sectionName, branch: selectedBranchId},
        function (data) {
            if (data == "Success") {
                // Hide action form and regenerate branches
                hideActionForm("create-new-section");
                setSections(selectedBranchId);
            }
        });
}

function createNewProdLine() {
    var prodLineName = document.getElementById("prod-line-name").value;
    $.post('ProdLineController', {action: "addProdLine", name: prodLineName, section: selectedSectionId},
        function (data) {
            if (data == "Success") {
                // Hide action form and regenerate branches
                hideActionForm("create-new-prod-line");
                setProdLines(selectedSectionId);
            }
        });
}