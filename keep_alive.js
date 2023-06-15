const { exec } = require('child_process');
var http = require('http');
var fs = require('fs');

http.createServer(function(req, res) {
    var filePath = null;
    console.log(req.method + " incoming.")
    if (req.url === '/') {
        filePath = './html/welcome.html';
    } else if(req.url == "/course") {
        let body = '';

        req.on('data', (chunk) => {
          // Accumulate the data chunks
          body += chunk;
        });
    
        req.on('end', async () => {
          // Process the complete request body
          console.log("course convertion request. \n" + body);
            
          var part1 = await global.chatGpt.sendMessage(body + `\nGet me json format of this data for the following keys

          'code' : string
          'title' : string
          'title' : string 
          'LTPC' : list of numbers
          'syllabus_topic' : List of String 
          'syllabus_credits' : List of numbers 
          'syllabus_subtopic' : List of String`);
          part1 = part1.text
          var part2 = await global.chatGpt.sendMessage(body + `\nnGet me json format of this data for the following keys

          'textbook' : List of String
          'reference' : List of string 
          'objectives' : List of String
            'outcomes' : List of String`);
            part2 = part2.text
          try {
            console.log("part1 : " + part1)
            console.log("part2 : "+ part2)
            //const combinedObj = Object.assign({}, pat2, part1);
            combinedObj = part1+`
            ENDPART
            `+ part2
            res.write(JSON.stringify(combinedObj))
          } catch(e) {
            console.log("Failed : " + e)
            res.write("fail");
          }

          res.end();
        });
    } else {
        if (req.url == '/gitpush') {
            // Execute the 'git pull' command
            exec('git pull', (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error: ${error.message}`);
                }
                if (stderr) {
                    console.error(`stderr: ${stderr}`);
                }
                console.log(`stdout: ${stdout}`);
            });
        }
        console.log(req.url)
        filePath = './html/notfound.html';
    }
    
    if(filePath != null){
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
    }
}).listen(8080);