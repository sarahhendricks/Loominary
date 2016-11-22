// Cannot see this from laptop!
var http = require('http'),
    fs = require('fs');
var port = process.env.port || 1337;
var url = require("url");
var queryString = require("querystring");
//fs.readFile('./bin/Loominosity.html', function (err, html) {
//    if (err)
//        console.log(err);
//    http.createServer(function (req, res) {
//        res.writeHead(200, { 'Content-Type': 'text/html' });
//        res.write(html);
//        res.end();
//    }).listen(port);
//});

//var fileName = "Loominosity.html";
//fs.exists(fileName, function (exists) {
//    if (exists) {
//        fs.stat(fileName, function (error, stats) {
//            fs.open(fileName, "r", function (error, fd) {
//                var buffer = new Buffer(stats.size);

//                fs.read(fd, buffer, 0, buffer.length, null, function (error, bytesRead, buffer) {
//                    var data = buffer.toString("utf8", 0, buffer.length);

//                    console.log(data);
//                    fs.close(fd);
//                });
//            });
//        });
//    }
//    else {
//        console.log("Does not exist");
//    }
//});


var fileName = "Loominosity.html";
fs.exists(fileName, function (exists) {
    if (exists) {
        fs.stat(fileName, function (error, stats) {
            fs.readFile('Loominosity.html', function (err, html) {
                if (err)
                    console.log(err);
                http.createServer(function (req, res) {

                    // Parsing JSON requests
                    //// parses the request url
                    //var theUrl = url.parse(req.url);

                    //// gets the query part of the URL and parses it creating an object
                    //var queryObj = queryString.parse(theUrl.query);

                    //// queryObj will contain the data of the query as an object
                    //// and jsonData will be a property of it
                    //// so, using JSON.parse will parse the jsonData to create an object
                    //var obj = JSON.parse(queryObj.jsonData);

                    //// as the object is created, the live below will print "bar"
                    //console.log(obj.foo);

                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.write(html);
                    res.end();
                }).listen(port);
            }); 
        });
    }
    else {
        console.log("Does not exist");
    }
});
