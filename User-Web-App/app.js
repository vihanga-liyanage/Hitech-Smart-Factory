var http = require('http');
var fs = require('fs');

var server = http.createServer(function (req, res) {
    console.log('request was made: ' + req.url);
    if (req.url === '/' ||req.url === '/home' || req.url === '/login') {
        res.writeHead(200, {'Content-Type': 'text/html'});
        fs.createReadStream(__dirname + '/index.html').pipe(res);
    } else {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('feed me popcorn');
    }
});

server.listen(3000, '127.0.0.1');
console.log("listening on port 3000");