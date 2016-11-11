var express = require('express');
var bodyParser = require("body-parser");
var fs = require("fs");
var cors = require("cors");

var app = express();
app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({ extended: true }));

var whitelist = [
    'http://localhost:8080'
];
var corsOptions = {
    origin: function(origin, callback){
        var originIsWhitelisted = whitelist.indexOf(origin) !== -1;
        callback(null, originIsWhitelisted);
    },
    credentials: true
};
app.use(cors(corsOptions));

app.get('/getConfig', function (req, res) {
   fs.readFile( __dirname + "/" + "config.json", 'utf8', function (err, data) {
	   if(err)
			res.end(err);
		else
			res.end(data);
   });
})

app.post('/saveConfig', function (req, res) {
   var data = req.body;
   console.log(data);
   fs.writeFile( __dirname + "/" + "config.json", JSON.stringify(data), 'utf8', function (err) {
		if(err)
			res.end("Write error");
		else
			res.end("Success");
   });
})

app.post('/upload', function (req, res) {
    var data = req.body;
    console.log(data);

    setTimeout(function(){
        res.end("Success");
    }, 3000);
})

var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

})