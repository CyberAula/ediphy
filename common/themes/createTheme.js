/**
 * CLI para crear un tema automáticamente
 * yarn run create-theme help
 */

import fs from 'fs';
const BASE = "common/themes/";
const DIST = "dist/themes/";
let options = {
    name: "",
    displayName: "",
    category: "multimedia",
    visor: true,
    isRich: false,
};

function p(text) {
    // eslint-disable-next-line no-console
    console.log(text);
}

function help() {
    p(`  
 Uso: yarn run create-theme \"Nombre del tema\" <opciones>
 o bien : npm run create-theme -- \"Nombre del tema\"  <opciones> 
               
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
    args.forEach(function(val, index) {
        if (index === 2) {
            p("Creando tema: " + val);
            options.name = val.toLowerCase().split(" ").join("_");
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
    createTheme();

}

function createTheme() {
    let dir_scss = BASE + "scss-files/" + options.name;
    let dir_theme = BASE + options.name;
    let dist = DIST + options.name;
    let dist_placeholders = DIST + "placeholders";
    if(!fs.existsSync(dir_scss)) {
        fs.mkdirSync(dir_scss);
        fs.writeFileSync(dir_scss + "/" + options.name + ".scss", template(options.name));

        if(!fs.existsSync(dir_theme)) {
            fs.mkdirSync(dir_theme);
            fs.writeFileSync(dir_theme + "/" + options.name + ".js", definition());
        }

        if(!fs.existsSync(dist)) {
            fs.mkdirSync(dist);
            fs.mkdirSync(dist + '/background_images');
            fs.copyFileSync(dist_placeholders + "/topLeft.png", dist + "/topLeft.png", err => p(err));
            fs.copyFileSync(dist_placeholders + "/topRight.png", dist + "/topRight.png", err => p(err));
            fs.copyFileSync(dist_placeholders + "/bottomLeft.png", dist + "/bottomLeft.png", err => p(err));
            fs.copyFileSync(dist_placeholders + "/bottomRight.png", dist + "/bottomRight.png", err => p(err));

        }

        fs.appendFileSync(BASE + 'cssImporter.js', `import './scss-files/${options.name}/${options.name}.scss';`);
        p("Tema creado!");
        p("Accede a core/config.es6 y añade " + options.name + ' a pluginList');
    } else {
        p("Ya existe un directorio con el nombre " + options.name);
        p("Escoja otro nombre para el tema o borre el directorio existente");
        return;
    }

}

function template(themeName) {
    return `.${themeName} {
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
        margin: 0.1em;
        font-size: 1em;
      }
      h2{
        margin: 0.4em;
        font-size: 0.8em;
        color: var(--themeColor1);
      }
      h3{
        margin: 0.4em;
        font-size: 0.7em;
      }
      h4{
        margin: 0.4em;
        font-size: 0.6em;
      }
      .breadcrumb a{
        margin: 0.4em;
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

function definition() {
    return `
    export const DEFINITION = {
    /*
    * viewName: [<Nombre del tema en inglés>, <Nombre del tema es español>],
    * font: Fuente principal del tema (tiene que ser de Google Fonts),
    * background: [
    *   Insertar colores o url a las imágenes del tema. Por ejemplo: 'url(/themes/orange/background_images/orange0.jpg)',...
    * ],
    * colors: {
    *   themeColor1: color principal del tema,
    *   themeColor2:
    *   themeColor3:
    *   themeColor4:
    *   themeColor5:
    * },
    * images: {
    *   template1: { left: '' },
    *   template3: { topLeft: 'topLeft.png', topRight: 'topRight.png', bottomLeft: 'bottomLeft.png', bottomRight: 'bottomRight.png' },
    *   template7: { left: '' },
    * }
    * */
    viewName: ['EDiphy classic', 'EDiphy clásico'],
    font: 'Ubuntu',
    background:   {
        f16_9: [
            'url(/themes/orange/background_images/orange0.jpg)',
            'url(/themes/orange/background_images/orange1.jpg)',
        ],
        f4_3: [
            'url(/themes/orange/background_images/orange0.jpg)',
            'url(/themes/orange/background_images/orange1.jpg)',
        ],
    },
    colors: {
        themeColor1: '#17CFC8',
        themeColor2: '#ff444d',
        themeColor3: '#4bff9f',
        themeColor4: '#65caff',
        themeColor5: '#ffbe45',
        themeColor6: '#1d1d1d',
        themeColor8: 'rgba(0,0,0,0)',
        themeColor9: '#F62B73',
        themeColor10: 'white',
    },
    images: {
        template1: { left: 'colors_texture.jpg' },
        template3: { topLeft: 'topLeft.png', topRight: 'topRight.png', bottomLeft: 'bottomLeft.png', bottomRight: 'bottomRight.png' },
        template7: { left: 'placeholder.svg' },
    },
};
    `;
}
parseArgs(process.argv);
