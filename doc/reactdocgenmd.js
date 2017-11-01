import i18n from './locales/i18n';
import path from 'path';
import fs from 'fs';
const reactDocgen = require('react-docgen');
const ReactDocGenMarkdownRenderer = require('react-docgen-markdown-renderer');
const languages = ['en', 'es'];
const EDITOR_PATH = (path.join('.', '_editor/components'));
const VISOR_PATH = (path.join('.', '_visor/components'));
const FILES_PATH = 'doc/files/';
let files = [];
function genDoc(componentPath, renderer, lang) {
    fs.readFile(componentPath, (error, content) => {
        const documentationPath = path.join(FILES_PATH + lang, path.basename(componentPath, path.extname(componentPath)) + renderer.extension);
        const doc = reactDocgen.parse(content);
        const componentName = (path.join(path.basename(componentPath, '.jsx')));

        if (doc.props) {
            if (lang !== 'en') {

                Object.keys(doc.props).map(prop => {
                    let trans = doc.props[prop].description;
                    trans = i18n.t("components." + componentName + "." + prop, { lng: lang });
                    if (trans === "components." + componentName + "." + prop) {
                        trans = doc.props[prop].description;
                    }
                    doc.props[prop] = { ...doc.props[prop], description: trans };

                    return prop;
                });
            }
        }

        fs.writeFileSync(documentationPath, renderer.render(
            /* The path to the component, used for linking to the file. */
            componentPath,
            /* The actual react-docgen AST */
            doc,
            /* Array of component ASTs that this component composes*/
            []));
    });
}

function getFiles(filePath, renderer, lang) {
    fs.readdirSync(filePath).forEach(function(file) {
        if (file) {
            let subpath = filePath + '/' + file;
            if(fs.lstatSync(subpath).isDirectory()) {
                getFiles(subpath, renderer, lang);
            } else if (path.extname(file) && path.extname(file) === '.jsx') {
                files.push(path.basename(file, path.extname(file)));
                genDoc(filePath + '/' + file, renderer, lang);
            }
        }
    });

}

function writeModuleFile(modPath, lang) {
    let content = "";
    files.map(file=>{
        content += "export * as " + file + "_" + lang + " from './files/" + lang + "/" + file + ".md';\n";// export " + file + ';\n';
    });

    fs.appendFileSync(modPath, content);
}
function main() {
    fs.writeFileSync('./doc/importMdFiles.es6', "");
    for (let l in languages) {
        files = [];
        let lang = languages[l];
        let renderer = new ReactDocGenMarkdownRenderer({
            componentsBasePath: '.',
            template: require('./locales/' + lang + '/template').template,
        });
        if(!fs.existsSync(FILES_PATH + lang)) {
            fs.mkdirSync((FILES_PATH + lang));
        }

        getFiles(EDITOR_PATH, renderer, lang);
        getFiles(VISOR_PATH, renderer, lang);
        writeModuleFile('./doc/importMdFiles.es6', lang);

    }
}

main();
