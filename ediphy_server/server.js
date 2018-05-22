let express = require('express');
let bodyParser = require("body-parser");
let fs = require("fs");
let cors = require("cors");
let path = require('path');
var multer  = require('multer');
var crypto = require("crypto");
var PATH = 'public/';

var storage = multer.diskStorage({
  destination: function (req, data, func) {
    func(null, PATH)
  },
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      if (err) return cb(err)

      cb(null, raw.toString('hex') + path.extname(file.originalname))
    })
  }
});

var upload = multer({ storage: storage })

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
app.use(express.static('public'));
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


app.post('/delete', function (req, res, next) {
  let fileId = req.body.id;
  try{fs.unlink( PATH+fileId,
    function (err) {
      if (err) {
        res.status(404).end();
        return console.log(err);

      }
      res.status(200).end()
    })
  } catch(e){
    res.status(404).end()
  }
})


app.post('/upload',  upload.single('file'), function (req, res, next) {

  let name = req.file.originalname || req.file.filename;
  let url = req.protocol + "://" + (req.headers.host) + "/" + req.file.filename;
  let mimetype = req.file.mimetype && req.file.mimetype !== '' ? req.file.mimetype : path.extname(req.file.originalname);
  if (req.file && req.file.filename) {
    res.send(JSON.stringify({ name, url, mimetype }));
  }
  res.status(500)
})


var server = app.listen(8081, function() {

    let host = server.address().address;
    let port = server.address().port;

    console.log("Example app listening at http://%s:%s", host, port);

});
