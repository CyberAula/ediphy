const path = require('path');
const fs = require('fs');

let compPath = (path.join('.', 'doc/src/components'));
let files = [];

function getFiles(filePath) {
    fs.readdirSync(filePath).forEach(function(file) {
        if (file) {
            let subpath = filePath + '/' + file;
            if(fs.lstatSync(subpath).isDirectory()) {
                getFiles(subpath);
            } else if (path.extname(file) && path.extname(file) === '.jsx') {
                if(file !== 'Content.jsx') {
                    files.push({ name: path.basename(file, path.extname(file)), path: filePath });
                }
            }
        }
    });
}

function writeModuleFile(modPath) {
    let content = "";
    files.map(fileObj=>{
        // eslint-disable-next-line no-console
        console.log(fileObj);
        let newPath = fileObj.path.replace('doc\\src\\components', './components').replace('doc/src/components', './components').replace('.\\', '/') + '/';
        content += "export { default as " + fileObj.name + " } from '" + newPath + fileObj.name + "';\n";
    });

    fs.writeFileSync(modPath, content);
}

/* eslint-disable no-console */
console.log('\nIMPORT CUSTOM COMPONENTS\n');
console.log('Getting files from doc/src/components/...');
getFiles(compPath);
console.log('Exporting components in doc/src/components.es6');
writeModuleFile('./doc/src/components.es6');
console.log('\n\n\n');
/* eslint-enable no-console */
