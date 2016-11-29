// Cannot see this from laptop! Make sure to set Loominosity.html to "require in project"
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
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.write(html);
                    res.end();
                }).listen(port);
                http.createServer(function (req, res) {

                    //console.log(req.url);
                    //// Parsing JSON requests
                    //// parses the request url
                    //var theUrl = url.parse(req.url);

                    //console.log(theUrl);

                    //// gets the query part of the URL and parses it creating an object
                    //var queryObj = queryString.parse(theUrl.query);
                    //console.log(queryObj);

                    //// queryObj will contain the data of the query as an object
                    //// and jsonData will be a property of it
                    //// so, using JSON.parse will parse the jsonData to create an object
                    //var obj = JSON.parse(queryObj.jsonData);

                    //// as the object is created, the live below will print "bar"
                    //console.log(obj);


                    // Reading values from HTML form GET request
                    console.dir(req.param);

                    if (req.method == 'POST') {
                        console.log("POST");
                        var body = '';
                        req.on('data', function (data) {
                            body += data;
                            console.log("Partial body: " + body);
                        });
                        req.on('end', function () {
                            console.log("Body: " + body);
                        });
                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        res.end('post received');
                    }
                    else {
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

//<html>
//    <body>
//        <form method="post" action="http://localhost:3000">
//            Name: <input type="text" name="name" />
//            <input type="submit" value="Submit" />
//        </form>

//        <script type="text/JavaScript">
//            console.log('begin');
//            var http = new XMLHttpRequest();
//            var params = "text=stuff";
//            http.open("POST", "http://localhost:3000", true);

//            http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
//            //http.setRequestHeader("Content-length", params.length);
//            //http.setRequestHeader("Connection", "close");

//            http.onreadystatechange = function() {
//                console.log('onreadystatechange');
//            if (http.readyState == 4 && http.status == 200) {
//                alert(http.responseText);
//            }
//            else {
//                console.log('readyState=' + http.readyState + ', status: ' + http.status);
//            }
//            }

//            console.log('sending...')
//            http.send(params);
//            console.log('end');

//        </script>

//    </body>
//</html>