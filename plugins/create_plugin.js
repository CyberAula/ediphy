/**
 * CLI para crear un plugin automáticamente
 * yarn run create-plugin help
 */

import path from 'path';
import fs from 'fs';
const LANGS = ["en", "es"];
const BASE = "plugins/";
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
        Uso: yarn run create-plugin \"<Nombre del plugin>\" <opciones>
         o bien : npm run create-plugin -- \"<Nombre del plugin>\"  <opciones> 
         
        Opciones: 
         no-visor:              Plugin sin definir para el visor 
         rich:                  Plugin enriquecido 
         category <categoría>:  Categoría del plugin ["text", "image", "media", "object", "evaluation"]                   
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
        p("Es obligatorio ponerle un nombre al plugin");
        p("Escribe 'npm run create-plugin help' para más información");
        return;
    }
    if (args[2] === "help") {
        help();
        return;
    }
    args.forEach(function(val, index, array) {
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
                break;
            case "rich":
                options.isRich = true;
                break;
            default:
                if(index >= 1 && args[index - 1] !== 'category') {
                    p("Opción " + val + " no reconocida");
                }
                break;
            }
        }
    });
    p("Opciones:");
    p(options);
    createPlugins();

}

function createPlugins() {
    let dir = BASE + options.name;
    if(!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
        fs.writeFileSync(dir + "/" + options.name + ".js", options.category === "evaluation" ? templateExercise() : template());
        fs.mkdirSync(dir + "/locales");
        for (let l in LANGS) {
            fs.writeFileSync(dir + "/locales/" + LANGS[l] + ".js", locales());
        }
        if(options.visor) {
            fs.mkdirSync(dir + "/visor");
            fs.writeFileSync(dir + "/visor/" + options.name + ".js", options.category === "evaluation" ? templateExerciseVisor() : visorTemplate());
        }
        if (options.category === "evaluation") {
            fs.writeFileSync(dir + "/_" + options.camelCaseName + ".scss", templateExerciseSCSS());
        }
        p("Plugin creado!");
        p("Accede a core/config.es6 y añade " + options.name + ' a pluginList');
    } else {
        p("Ya existe un directorio con el nombre " + options.name);
        p("Escoja otro nombre para el plugin o borre el directorio existente");
        return;
    }

}

function template() {
    return `import React from 'react';
import i18n from 'i18next';
${options.isRich ? `
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import MarkEditor from '../../_editor/components/rich_plugins/mark_editor/MarkEditor';
` : ''}

/* eslint-disable react/prop-types */
export function ${options.name}(base) {
    return {
        getConfig: function() {
            return {
                name: '${options.name}',
                displayName: i18n.t('${options.name}.PluginName'),
                category: "${options.category}",
                flavor: "react",
                needsConfigModal: false,
                needsTextEdition: false,
                initialWidth: '480px',
                initialHeight: "270px",
                initialWidthSlide: '30%',
                initialHeightSlide: '30%',
                icon: 'label',
                ${options.isRich ? "isRich: true," : ""}
                ${options.isRich ? "marksType: [{ name: 'Mark', key: 'value', format: '[x,y]', default: '50,50', defaultColor: '#222222' }]," : ""}
            };
        },
        getToolbar: function() {
            return {
                main: {
                    __name: "Main",
                    accordions: {
                        basic: {
                            __name: 'Config',
                            icon: 'link',
                            buttons: {
                                name: {
                                    __name: 'Config',
                                    type: 'text',
                                    value: base.getState().name,
                                    autoManaged: false,
                                },
                            },
                        },
                    },
                },
            };
        },
        getInitialState: function() {
            return {
                name: "Ediphy",
            };
        },
        getRenderTemplate: function(state) {
        ${options.isRich ? `
            let marks = state.__marks || {};
            let Mark = ({ idKey, title, style, color }) => (
                <MarkEditor style={style} time={1.5} mark={idKey} base={base} state={state}>
                    <OverlayTrigger key={idKey} text={title} placement="top" overlay={<Tooltip id={idKey}>{title}</Tooltip>}>
                        <a className="mapMarker" href="#">
                            <i key="i" style={{ color: color }} className="material-icons">room</i>
                        </a>
                    </OverlayTrigger>
                </MarkEditor>);

            let markElements = Object.keys(marks).map((id) =>{
                let value = marks[id].value;
                let title = marks[id].title;
                let color = marks[id].color;

                let position;
                if (value && value.split(',').length === 2) {
                    position = value.split(',');
                } else{
                    position = [0, 0];
                }

                return (<Mark key={id} style={{ position: 'absolute', top: position[0] + "%", left: position[1] + "%" }} color={color} idKey={id} title={title} />);
             });
           ` : ``}
            return (<div style={{ height: "100%", width: "100%" }} className="dropableRichZone">
                Hello {state.name} 
                ${options.isRich ? '{markElements}' : ''}
            </div>);

        },
         
        ${options.isRich ? `
        parseRichMarkInput: function(...value) {
            let x = (value[0] + 12) * 100 / value[2];
            let y = (value [1] + 26) * 100 / value[3];
            let finalValue = y.toFixed(2) + "," + x.toFixed(2);

            return finalValue;
        },
        validateValueInput: function(value) {
            let regex = /(^-*\\d+(?:\\.\\d*)?),(-*\\d+(?:\\.\\d*)?$)/g;
            let match = regex.exec(value);
            if(match && match.length === 3) {
                let x = Math.round(parseFloat(match[1]) * 100) / 100;
                let y = Math.round(parseFloat(match[2]) * 100) / 100;
                if (isNaN(x) || isNaN(y)/* || x > 100 || y > 100 || x < -100 || y < -100*/) {
                    return { isWrong: true, message: "404" };
                }
                value = x + ',' + y;
            } else {
                return { isWrong: true, message: "404" };
            }
            return { isWrong: false, value: value };
        },

            ` : ``}
        
        
    };
}
/* eslint-enable react/prop-types */
`;
}
function locales() {
    return `
module.exports = {
    "${options.name}": {
        "PluginName": "${options.displayName}",
        ${options.category === "evaluation" ? (
        `"content_box_name": "Content ",
        "Statement": "This is a Multiple Choice question with a single correct answer. You can write here the question statement",
        "Question": "Question",
        "Answer": "Answer",
        "Number": "Number",`) : (``)}
    },
};
`;
}

