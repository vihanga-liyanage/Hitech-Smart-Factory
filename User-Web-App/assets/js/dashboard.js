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

function prodLineSelected(element, path) {
    $('#company-data .active').removeClass('active');
    $(element).parent().toggleClass('active');

    path = path.split(' ').join('-') + '.xml';
    $('#canvas').text('Loading production line... ' + path);
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

