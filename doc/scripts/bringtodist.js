const path = require('path');
const fs = require('fs');
const ncp = require("ncp").ncp;

const origPath = path.join('.', 'dist/lib');
const dstPath = path.join('.', 'doc/dist/demo/lib');

const indexPath = path.join('.', 'dist/index.html');
const indexDocPath = path.join('.', 'doc/dist/demo/editor.html');
ncp.limit = 0;

const mkdirSync = function(dirPath) {
    try {
        fs.mkdirSync(dirPath);
    } catch (err) {
        if (err.code !== 'EEXIST') {throw err;}
    }
};

mkdirSync(dstPath);

const errorCallback = (err) => {
    if (err) {
        // eslint-disable-next-line no-console
        return console.error(err);
    }

    // eslint-disable-next-line no-console
    console.log("Done !");
    return "";
};

ncp(origPath, dstPath, errorCallback);

let index = fs.readFileSync(indexPath, "utf8");
index = index.replace(/app-bundle\.js/, "app-bundle.min.js");

fs.writeFileSync(indexDocPath, index);
