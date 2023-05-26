const { exec } = require('child_process');
var http = require('http');
var fs = require('fs');

http.createServer(function(req, res) {
    var filePath;
    if (req.url === '/') {
        filePath = './html/welcome.html';
    } else {
        if (req.url == '/gitpush') {
            // Execute the 'git push' command
            exec('git push', (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error: ${error.message}`);
                    return;
                }
                if (stderr) {
                    console.error(`stderr: ${stderr}`);
                    return;
                }
                console.log(`stdout: ${stdout}`);
            });
        }
        console.log(req.url)
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