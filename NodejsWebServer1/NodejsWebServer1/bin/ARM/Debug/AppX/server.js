// Cannot see this from laptop! It is a background app and runs on the pi.
var http = require('http'),
    fs = require('fs');
var port = process.env.port || 1337;
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