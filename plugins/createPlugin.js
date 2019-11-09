/**
 * CLI para crear un plugin automáticamente
 * yarn run create-plugin help
 */
import fs from 'fs';
import { exerciseStyle } from "./__templates__/exerciseStyle";
import { exerciseTemplate } from "./__templates__/exercise";
import { exerciseVisorTemplate } from "./__templates__/exerciseVisor";
import { localesTemplate } from "./__templates__/locales";
import { pluginVisorTemplate } from "./__templates__/pluginVisor";
import { pluginTemplate } from "./__templates__/plugin";
import { pluginStyleTemplate } from "./__templates__/pluginStyle";

const LANGS = ["en", "es"];
const BASE = "plugins/";
const cats = ["text", "image", "media", "objects", "evaluation"];

let options = {
    name: "",
    displayName: "",
    category: "multimedia",
    visor: true,
    isRich: false,
};

// eslint-disable-next-line no-console
const p = text => console.log(text);

const help = () => {
    p(`  
 Uso: yarn run create-plugin \"Nombre del plugin\" <opciones>
 o bien : npm run create-plugin -- \"Nombre del plugin\"  <opciones> 
 
Opciones: 
 no-visor:              Plugin sin definir para el visor 
 rich:                  Plugin enriquecido 
 category <categoría>:  Categoría del plugin ["text", "image", "media", "objects", "evaluation"]                   
`);
};

const toCamelCase = str => {
    return str.toLowerCase()
        .replace(/[-_]+/g, ' ')
        .replace(/[^\w\s]/g, '')
        .replace(/ (.)/g, function($1) { return $1.toUpperCase(); })
        .replace(/ /g, '');
};

const parseArgs = (args) => {
    if (!args || args.length < 3) {
        p("Es obligatorio ponerle un nombre al plugin");
        p("Escribe 'npm run create-plugin help' para más información");
        return;
    }
    if (args[2] === "help") {
        help();
        return;
    }
    let bad = false;
    args.forEach(function(val, index) {
        if (index === 2) {
            p("Creando plugin: " + val);
            options.name = val.split(" ").join("");
            options.camelCaseName = toCamelCase(val);
            options.displayName = val;
        } else if (index > 2) {
            switch(val) {
            case "no-visor":
                options.visor = false;
                break;
            case "category":
                if(index < args.length) {
                    options.category = args[index + 1];
                }
                if (cats.indexOf(options.category) === -1) {
                    bad = true;
                    p("La categoría '" + options.category + "' no existe. Las categorías disponibles son: text, image, media, objects, evaluation"); }
                break;
            case "rich":
                options.isRich = true;
                break;
            default:
                if(index >= 1 && args[index - 1] !== 'category') {
                    p("Opción " + val + " no reconocida");
                    bad = true;
                }
                break;
            }
        }
    });
    if (bad) {
        return;
    }
    p("Opciones:");
    p(options);
    createPlugins();
};

const createPlugins = () => {
    let dir = BASE + options.name;
    if(!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
        fs.writeFileSync(dir + "/" + options.name + ".js", options.category === "evaluation" ? exerciseTemplate(options) : pluginTemplate(options));
        fs.mkdirSync(dir + "/locales");
        for (let l in LANGS) {
            fs.writeFileSync(dir + "/locales/" + LANGS[l] + ".js", localesTemplate(options));
        }
        if(options.visor) {
            fs.mkdirSync(dir + "/visor");
            fs.writeFileSync(dir + "/visor/" + options.name + ".js", options.category === "evaluation" ? exerciseVisorTemplate(options) : pluginVisorTemplate(options));
        }
        if (options.category === "evaluation") {
            fs.writeFileSync(dir + "/Styles.js", exerciseStyle(options));
        } else {
            fs.writeFileSync(dir + "/Styles.js", pluginStyleTemplate(options));
        }
        p("Plugin creado!");
        p("Accede a core/config.es6 y añade " + options.name + ' a pluginList');
    } else {
        p("Ya existe un directorio con el nombre " + options.name);
        p("Escoja otro nombre para el plugin o borre el directorio existente");
    }
};

parseArgs(process.argv);
