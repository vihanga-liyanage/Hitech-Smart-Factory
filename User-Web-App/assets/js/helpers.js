
// change GCP variable to switch between GCP instances
var GCP_1 = "http://35.196.174.178";
var GCP_2 = "http://35.196.106.255";
var GCP = GCP_1;

// var PROD_LINE_BASE_URL = "http://localhost:81/hitech-smart-factory/";
// var PROD_LINE_BASE_URL = "http://ec2-52-38-15-248.us-west-2.compute.amazonaws.com/hitech-smart-factory/";
var PROD_LINE_BASE_URL = GCP + "/hitech-smart-factory/";

function hexToRgb(hexCode) {
    var patt = /^#([\da-fA-F]{2})([\da-fA-F]{2})([\da-fA-F]{2})$/;
    var matches = patt.exec(hexCode);
    var rgb = "rgb(" + parseInt(matches[1], 16) + "," + parseInt(matches[2], 16) + "," + parseInt(matches[3], 16) + ")";
    return rgb;
}

function hexToRgba(hexCode, opacity) {
    var patt = /^#([\da-fA-F]{2})([\da-fA-F]{2})([\da-fA-F]{2})$/;
    var matches = patt.exec(hexCode);
    var rgb = "rgba(" + parseInt(matches[1], 16) + "," + parseInt(matches[2], 16) + "," + parseInt(matches[3], 16) + "," + opacity + ")";
    return rgb;
}