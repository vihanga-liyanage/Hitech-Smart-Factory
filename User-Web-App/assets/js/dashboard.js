/**
 * @author Vihanga Liyanage <vihangaliyanage007@gmail.com>
 */

var editor;

var tempData = {
    "Branches": {
        "Branch": [
            {
                "bid": 8,
                "BranchNames": {
                    "BranchName": [
                        {
                            "Name": "Main Branch"
                        }
                    ]
                },
                "Sections": {
                    "Section": [
                        {
                            "SectionName": "Sawing Section",
                            "sid": 6,
                            "Productionlines": {
                                "Productionline": [
                                    {
                                        "Name": "Sawing Line 1",
                                        "pid": 8
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

var DSS_BASE_URL = GCP + ":9763/services/";

function loadData() {
    //Retrieve user info from session
    var userObj = JSON.parse(localStorage.getItem("userObj"));
    $('#username').text(userObj.name);

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
    // buildDataJSON(tempData);
}

function buildDataJSON(data) {
    var out = {};
    var userObj = JSON.parse(localStorage.getItem("userObj"));
    out.factoryID = userObj.fid;
    out.factory = userObj.factoryName;

    var branches;
    var newBranches;
    if (userObj.usertype === 'f') {
        branches = data.Factories.Factory["0"].Branches.Branch;
        newBranches = [];
        if (branches != null)
            branches.forEach(function (b) {
                var temp = {
                    id: b.bid,
                    name: b.BranchName,
                    sections: resolveSection(b.Sections.Section)
                };
                newBranches.push(temp);
            });

    } else if (userObj.usertype === 'b') {
        branches = data.Branches.Branch;
        newBranches = [];
        if (branches != null)
            branches.forEach(function (b) {
                var temp = {
                    id: b.bid,
                    name: b.BranchNames.BranchName["0"].Name,
                    sections: resolveSection(b.Sections.Section)
                };
                newBranches.push(temp);
            });

    } else if (userObj.usertype === 's') {
        var sections = data.Sections.Section;
        newBranches = [];
        if (sections != null)
            sections.forEach(function (s) {
                var sectionDetails = s.SectionDetails.SectionDetail["0"];
                var done = false;
                newBranches.forEach(function (b) {
                    // Search if the branch is added earlier, if yes, merge.
                    if (!done && (b.id == sectionDetails.bid)) {
                        var temp = {
                            id: sectionDetails.sid,
                            name: sectionDetails.sectionName,
                            prod_lines: resolveProdline(s.Productionlines.Productionline)
                        };
                        b.sections.push(temp);
                        done = true;
                    }
                });
                // If this is a section of a new branch,
                if (!done) {
                    var temp = {
                        id: sectionDetails.bid,
                        name: sectionDetails.branchName,
                        sections: [{
                            id: sectionDetails.sid,
                            name: sectionDetails.sectionName,
                            prod_lines: resolveProdline(s.Productionlines.Productionline)
                        }]
                    };
                    newBranches.push(temp);
                }
            });

    } else if (userObj.usertype === 'p') {
        var productionLines = data.Productionlines.Productionline;
        newBranches = [];
        if (productionLines != null)
            productionLines.forEach(function (p) {
                var p = p.ProdlineDetails.ProdlineDetail["0"];
                var branchDone = false;
                newBranches.forEach(function (b) {
                    // matching branch found
                    if (!branchDone && (b.id == p.bid)) {
                        var sectionDone = false;
                        b.sections.forEach(function (bs) {
                            // matching section found
                            if (!sectionDone && (bs.id == p.sid)) {
                                var temp = {
                                    id: p.pid,
                                    name: p.prodlineName,
                                };
                                bs.prod_lines.push(temp);
                                sectionDone = true;
                                branchDone = true;
                            }
                        });

                        //It's a new section
                        if (!sectionDone) {
                            var temp = {
                                id: p.sid,
                                name: p.sectionName,
                                prod_lines: [
                                    {
                                        id: p.pid,
                                        name: p.prodlineName,
                                    }
                                ]
                            };
                            b.sections.push(temp);
                            branchDone = true;
                        }
                    }
                });

                // If this is a prodline of a new section of a new branch,
                if (!branchDone) {
                    var temp = {
                        id: p.bid,
                        name: p.branchName,
                        sections: [
                            {
                                id: p.sid,
                                name: p.sectionName,
                                prod_lines: [
                                    {
                                        id: p.pid,
                                        name: p.prodlineName,
                                    }
                                ]
                            }
                        ]
                    };
                    newBranches.push(temp);
                }
            });
    }

    out.branches = newBranches;
    setupMenu(out);
}

function resolveSection(sections) {
    var out = [];
    if (sections != null)
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
    if (prodlines != null)
        prodlines.forEach(function (p) {
            var temp = {
                id: p.pid,
                name: p.Name
            };
            out.push(temp);
        });
    return out;
}

function setupMenu(data) {
    var menuHTML = "";

    var factoryID = data.factoryID;
    var factoryName = data.factory;

    // set company name in header
    $('#company-name').text("- " + factoryName);

    data.branches.forEach(function (branch) {
        var bid = branch.id;
        var branchName = branch.name;
        menuHTML += '<a href="javascript:void(0);" class="menu-toggle">\n' +
                        '<i class="material-icons">domain</i>\n' +
                        '<span>' + branchName + '</span>\n' +
                    '</a>';

        // setup sections of the branch
        menuHTML += '<ul class="ml-menu">';
        branch.sections.forEach(function (section) {
            var sid = section.id;
            var sectionName = section.name;
            menuHTML += '<li><a href="javascript:void(0);" class="menu-toggle">\n' +
                            '<img src="../images/hitech/icons/section.png"/></div>' +
                            '<span>' + sectionName + '</span>\n' +
                        '</a>';

            // setup prod lines of the section
            menuHTML += '<ul class="ml-menu">';
            section.prod_lines.forEach(function (prodLine) {
                var prodlineFullID = factoryID + '/' + bid + '/' + sid + '/' + prodLine.id + '.xml';
                var prodLinePath = factoryName + '/' + branchName + '/' + sectionName + '/' + prodLine.name;
                menuHTML += '<li><a onclick="prodLineSelected(this, \'' + prodLinePath + '\', \'' + prodlineFullID + '\');">\n' +
                                '<img src="../images/hitech/icons/prodline.png"/></div>' +
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

function loadProdLine(editor, idPath) {
    $('#graph-msg').text('Loading...');
    var url = PROD_LINE_BASE_URL + idPath;
    console.log(url);
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

function prodLineSelected(element, namePath, idPath) {
    $('#company-data .active').removeClass('active');
    $(element).parent().toggleClass('active');

    $('#prod-line-title').text(namePath);
    loadProdLine(editor, idPath);
}

function setEditorVar(e) {
    editor = e;
}

function signout() {
    localStorage.setItem("userObj", null);
    window.location.replace("/");
}

// Initiating menu items
$(document).ready(function () {
    window.onbeforeunload = null;
    var userObj = JSON.parse(localStorage.getItem("userObj"));
    if (!userObj) {
        alert("Watch where you're going buddy!");
        window.location.replace("/");
    }
    loadData();
});

