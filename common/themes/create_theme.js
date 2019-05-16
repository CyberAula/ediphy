/**
 * CLI para crear un plugin automáticamente
 * yarn run create-plugin help
 */

import path from 'path';
import fs from 'fs';
const LANGS = ["en", "es"];
const BASE = "common/themes/scss-files/";
const DIST = "dist/themes/";
let options = {
    name: "",
    displayName: "",
    category: "multimedia",
    visor: true,
    isRich: false,
};

const cats = ["text", "image", "media", "objects", "evaluation"];
function p(text) {
    // eslint-disable-next-line no-console
    console.log(text);
}

function help() {
    p(`  
 Uso: yarn run create-plugin \"Nombre del plugin\" <opciones>
 o bien : npm run create-plugin -- \"Nombre del plugin\"  <opciones> 
               
`);
}
function toCamelCase(str) {
    return str.toLowerCase()
        .replace(/[-_]+/g, ' ')
        .replace(/[^\w\s]/g, '')
        .replace(/ (.)/g, function($1) { return $1.toUpperCase(); })
        .replace(/ /g, '');
}

function parseArgs(args) {
    if (!args || args.length < 3) {
        p("Es obligatorio ponerle un nombre al tema");
        p("Escribe 'npm run create-theme help' para más información");
        return;
    }
    if (args[2] === "help") {
        help();
        return;
    }
    let bad = false;
    args.forEach(function(val, index, array) {
        if (index === 2) {
            p("Creando tema: " + val);
            options.name = val.toLowerCase().split(" ").join(_);
            options.camelCaseName = toCamelCase(val);
            options.displayName = val;
        } else if (index > 2) {
        }
    });
    if (bad) {
        return;
    }
    p("Opciones:");
    p(options);
    // createPlugins();

}

function createTheme() {
    let dir = BASE + options.name;
    let dist = DIST + options.name;
    if(!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
        fs.writeFileSync(dir + "/" + options.name + ".scss", template());
        fs.mkdirSync(dist);
        fs.mkdirSync(dist + "background_images");

        p("Tema creado!");
        p("Accede a core/config.es6 y añade " + options.name + ' a pluginList');
    } else {
        p("Ya existe un directorio con el nombre " + options.name);
        p("Escoja otro nombre para el tema o borre el directorio existente");
        return;
    }

}

function template() {
    return `.default {
  font-family: var(--themePrimaryFont, 'Ubuntu');

  .title {
    display: block;
    background-color: transparent;

    .cab {
      font-size: 2em;
      padding: 1em;
      .cabtabla_numero{
        padding: 0.2em 0.3em;
        line-height: 1em;
        color: var(--themeColor1);
        font-family: var(--themePrimaryFont, 'Ubuntu');
      }
      .editCourseTitle{
        font-size: 1em;
        height: auto;
        border-radius: 0;
        border-color: var(--themeColor1);
      }
      .editNavTitle{
        font-size: 0.8em;
        height: auto;
        border-radius: 0;
        border-color: var(--themeColor1);
      }.editNavSubTitle{
         font-size: 0.6em;
         height: auto;
         border-radius: 0;
         color: var(--themeColor1);
       }

      h1{
        margin: 0.1em 0 0;
        font-size: 1em;
      }
      h2{
        margin: 0.4em 0 0;
        font-size: 0.8em;
        color: var(--themeColor1);
      }
      h3{
        margin: 0.4em 0 0;
        font-size: 0.7em;
      }
      h4{
        margin: 0.4em 0 0;
        font-size: 0.6em;
      }
      .breadcrumb a{
        margin: 0.4em 0 0;
      }
      .infoIcon {
        cursor: help;
        font-size: 0.9em;
        color: #555;
        vertical-align: top;
        position: absolute;
        top: 0.7em;
        right: 0.7em;
      }
    }
  }
}
`;
}
parseArgs(process.argv);
