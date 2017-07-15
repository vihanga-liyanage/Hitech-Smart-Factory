/**
 * Created by Vihanga Liyanage on 7/15/2017.
 */

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

function displayActionForm(id) {
    document.getElementById(id).style.display = "block";
    document.getElementById("action-form-background").style.display = "block";

    // set parent information
    var factory = document.getElementById("selected-factory-name").innerText;
    var branch = document.getElementById("selected-branch-name").innerText;
    var section = document.getElementById("selected-section-name").innerText;
    if (id == "create-new-branch") {
        document.getElementById("branch-parent-details").innerText = factory;
    } else if (id == "create-new-section") {
        document.getElementById("section-parent-details").innerText = factory + ", " + branch;
    } else if (id == "create-new-prod-line") {
        document.getElementById("prod-line-parent-details").innerText = factory + ", " + branch + ", " + section;
    }
}

function hideActionForm(id) {
    document.getElementById(id).style.display = "none";
    document.getElementById("action-form-background").style.display = "none";
}

function selectFactory(name, element) {
    var currentFactory = document.getElementById("selected-factory-name").innerText;
    if (currentFactory != name) {
        // Set active the clicked button
        $('.factory').removeClass('active-box-btn');
        $(element).addClass('active-box-btn') ;

        // Add factory name to branches row
        document.getElementById("selected-factory-name").innerText = name;

        // Hide below rows
        document.getElementById("sections").style.display = "none";
        document.getElementById("prod-lines").style.display = "none";

        // Clear old branches
        var branchesRow = document.getElementById("dynamic-branches");
        branchesRow.innerHTML = "";

        // temp data, should get from db
        var branches;
        if (name == "ABC Factory")
            branches = ["Branch 001", "Colombo Branch"];
        if (name == "Cocacola Factory")
            branches = ["Negambo Branch", "Matara Branch"];
        if (name == "Bata Shoe Factory")
            branches = ["Rathmalana Branch"];

        // populate branch boxes
        for (var i in branches) {
            branchesRow.innerHTML +=
                '<div class="box-btn-wrapper">' +
                '<button class="box-btn branch" onclick="selectBranch(\'' + branches[i] + '\', this)">' + branches[i] + '</button>' +
                '</div>';
        }

        document.getElementById("branches").style.display = "block";
    }
}

function selectBranch(name, element) {
    var currentBranch = document.getElementById("selected-branch-name").innerText;
    if (currentBranch != name) {
        // Set active the clicked button
        $('.branch').removeClass('active-box-btn');
        $(element).addClass('active-box-btn') ;

        // Add factory name to branches row
        document.getElementById("selected-branch-name").innerText = name;

        // Hide below rows
        document.getElementById("prod-lines").style.display = "none";

        // Clear old sections
        var sectionsRow = document.getElementById("dynamic-sections");
        sectionsRow.innerHTML = "";

        // temp data, should get from db
        var sections;
        if (name == "Branch 001")
            sections = ["Section 1", "Section 2"];
        if (name == "Negambo Branch")
            sections = ["Cleaning Section", "Filling Section"];
        if (name == "Rathmalana Branch")
            sections = ["Mold Section", "Sawing Section", "Packing Section"];

        // populate branch boxes
        for (var i in sections) {
            sectionsRow.innerHTML +=
                '<div class="box-btn-wrapper">' +
                '<button class="box-btn section" onclick="selectSection(\'' + sections[i] + '\', this)">' + sections[i] + '</button>' +
                '</div>';
        }

        document.getElementById("sections").style.display = "block";
    }
}

function selectSection(name, element) {
    var currentSection = document.getElementById("selected-section-name").innerText;
    if (currentSection != name) {
        // Set active the clicked button
        $('.section').removeClass('active-box-btn');
        $(element).addClass('active-box-btn') ;

        // Add factory name to branches row
        document.getElementById("selected-section-name").innerText = name;

        // Clear old prod lines
        var prodLinesRow = document.getElementById("dynamic-prod-lines");
        prodLinesRow.innerHTML = "";

        // temp data, should get from db
        var prodLines;
        if (name == "Sawing Section")
            prodLines = ["Production Line 1"];
        if (name == "Filling Section")
            prodLines = ["Left Production Line", "Right Production Line"];
        if (name == "Packing Section")
            prodLines = ["Production Line 1", "Production Line 2", "Production Line 3"];

        // populate branch boxes
        for (var i in prodLines) {
            prodLinesRow.innerHTML +=
                '<div class="box-btn-wrapper">' +
                '<button class="box-btn prod-line">' + prodLines[i] + '</button>' +
                '</div>';
        }

        document.getElementById("prod-lines").style.display = "block";
    }
}