function visorTemplate() {
    return `
import React from 'react';
${options.isRich ? `
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
` : ''}
/* eslint-disable react/prop-types */
export function ${options.name}(base) {
    ${options.isRich ? `
    let marks = state.__marks;
    let box_id = id;

    let markElements = Object.keys(marks).map((e) =>{

        let position = marks[e].value.split(',');
        let title = marks[e].title;
        let color = marks[e].color;

        return(
            <a key={e} style={{ position: 'absolute', top: position[0] + "%", left: position[1] + "%", width: '24px', height: '26px' }} onClick={()=>{this.onMarkClicked(box_id, marks[e].value);}} href="#">
                <OverlayTrigger placement="top" overlay={<Tooltip positionLeft="-12" id={e}>{title}</Tooltip>}>
                    <i key="i" style={{ width: "100%", height: "100%", position: 'absolute', top: '-26px', left: '-12px', color: color }} className="material-icons">room</i>
                </OverlayTrigger>
            </a>
        );
    });` : ''}
    return {
        getRenderTemplate: function(state) {
            return <div style={{ height: "100%", width: "100%" }} >Hello {state.name}</div>
        }
    };
}
/* eslint-enable react/prop-types */

`;
}

function templateExercise() {
    return `import React from 'react';
import PluginPlaceholder from '../../_editor/components/canvas/plugin_placeholder/PluginPlaceholder';
import './_${options.camelCaseName}.scss';
import i18n from 'i18next';
import { letterFromNumber } from '../../common/common_tools';
/* eslint-disable react/prop-types */

export function ${options.name}(base) {
    return {
        getConfig: function() {
            return {
                name: '${options.name}',
                displayName: Ediphy.i18n.t('${options.name}.PluginName'),
                category: 'evaluation',
                icon: 'school',
                initialWidth: '60%',
                flavor: 'react',
                isComplex: true,
                defaultCorrectAnswer: false,
            };
        },
        getToolbar: function() {
            return {
                main: {
                    __name: "Main",
                    accordions: {
                        _general: {
                            __name: "General",
                            icon: 'web',
                            buttons: {
                                nBoxes: {
                                    __name: i18n.t("${options.name}.Number"),
                                    type: 'number',
                                    value: base.getState().nBoxes,
                                    min: 1,
                                    autoManaged: false,
                                },
                            },
                        },
                    },
                },
            };
        },
        getInitialState: function() {
            return {
                nBoxes: 3,
            };
        },
        getRenderTemplate: function(state, props = {}) {
            let answers = [];
            for (let i = 0; i < state.nBoxes; i++) {
                let clickHandler = (e)=>{
                    props.setCorrectAnswer(parseInt(e.target.value, 10));
                };
                answers.push(<div key={i + 1} className={"row answerRow"}>
                    <div className={"col-xs-2 answerPlaceholder"}>
                        {letterFromNumber(i)}
                        <input type="radio" className="radioQuiz" name={props.id} value={i} checked={props.exercises.correctAnswer === i /* ? 'checked' : 'unchecked'*/ }
                            onChange={clickHandler} />
                    </div>
                    <div className={"col-xs-10"}>
                        <PluginPlaceholder {...props} key={i + 1} plugin-data-display-name={i18n.t("${options.name}.Answer") + " " + (i + 1)} plugin-data-default="BasicText" plugin-data-text={i18n.t("${options.name}.Answer") + " " + (1 + i)} pluginContainer={"Answer" + i} />
                    </div>
                </div>
                );
            }
            return <div className={"exercisePlugin ${options.camelCaseName}Plugin"}>
                <div className={"row"} key={0}>
                    <div className={"col-xs-12"}>
                        <PluginPlaceholder {...props} key="1" plugin-data-display-name={i18n.t("${options.name}.Question")} plugin-data-default="BasicText" plugin-data-text={i18n.t("${options.name}.Statement")} pluginContainer={"Question"} />
                    </div>
                </div>
                {answers}
            </div>;

        },
         
    };
}
/* eslint-enable react/prop-types */

`;
}

