/**
 * @author Vihanga Liyanage <vihangaliyanage007@gmail.com>
 */

/**
 * Variable: METADATA_LOCATION
 *
 * Shows the directory location to find all meta data files such as merge and links
 */
var METADATA_LOCATION = "resources/metadata/";

/**
 * Function: readFile
 *
 * Read a file and send data as text
 *
 * Parameters:
 *
 * file - file location
 */
var readFile = function (file)
{
    var allText = "Error";
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                allText = rawFile.responseText;
            }
        }
    };
    rawFile.send(null);
    return allText;
};

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

/**
 * Function: isConnected
 *
 * Return true if two services (cells) have a connection
 *
 * Parameters:
 *
 * cell1 - mxCell object
 * cell2 - mxCell object
 */
var isConnected = function (cell1, cell2)
{
    if (cell1.getEdgeCount() == 0)
        return false;
    for (var i = 0; i < cell1.getEdgeCount(); i++)
    {
        source = cell1.getEdgeAt(i).source;
        target = cell1.getEdgeAt(i).target;
        if (source == cell2 || target == cell2)
            return true;
    }
    return false;
};

/**
 * Function: clearLinks
 *
 * Clear all links in the graph
 *
 * Parameters:
 *
 * editor - mxEditor object to get the graph
 */
var clearLinks = function (editor)
{
    //select all edges
    editor.graph.selectCells(false, true);
    editor.graph.removeCells();
    editor.graph.container.focus();
};

/**
 * Function: loadDiagram
 *
 * Load a given diagram
 *
 * Parameters:
 *
 * editor - mxEditor object to get the graph
 * diagram - String name of the selected diagram to load
 */
var loadProdLine = function (editor)
{
    var name = document.getElementById("prod-line-title").innerText + ".xml";
    name = name.split(" ").join("-");
    var urlBase = "http://localhost:81/hitech-smart-factory/";
    // var urlBase = "http://ec2-52-38-15-248.us-west-2.compute.amazonaws.com/hitech-smart-factory/";
    var url = urlBase + name;

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                var doc = mxUtils.parseXml(this.responseText);
                var dec = new mxCodec(doc);
                dec.decode(doc.documentElement, editor.graph.getModel());
                editor.graph.container.focus();

                document.getElementById("save-prod-line-btn").innerText = "Update Production Line";
            }
            else {
                console.log("No data file found");
            }
        }
    };
    xhr.open("GET", url);
    xhr.send();

};

var showErrorMsg = function (msg)
{
    document.getElementById("errorMsg").innerHTML = msg;
    $( "div.failure" ).fadeIn( 300 ).delay( 1500 ).fadeOut( 400 );
};

var showSuccessMsg = function (msg)
{
    document.getElementById("successMsg").innerHTML = msg;
    $( "div.success" ).fadeIn( 300 ).delay( 2000 ).fadeOut( 400 );
};

// save production line configuration as a file
function saveProdLine(xml)
{
    var name = document.getElementById("prod-line-title").innerText + ".xml";
    $.post('FileController', {action: "saveFile", name: name, xml: xml},
        function (data) {
            if (data == "Success") {
                showSuccessMsg("Production Line saved successfully!")
            } else {
                showErrorMsg("Oops! Something went wrong.")
            }
        });
}

function configureSensorDetails(sender, evt, product) {
    document.getElementById("action-form-background").style.display = "block";
    document.getElementById("sensor-config-form-container").style.display = "block";
    document.getElementById("sensor-id").innerHTML = sender.cell.id;
    document.getElementById("sensor-name").innerHTML = sender.cell.style;
    console.log(sender);
    console.log(evt);
    console.log(product);
}

function closeConfigSensorForm() {
    document.getElementById("action-form-background").style.display = "none";
    document.getElementById("sensor-config-form-container").style.display = "none";
}

// Adding custom toolbox items
var addingProdLineItem = true;

function toolboxItemCategorySelected() {
    var select = document.getElementById("toolbox-item-category");
    if (select.selectedIndex == 0) {
        addingProdLineItem = true;
    } else {
        addingProdLineItem = false;
    }
    previewToolboxItemIcon(false);
}

function addToolboxItem(){
    document.getElementById("action-form-background").style.display = "block";
    document.getElementById("add-toolbox-item-form-container").style.display = "block";
}

