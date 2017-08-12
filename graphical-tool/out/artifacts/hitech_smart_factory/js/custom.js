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
    console.log(url);

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