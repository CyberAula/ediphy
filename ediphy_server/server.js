let express = require('express');
let bodyParser = require("body-parser");
let fs = require("fs");
let cors = require("cors");

let app = express();
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

let whitelist = [
    'http://localhost:8080',
];
let corsOptions = {
    origin: function(origin, callback) {
        let originIsWhitelisted = whitelist.indexOf(origin) !== -1;
        callback(null, originIsWhitelisted);
    },
    credentials: true,
};
app.use(cors(corsOptions));

app.get('/getConfig', function(req, res) {
    fs.readFile(__dirname + "/" + "config.json", 'utf8', function(err, data) {
	   if(err)
        {res.end(err);}
        else
        {res.end(data);}
    });
});

app.post('/saveConfig', function(req, res) {
    let data = req.body;
    // Print data
    fs.writeFile(__dirname + "/" + "config.json", JSON.stringify(data), 'utf8', function(err) {
        if(err)
        {res.end("Write error");}
        else
        {res.end("Success");}
    });
});

app.post('/upload', function(req, res) {
    let data = req.body;

    setTimeout(function() {
        res.end("https://upload.wikimedia.org/wikipedia/commons/6/66/Polar_Bear_-_Alaska_(cropped).jpg");
    }, 3000);
});

var server = app.listen(8081, function() {

    let host = server.address().address;
    let port = server.address().port;

    console.log("Example app listening at http://%s:%s", host, port);

});