function closeAddToolboxItem(){
    document.getElementById('action-form-background').style.display = "none";
    document.getElementById('add-toolbox-item-form-container').style.display = "none";
    document.getElementById('toolbox-item-icon-preview').innerHTML = "";
    document.getElementById('sensor-icon-preview').innerHTML = "";
    document.getElementById('toolbox-item-icon').value = "";
    document.getElementById('item-model-name').value = "";
}

function previewToolboxItemIcon(isKey) {
    var toolboxPreview = document.getElementById('toolbox-item-icon-preview'); //selects the preview img
    var sensorPreview = document.getElementById('sensor-icon-preview');
    var input = document.getElementById('toolbox-item-icon');
    var reader  = new FileReader();

    reader.onloadend = function () {
        var model = document.getElementById("item-model-name").value;
        toolboxPreview.innerHTML = "";
        toolboxPreview.appendChild(getToolboxIcon(reader.result, model));
        var p = document.createElement('p');
        p.innerText = "Toolbox Icon Preview";
        toolboxPreview.appendChild(p);

        if (!isKey && !addingProdLineItem) {
            // set sensor icon preview
            sensorPreview.innerHTML = "";
            sensorPreview.appendChild(getSensorIcon(reader.result));
            p = document.createElement('p');
            p.innerText = "Sensor Icon Preview";
            sensorPreview.appendChild(p);
        }
        if (addingProdLineItem)
            sensorPreview.innerHTML = "";
    };

    if (input.files && input.files[0]) {
        if (input.files[0].type.match(/image/g)) {
            reader.readAsDataURL(input.files[0]); //reads the data as a URL
        } else {
            alert("Please select a valid image");
            input.value = "";
            toolboxPreview.innerHTML = "";
            sensorPreview.innerHTML = "";
        }
    } else {
        toolboxPreview.innerHTML = "";
        sensorPreview.innerHTML = "";
    }
}

function getToolboxIcon(imageSrc, name) {
    var c = document.createElement('canvas');
    c.width = 80;
    c.height = 80;
    var context = c.getContext("2d");

    // set context properties
    context.font = "9pt Verdana";
    context.fillStyle = "white";
    context.lineWidth = 2;
    context.strokeStyle="#000000";

    var imageObj2 = new Image();
    imageObj2.onload = function (){
        // Draw base image
        context.drawImage(imageObj2, 10, 0, 60, 60);
        var imageObj1 = new Image();
        imageObj1.onload = function (){
            imageObj1.style.objectFit = "cover";
            // Draw footer
            context.drawImage(imageObj1, 0, 60, 80, 20);
            // Add text to footer
            context.fillText(name, 5, 73);
            // Add border to canvas
            context.strokeRect(0, 0, c.width, c.height);
        };
        imageObj1.src = "images/hitech/toolbar-icon-footer.jpg";
    };
    imageObj2.src = imageSrc;
    return c;
}

function getSensorIcon(imageSrc) {
    var c = document.createElement('canvas');
    c.width = 80;
    c.height = 80;
    var context = c.getContext("2d");

    var imageObj2 = new Image();
    imageObj2.onload = function (){
        // Draw base image
        context.drawImage(imageObj2, 5, 5, 70, 70);

        var imageObj1 = new Image();
        imageObj1.onload = function (){
            imageObj1.style.objectFit = "cover";
            // Draw footer
            context.drawImage(imageObj1, 0, 0, 80, 80);
            // Crop circle
            context.globalCompositeOperation='destination-in';
            context.beginPath();
            context.arc(40, 40, 37, 0, 2 * Math.PI);
            context.fill();
        };
        imageObj1.src = "images/hitech/sensor-icon-blue-ring.png";
    };
    imageObj2.src = imageSrc;
    return c;
}

function saveNewToolboxItem() {
    // validation
    var isValidModel, isValidInput;
    var model = document.getElementById('item-model-name');
    if (model.value == "") {
        model.focus();
        model.style.border = "1px solid #ff5959";
        model.style.boxShadow = "0 0 3px #ff0000";
        isValidModel = false;
    } else {
        model.style.border = "1px solid #4a4a4a";
        model.style.boxShadow = "none";
        isValidModel = true;
    }
    var input = document.getElementById('toolbox-item-icon');
    if (input.files[0] == null) {
        input.style.border = "1px solid #ff5959";
        input.style.boxShadow = "0 0 3px #ff0000";
        isValidInput = false;
    } else {
        input.style.border = "none";
        input.style.boxShadow = "none";
        isValidInput = true;
    }

    if (isValidModel && isValidInput) {
        
    }
}