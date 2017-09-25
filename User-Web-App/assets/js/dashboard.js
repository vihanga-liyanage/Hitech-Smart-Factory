/**
 * @author Vihanga Liyanage <vihangaliyanage007@gmail.com>
 */

// should come from the DSS
var data = {
    usertype: "factory",
    factory: "Bata Shoe Company",
    branches: [
        {
            name: "Main Branch",
            sections: [
                {
                    name: "Sawing Section",
                    prod_lines: [
                        {
                            name: "Test"
                        },
                        {
                            name: "Test 2"
                        }
                    ]
                },
                {
                    name: "Molding Section",
                    prod_lines: [
                        {
                            name: "Prod 1"
                        },
                        {
                            name: "Prod 2"
                        }
                    ]
                }
            ]
        },
        {
            name: "Another Branch",
            sections: []
        }
    ]
};

var editor;

// var BASE_URL = "http://localhost:81/hitech-smart-factory/";
var BASE_URL = "http://ec2-52-38-15-248.us-west-2.compute.amazonaws.com/hitech-smart-factory/";

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
var isNumeric = function(n)
{
    return !isNaN(parseFloat(n)) && isFinite(n);
};

var loadProdLine = function (editor)
{
    $('#graph-msg').text('Loading...');
    var name = document.getElementById("prod-line-title").innerText + ".xml";
    name = name.split(" ").join("-");
    var url = BASE_URL + name;

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
                $('#graph-msg').text('No data file found');
            }
        }
    };
    xhr.open("GET", url);
    xhr.send();

};

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

$(document).ready(function () {
    var menuHTML = "";
    if (data.usertype === "factory") {
        // setting up factory menu item
        var factoryName = data.factory;
        menuHTML += '<a href="javascript:void(0);" class="menu-toggle">\n' +
            '            <i class="material-icons">list</i>\n' +
            '            <span>' + factoryName + '</span>\n' +
            '        </a>';
        // Setup branches
        menuHTML += '<ul class="ml-menu">';
        data.branches.forEach(function (branch) {
            var branchName = branch.name;
            menuHTML += '<li><a href="javascript:void(0);" class="menu-toggle">\n' +
                '            <span>' + branchName + '</span>\n' +
                '        </a>';

            // setup sections of the branch
            menuHTML += '<ul class="ml-menu">';
            branch.sections.forEach(function (section) {
                var sectionName = section.name;
                menuHTML += '<li><a href="javascript:void(0);" class="menu-toggle">\n' +
                    '            <span>' + sectionName + '</span>\n' +
                    '        </a>';

                // setup prod lines of the section
                menuHTML += '<ul class="ml-menu">';
                section.prod_lines.forEach(function (prodLine) {
                    var prodLinePath = factoryName + '/' + branchName + '/' + sectionName + '/' + prodLine.name;
                    menuHTML += '<li><a onclick="prodLineSelected(this, \'' + prodLinePath + '\');">\n' +
                        '            <span>' + prodLine.name + '</span>\n' +
                        '        </a>';
                });
                menuHTML += '</ul></li>';
            });
            menuHTML += '</ul></li>';
        });
        menuHTML += '</ul>';

    }
    $('#company-data').html(menuHTML);
});

