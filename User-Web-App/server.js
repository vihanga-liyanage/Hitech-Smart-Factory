var express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    fs = require('fs'),
    app = express(),
    port = 3000;

// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {
    flags: 'a'
});

// setup the logger
app.use(morgan('common', {
    stream: accessLogStream
}));

// logger stdout
app.use(morgan('dev'));

//Body-parser
app.use(bodyParser.json()); //for parsing application/json
app.use(bodyParser.urlencoded({
    extended: true
}));

// routes ======================================================================
app.use(express.static(path.join(__dirname, '/views')));
app.use('/assets', express.static(path.join(__dirname, '/assets')));

// error handlers
// Catch unauthorised errors
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401);
        res.json({
            success: false,
            msg:err.message,
            error: err
        });
        console.log("Log - UnauthorizedError");
    } else {
        console.log("Log - Unhandlied");
        console.log("message" + err.name + ": " + err.message);
        res.json({
            success: false,
            msg:err.message,
            error: err
        });
    }
});

app.listen(port, function () {
    console.log('Server started on port : ' + port);
});
