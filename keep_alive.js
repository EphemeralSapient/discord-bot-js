var http = require('http');
var fs = require('fs');

http.createServer(function(req, res) {
    var filePath;
    if (req.url === '/') {
        filePath = './html/welcome.html';
    } else {
        filePath = './html/notfound.html';
    }
    fs.readFile(filePath, function(err, data) {
        if (err) {
            res.writeHead(404);
            res.write('File not found');
        } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(data);
        }
        res.end();
    });
}).listen(8080);