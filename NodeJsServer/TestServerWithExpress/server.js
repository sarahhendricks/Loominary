var express = require('express');
var path = require('path');
var app = express();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io')(server);
var lastSent = 0;
var htmlConnection;
var MESSAGE_DELAY_SEC = 10;

app.use(express.static(path.join(__dirname, 'public')));

// Listen for requests. The server will send the file on a GET request
// from the browser application. This listens on port 1337.
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});
server.listen(1337);

// Browser connection established.
io.on('connection', function (socket) {
    htmlConnection = socket;
    htmlConnection.on('response', function (color) {
        // TODO: If for any reason we want to handle info from the story,
        // this is the place to do it.
    });
});

// This handles the POST requests from the RFID hardware. It listens on its
// own port, 1338.
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
            // Get tag id
            var result = JSON.parse(body);
            var tagId = result[0].TagId;

            // If we have sent a message recently, wait a few seconds for the user to finish their
            // current weave.
            var date = new Date();
            var timeReceived = Math.round(date.getTime() / 1000);
            if (timeReceived - lastSent > MESSAGE_DELAY_SEC || lastSent == 0) {

                // If we are within a decent time span, then have the server send the tag ID over 
                // the HTML connection established in io.on
                lastSent = timeReceived;
                if (htmlConnection) {
                    htmlConnection.emit('choice', { tag: tagId });
                }
            }
        });
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('post received');
    }
}).listen(process.env.port || 1338);