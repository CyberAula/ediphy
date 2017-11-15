const path = require('path');
const fs = require('fs');
const ncp = require("ncp").ncp;

const origPath = path.join('.', 'dist/lib');
const dstPath = path.join('.', 'doc/dist/demo/lib');
ncp.limit = 0;

const mkdirSync = function(dirPath) {
    try {
        fs.mkdirSync(dirPath);
    } catch (err) {
        if (err.code !== 'EEXIST') {throw err;}
    }
};

mkdirSync(dstPath);
ncp(origPath, dstPath, function(err) {
    if (err) {
        return console.error(err);
    }
    console.log("Done !");
    return "";
});
