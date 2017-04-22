var express = require('express');
var path = require('path');
var app = express();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io')(server);
var lastSent = 0;
var htmlConnection;


app.use(express.static(path.join(__dirname, 'public')));

// Listen for requests
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
    console.log('Magic happens on port ');
});
server.listen(1337);

console.log("about to try io.on");
io.on('connection', function (socket) {
    // Get here when the IoT browser connects!!
    // Story only shows up when you get here, not before.
    console.log("inside io.on; client connected....");
    htmlConnection = socket;
    htmlConnection.on('response', function (color) {
        console.log("color");
        console.log(color.color);
    });
});

// This handles the POST requests from the RFID hardware. 
http.createServer(function (req, res) {
    if (req.method === 'POST') {
        var body = '';
        // When we get data, add it to the body.
        req.on('data', function (data) {
            body += data;
            if (body.length > 1e6) {
                req.connection.destroy();
            }
        });
        // When we reach the end of the request, parse the body JSON
        req.on('end', function () {
            // get tag id
            var result = JSON.parse(body);
            var tagId = result[0].TagId;

            // If we have sent a message recently, wait a few seconds for the user to finish their
            // current weave.
            var date = new Date();
            var timeReceived = Math.round(date.getTime() / 1000);
            if (timeReceived - lastSent > 10 || lastSent == 0) {
                console.log("Send the message!");
                lastSent = timeReceived;
                console.log(tagId);
                if (htmlConnection) {
                    htmlConnection.emit('choice', { tag: tagId });
                }
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