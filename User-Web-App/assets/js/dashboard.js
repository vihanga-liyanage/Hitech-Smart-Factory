/**
 * @author Vihanga Liyanage <vihangaliyanage007@gmail.com>
 */

var editor;

// var PROD_LINE_BASE_URL = "http://localhost:81/hitech-smart-factory/";
var PROD_LINE_BASE_URL = "http://ec2-52-38-15-248.us-west-2.compute.amazonaws.com/hitech-smart-factory/";

//todo read urls from a file
var DSS_BASE_URL = "http://35.192.12.87:9763/services/";

function loadData() {
    //Retrieve user info from session
    var userObj = JSON.parse(localStorage.getItem("userObj"));

    // Setup URL prefix based on user type
    var data = {};
    var URL_PREFIX = "";
    if (userObj.usertype === 'f') {
        URL_PREFIX = "getDashboardDetailsOfFactoryUser/get_dashboard_details_of_factory_user";
        data = {
            _postget_dashboard_details_of_factory_user:{
                uid:userObj.uid
            }
        };
    } else if (userObj.usertype === 'b') {
        URL_PREFIX = "getDashboardDetailsOfBranchUser/get_dashboard_details_of_branch_user";
        data = {
            _postget_dashboard_details_of_branch_user:{
                uid:userObj.uid
            }
        };
    } else if (userObj.usertype === 's') {
        URL_PREFIX = "getDashboardDetailsofSectionUser/get_dashboard_details_of_section_user";
        data = {
            _postget_dashboard_details_of_section_user:{
                uid:userObj.uid
            }
        };
    } else if (userObj.usertype === 'p') {
        URL_PREFIX = "getDashboardDetailsOfProductionlineUser/get_dashboard_details_of_productionline_user";
        data = {
            _postget_dashboard_details_of_productionline_user:{
                uid:userObj.uid
            }
        };
    }

    // get user details from DSS
    $.ajax({
        type: "POST",
        url: DSS_BASE_URL + URL_PREFIX,
        data: JSON.stringify(data),
        headers: {
            "Content-Type":"application/json"
        },
        success: function (response) {
            buildDataJSON(response);
        },
        error: function (xhr, status, error) {
            console.log(xhr);
            console.log(status, error);
        }
    });
}

function buildDataJSON(data) {
    console.log(data);
    var out = {};
    var userObj = JSON.parse(localStorage.getItem("userObj"));
    out.factoryID = userObj.fid;
    out.factory = userObj.factoryName;

    if (userObj.usertype === 'f') {
        var branches = data.Factories.Factory["0"].Branches.Branch;
        var newBranches = [];
        branches.forEach(function (b) {
            var temp = {
                id: b.bid,
                name: b.BranchName,
                sections: resolveSection(b.Sections.Section)
            };
            newBranches.push(temp);
        });
        out.branches = newBranches;

    } else if (userObj.usertype === 'b') {

    } else if (userObj.usertype === 's') {

    } else if (userObj.usertype === 'p') {

    }

    setupMenu(out);
    console.log(out);
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
            name: p.name
        };
        out.push(temp);
    });
    return out;
}

function setupMenu(data) {
    var menuHTML = "";

    var factoryName = data.factory;
    // set company name in header
    $('#company-name').text("- " + factoryName);

    data.branches.forEach(function (branch) {
        var branchName = branch.name;
        menuHTML += '<a href="javascript:void(0);" class="menu-toggle">\n' +
                        '<i class="material-icons">domain</i>\n' +
                        '<span>' + branchName + '</span>\n' +
                    '</a>';

        // setup sections of the branch
        menuHTML += '<ul class="ml-menu">';
        branch.sections.forEach(function (section) {
            var sectionName = section.name;
            menuHTML += '<li><a href="javascript:void(0);" class="menu-toggle">\n' +
                            '<span>' + sectionName + '</span>\n' +
                        '</a>';

            // setup prod lines of the section
            menuHTML += '<ul class="ml-menu">';
            section.prod_lines.forEach(function (prodLine) {
                var prodLinePath = factoryName + '/' + branchName + '/' + sectionName + '/' + prodLine.name;
                menuHTML += '<li><a onclick="prodLineSelected(this, \'' + prodLinePath + '\');">\n' +
                                '<span>' + prodLine.name + '</span>\n' +
                            '</a>';
            });
            menuHTML += '</ul></li>';
        });
        menuHTML += '</ul></li>';
    });

    $('#company-data').html(menuHTML);

    // Loading other scripts are delayed until dashboard details are loaded.
    loadOtherScripts();
}

function loadOtherScripts() {
    // Bootstrap Core Js
    var script = document.createElement('script');
    script.src = "/assets/plugins/bootstrap/js/bootstrap.js";
    document.getElementsByTagName('head')[0].appendChild(script);

    // Slimscroll Plugin Js
    script = document.createElement('script');
    script.src = "/assets/plugins/jquery-slimscroll/jquery.slimscroll.js";
    document.getElementsByTagName('head')[0].appendChild(script);

    // Waves Effect Plugin Js
    script = document.createElement('script');
    script.src = "/assets/plugins/node-waves/waves.js";
    document.getElementsByTagName('head')[0].appendChild(script);

    // Custom Js
    script = document.createElement('script');
    script.src = "/assets/js/admin.js";
    document.getElementsByTagName('head')[0].appendChild(script);
    script = document.createElement('script');
    script.src = "/assets/js/pages/index.js";
    document.getElementsByTagName('head')[0].appendChild(script);
}


/**
 * Function: isNumeric
 *
 * Return true if n is a number
 *
 * Parameters:
 *
 * n - String to check
 *
 * Return: {boolean}
 */
function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function loadProdLine(editor) {
    $('#graph-msg').text('Loading...');
    var name = document.getElementById("prod-line-title").innerText + ".xml";
    name = name.split(" ").join("-");
    var url = PROD_LINE_BASE_URL + name;

    var defaultGraph = '' +
        '<mxGraphModel>' +
            '<root>' +
                '<Diagram label="My Diagram" href="http://www.jgraph.com/" id="0">' +
                    '<mxCell/>' +
                '</Diagram>' +
                '<Layer label="Default Layer" id="1">' +
                    '<mxCell parent="0"/>' +
                '</Layer>' +
            '</root>' +
        '</mxGraphModel>';

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                var doc = mxUtils.parseXml(this.responseText);
                var dec = new mxCodec(doc);
                dec.decode(doc.documentElement, editor.graph.getModel());
                editor.graph.container.focus();
                $('#graph-msg').text('');
            }
            else {
                var doc = mxUtils.parseXml(defaultGraph);
                var dec = new mxCodec(doc);
                dec.decode(doc.documentElement, editor.graph.getModel());
                editor.graph.container.focus();
                $('#graph-msg').text('No data file found');
            }
        }
    };
    xhr.open("GET", url);
    xhr.send();

}

function prodLineSelected(element, path) {
    $('#company-data .active').removeClass('active');
    $(element).parent().toggleClass('active');

    path = path.split(' ').join('-');
    $('#prod-line-title').text(path);
    loadProdLine(editor);
}

function setEditorVar(e) {
    editor = e;
}

// Initiating menu items
$(document).ready(function () {
    loadData();
});