function templateExerciseVisor() {
    return `import React from 'react';
import VisorPluginPlaceholder from '../../../_visor/components/canvas/VisorPluginPlaceholder';
import i18n from 'i18next';
import { letterFromNumber } from '../../../common/common_tools';
/* eslint-disable react/prop-types */

export function ${options.name}() {
    return {
        getRenderTemplate: function(state, id, props) {
            let content = [];
            let attempted = props.exercises && props.exercises.attempted;
            let score = (props.exercises.score || 0) + "/" + (props.exercises.weight || 0);

            for (let i = 0; i < state.nBoxes; i++) {
                let correct = attempted && props.exercises.correctAnswer === i; // && props.exercises.currentAnswer === i ;
                let incorrect = attempted && (/* (props.exercises.correctAnswer === i && props.exercises.currentAnswer !== i)||*/(props.exercises.correctAnswer !== i && props.exercises.currentAnswer === i));
                let checked = props.exercises.currentAnswer === i; //  (attempted && props.exercises.correctAnswer === i) || (!attempted && props.exercises.currentAnswer === i)
                content.push(
                    <div key={i + 1} className={"row answerRow " + (correct ? "correct " : " ") + (incorrect ? "incorrect " : "")}>
                        <div className={"col-xs-2 answerPlaceholder"}>
                            {letterFromNumber(i)}
                            <input type="radio" disabled={attempted} className="radioQuiz" name={props.id}
                                value={i} checked={ checked}
                                onChange={(e)=>{
                                    props.setAnswer(parseInt(e.target.value, 10));
                                }}/>
                        </div>
                        <div className={"col-xs-10"}>
                            <VisorPluginPlaceholder {...props} key={i + 1} pluginContainer={"Answer" + i} />
                        </div>
                    </div>);

            }

            return <div className={"exercisePlugin ${options.camelCaseName}Plugin" + (attempted ? " attempted " : " ") + (props.exercises.showFeedback ? "showFeedback" : "")}>
                <div className={"row"} key={0} >
                    <div className={"col-xs-12"}>
                        <VisorPluginPlaceholder {...props} key="0" pluginContainer={"Question"}/>
                    </div>

                </div>
                {content}
                <div className={"exerciseScore"}>{score}</div>
            </div>;
        },
        checkAnswer(current, correct) {
            return (current) === (correct);
        },
    };
}
/* eslint-enable react/prop-types */
`;
}

function templateExerciseSCSS() {
    return `@import "../../sass/general/_variables.scss";

.${options.camelCaseName}Plugin {
  .radioQuiz {
    margin-left: 14px !important;
    transform: scale(1.4);
    margin-right: 4px;
  }

  .answerPlaceholder {
    font-size: 24px;
    margin-bottom: 10px;
    margin-top: 7px;
  }

  .answerRow {
    margin: 0px;
  }
  .exerciseScore {
    display: none;
    text-align: right;
  }
  &.attempted  .exerciseScore{
    display: block;
    color: $blueprimary;
    font-size: 10px;
  }

  &.attempted.showFeedback .answerRow {
    margin-top: 2px;
    border: 2px solid transparent;
    border-radius: 5px;
      &.correct {
        border: 2px solid rgba(0,255,0,0.5);
      }

      &.incorrect {
        border: 2px solid rgba(255,0,0,0.5);
      }
  }

}

`;

}

parseArgs(process.argv);
