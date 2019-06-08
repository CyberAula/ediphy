import i18n from '../locales/i18n';
import path from 'path';
import fs from 'fs';
const reactDocgen = require('react-docgen');
const ReactDocGenMarkdownRenderer = require('react-docgen-markdown-renderer');
export const languages = ['en', 'es'];
const EDITOR_PATH = (path.join('.', '_editor/components'));
const VISOR_PATH = (path.join('.', '_visor/components'));
const FILES_PATH = 'doc/files/';
const IMPORT_PATH = './doc/importMdFiles.es6';
let files = [];

function genDoc(componentPath, renderer, lang) {
    let content = fs.readFileSync(componentPath);
    if (content) {
        const documentationPath = path.join(FILES_PATH + lang, path.basename(componentPath, path.extname(componentPath)) + renderer.extension);
        console.log(componentPath, content);
        const doc = reactDocgen.parse(content);
        const componentName = (path.join(path.basename(componentPath, '.jsx')));

        if (doc.props) {
            if (lang !== 'en') {

                Object.keys(doc.props).map(prop => {
                    let trans = doc.props[prop].description || "";

                    if (trans === "") {
                        // eslint-disable-next-line no-console
                        console.log('\x1b[36m%s\x1b[0m', "\tdoc-warning", "You forgot to provide a description for prop " + prop + " at component ", componentName);
                    }
                    trans = i18n.t("components." + componentName + "." + prop, { lng: lang });
                    if (trans === "components." + componentName + "." + prop) {
                        // eslint-disable-next-line no-console
                        console.log('\x1b[36m%s\x1b[0m', "\tdoc-warning", "You forgot to translate the prop " + prop + "  in " + lang + " for component ", componentName);
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
    }
}

function getFiles(filePath, renderer, lang) {
    fs.readdirSync(filePath).forEach(function(file) {
        if (file) {
            let subpath = filePath + '/' + file;
            if(fs.lstatSync(subpath).isDirectory() && subpath.indexOf('__tests__') === -1) {
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

function createDirIfNotExists(dir) {
    if(!fs.existsSync(dir)) {
        fs.mkdirSync((dir));
    }
}

function main() {
    // eslint-disable-next-line no-console
    console.log();
    fs.writeFileSync(IMPORT_PATH, "");
    createDirIfNotExists(FILES_PATH);
    for (let l in languages) {
        files = [];
        let lang = languages[l];
        let renderer = new ReactDocGenMarkdownRenderer({
            componentsBasePath: '.',
            template: require('../locales/' + lang + '/template').template,
        });
        createDirIfNotExists(FILES_PATH + lang);
        getFiles(EDITOR_PATH, renderer, lang);
        getFiles(VISOR_PATH, renderer, lang);
        writeModuleFile(IMPORT_PATH, lang);

    }
}

main();
