// Cannot see this from laptop! Make sure to set Loominosity.html to "require in project"
var http = require('http'),
    fs = require('fs'),
    qs = require('querystring');
//var io = require('socket.io')(http.createServer(handler));

var fileName = "Loominosity.html";
var redThread = "";
function handler(req, res) {
    console.log("Inside handler function,");
}
fs.exists(fileName, function (exists) {
    if (exists) {
        fs.stat(fileName, function (error, stats) {
            fs.readFile('Loominosity.html', function (err, html) {
                if (err)
                    console.log(err);
                // This handles the initial GET request from the browser application. It will display the
                // story as a webpage.
                var io = require("socket.io")(http.createServer(function (req, res) {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.write(html);
                    res.end();
                }).listen(process.env.port || 1337));
                io.on('connection', function (socket) {
                    console.log("inside io.on");
                });
                // This handles the POST requests from the RFID hardware. 
                http.createServer(function (req, res) {
                    // Reading values from HTML form GET request

                    if (req.method == 'POST') {
                        //console.log("POST");
                        var body = '';
                        req.on('data', function (data) {
                            body += data;
                            if (body.length > 1e6) {
                                req.connection.destroy();
                            }
                        });
                        req.on('end', function () {
                            // This is logging the JSON!
                            //console.log("Body: " + body);

                            // get tag id
                            var result = JSON.parse(body);
                            var tagId = result[0].TagId;
                            //console.log(result[0].TagId);

                            // associate with color
                            if (tagId == "E2-00-40-84-39-04-02-41-14-10-86-46") {
                                console.log("Red! Click the link with class red!");

                            }


                        });
                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        res.end('post received');
                    }
                    else {
                        // Shouldn't be getting anything here, but just in case...
                        console.log("GET");
                    }
                }).listen(process.env.port || 1338);
            });
        });
    }
    else {
        console.log("Does not exist");
    }
});