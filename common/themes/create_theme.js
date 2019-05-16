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

        p("Plugin creado!");
        p("Accede a core/config.es6 y añade " + options.name + ' a pluginList');
    } else {
        p("Ya existe un directorio con el nombre " + options.name);
        p("Escoja otro nombre para el plugin o borre el directorio existente");
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
function locales() {
    return `
module.exports = {
    "${options.name}": {
        "PluginName": "${options.displayName}",
        ${options.category === "evaluation" ? (
        `"content_box_name": "Content ",
        "Statement": "This is a Multiple Choice question with a single correct answer. You can write here the question statement",
        "Question": "Question",
        "Feedback": "Feedback",
        "FeedbackMsg": "Here you can provide some feedback about the answer. In order to disable this feature, turn it off in the toolbar.",
        "ShowFeedback": "Show feedback msg.",
        "Number": "Number  of answers",
        "ShowLettersInsteadOfNumbers": "Show letters instead of numbers",
        "background_color": "Background color",
        "border_color": "Border color",
        "border_size": "Border Size",
        "border_style": "Border Style",
        "box_style": "Box style",
        "opacity": "Opacity",
        "padding": "Padding",
        "pos": "Position",
        "radius": "Radius",
        "source": "Fuente",
        "Answer": "Answer",
        "Number": "Number",`) :
        (``)}
    },
};
`;
}

function visorTemplate() {
    return `
import React from 'react';
${options.isRich ? `
import Mark from '../../../common/components/mark/Mark';

` : ''}
/* eslint-disable react/prop-types */
export function ${options.name}(base) {

    return {
        getRenderTemplate: function(state, props) {
            ${options.isRich ? `
            let marks = props.marks || {};
            let box_id = props.id;
    
            let markElements = Object.keys(marks).map((e) =>{
            let position = marks[e].value.split(',');
            let title = marks[e].title;
            let color = marks[e].color;
            let isPopUp = marks[e].connectMode === "popup";
            let isVisor = true;
            return(
                <div key={e} style={{ position: 'absolute', top: position[0] + "%", left: position[1] + "%", width: '24px', height: '26px' }}>
                    <Mark color={color}
                        idKey={e}
                        title={title}
                        isPopUp={isPopUp}
                        isVisor={isVisor}
                        markConnection={marks[e].connection}
                        markValue={marks[e].value}
                        boxID={box_id}
                        onMarkClicked={props.onMarkClicked}/></div>
            );
        });` : ''}
            return <div style={{ height: "100%", width: "100%" }} >Hello {state.name}
            ${options.isRich ? `{markElements}` : ``}
            </div>
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
                defaultCorrectAnswer: 0,
                defaultCurrentAnswer: false,
            };
        },
        getToolbar: function(state) {
            return {
                main: {
                    __name: "Main",
                    accordions: {
                        __score: {
                            __name: i18n.t('configuration'),
                            icon: 'build',
                            buttons: {
                                nBoxes: {
                                    __name: i18n.t("${options.name}.Number"),
                                    type: 'number',
                                    value: state.nBoxes,
                                    max: 10,
                                    min: 1,
                                },
                                showFeedback: {
                                    __name: i18n.t("${options.name}.ShowFeedback"),
                                    type: 'checkbox',
                                    checked: state.showFeedback,
                                },
                                letters: {
                                    __name: i18n.t("${options.name}.ShowLettersInsteadOfNumbers"),
                                    type: 'checkbox',
                                    checked: state.letters,
                                },
                            },
                        },
                        style: {
                            __name: Ediphy.i18n.t('${options.name}.box_style'),
                            icon: 'palette',
                            buttons: {
                                padding: {
                                    __name: Ediphy.i18n.t('${options.name}.padding'),
                                    type: 'number',
                                    value: 10,
                                    min: 0,
                                    max: 100,
                                },
                                backgroundColor: {
                                    __name: Ediphy.i18n.t('${options.name}.background_color'),
                                    type: 'color',
                                    value: '#ffffff',
                                },
                                borderWidth: {
                                    __name: Ediphy.i18n.t('${options.name}.border_size'),
                                    type: 'number',
                                    value: 1,
                                    min: 0,
                                    max: 10,
                                },
                                borderStyle: {
                                    __name: Ediphy.i18n.t('${options.name}.border_style'),
                                    type: 'select',
                                    value: 'solid',
                                    options: ['none', 'hidden', 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset', 'initial', 'inherit'],
                                },
                                borderColor: {
                                    __name: Ediphy.i18n.t('${options.name}.border_color'),
                                    type: 'color',
                                    value: '#dbdbdb',
                                },
                                borderRadius: {
                                    __name: Ediphy.i18n.t('${options.name}.radius'),
                                    type: 'number',
                                    value: 0,
                                    min: 0,
                                    max: 50,
                                },
                                opacity: {
                                    __name: Ediphy.i18n.t('${options.name}.opacity'),
                                    type: 'range',
                                    value: 1,
                                    min: 0,
                                    max: 1,
                                    step: 0.01,
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
                showFeedback: true,
                letters: true,
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
                        <div className={"answer_letter"} >{state.letters ? letterFromNumber(i) : (i + 1)}</div>
                        <input type="radio" className="radioQuiz" name={props.id} value={i} checked={props.exercises.correctAnswer === i /* ? 'checked' : 'unchecked'*/ }
                            onChange={clickHandler} />
                    </div>
                    <div className={"col-xs-10"}>
                        <PluginPlaceholder {...props} key={i + 1} 
                        pluginContainerName={i18n.t("${options.name}.Answer") + " " + (i + 1)} 
                        pluginDefaultContent={[{ plugin: 'BasicText', initialState: { __text: '<p>' + i18n.t("${options.name}.Answer") + " " + (1 + i) + '</p>' } }]}
                        pluginContainer={"Answer" + i} />
                    </div>
                </div>
                );
            }
            return <div className={"exercisePlugin ${options.camelCaseName}Plugin"}>
                <div className={"row"} key={0}>
                    <div className={"col-xs-12"}>
                        <PluginPlaceholder {...props} key="1" 
                            pluginContainerName={i18n.t("${options.name}.Question")} 
                            pluginDefaultContent={[{ plugin: 'BasicText', initialState: { __text: '<p>' + i18n.t("${options.name}.Statement") + '</p>' } }]}
                            pluginContainer={"Question"} />
                    </div>
                </div>
                {answers}
                <div className={"row feedbackRow"} key={-2} style={{ display: state.showFeedback ? 'block' : 'none' }}>
                    <div className={"col-xs-12 feedback"}>
                        <PluginPlaceholder {...props} key="-2" 
                        pluginContainerName={i18n.t("${options.name}.Feedback")} 
                        pluginDefaultContent={[{ plugin: 'BasicText', initialState: { __text: '<p>' + i18n.t("${options.name}.FeedbackMsg") + '</p>' } }]}
                        pluginContainer={"Feedback"} />
                    </div>
                </div>
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
import { compareNumbersLiterally } from '../../../core/visor/correction_functions';

/* eslint-disable react/prop-types */

export function ${options.name}() {
    return {
        getRenderTemplate: function(state, props) {
            let content = [];
            let attempted = props.exercises && props.exercises.attempted;
            let score = props.exercises.score || 0;
            score = Math.round(score * 100) / 100;
            score = (score) + "/" + (props.exercises.weight || 0);
            let showFeedback = attempted && state.showFeedback;
            for (let i = 0; i < state.nBoxes; i++) {
                let correct = attempted && props.exercises.correctAnswer === i; // && props.exercises.currentAnswer === i ;
                let incorrect = attempted && (/* (props.exercises.correctAnswer === i && props.exercises.currentAnswer !== i)||*/(props.exercises.correctAnswer !== i && props.exercises.currentAnswer === i));
                let checked = props.exercises.currentAnswer === i; //  (attempted && props.exercises.correctAnswer === i) || (!attempted && props.exercises.currentAnswer === i)
                content.push(
                    <div key={i + 1} className={"row answerRow " + (correct ? "correct " : " ") + (incorrect ? "incorrect " : " ")}>
                        <div className={"col-xs-2 answerPlaceholder"}>
                            <div className={"answer_letter"} >{state.letters ? letterFromNumber(i) : (i + 1)}</div>
                            <input type="radio" disabled={attempted} className="radioQuiz" name={props.id}
                                value={i} checked={ checked}
                                onChange={(e)=>{
                                    props.setAnswer(parseInt(e.target.value, 10));
                                }}/>
                        </div>
                        <div className={"col-xs-10"} onClick={(e)=>{props.setAnswer(parseInt(i, 10));}}>
                            <VisorPluginPlaceholder {...props} key={i + 1} pluginContainer={"Answer" + i} />
                        </div>
                        <i className={ "material-icons " + (correct ? "correct " : " ") + (incorrect ? "incorrect " : " ")} style={{ display: (correct || incorrect) ? "block" : "none" }}>{(correct ? "done " : "clear")}</i>
                    </div>);

            }

            return <div className={"exercisePlugin ${options.camelCaseName}Plugin" + (attempted ? " attempted " : " ") + (props.exercises.showFeedback ? "showFeedback" : "")}>
                <div className={"row"} key={0} >
                    <div className={"col-xs-12"}>
                        <VisorPluginPlaceholder {...props} key="0" pluginContainer={"Question"}/>
                    </div>
                </div>
                {content}
                <div className={"row feedbackRow"} key={-2} style={{ display: showFeedback ? 'block' : 'none' }}>
                    <div className={"col-xs-12 feedback"}>
                        <VisorPluginPlaceholder {...props} key="0" pluginContainer={"Feedback"}/>
                    </div>
                </div>
                <div className={"exerciseScore"}>{score}</div>
            </div>;
        },
        checkAnswer(current, correct) {
            return compareNumbersLiterally(current, correct);

        },             
    };
}
/* eslint-enable react/prop-types */
`;
}

function templateExerciseSCSS() {
    return `@import "../../sass/general/_variables.scss";

.${options.camelCaseName}Plugin {
  display: flex;
  flex-direction: column;
  padding: 0.8em;
  .row {
    margin-left: -1em;
    margin-right: -1em;
  }
  .col-xs-12 {
    padding: 0;
  }
  .answerPlaceholder {
    display: flex;
    font-size: 1.5em;
    margin: 0.4em 0.14em 0.4em 0.8em;
    text-align: right;
    color: $blueprimarydark;
    padding: 0;
    width: auto;
    margin-top: 0.2em;
    .answer_letter{
      color: white;
      background-color: #00ad9c;
      border-radius: 1em;
      width: 1.5em;
      height: 1.5em;
      text-align: center;
      line-height: 1.1em;
      font-weight: 100;
      text-transform: uppercase;
      padding: 0.15em 0px;
      font-size: 1.2em;
    }
    .radioQuiz {
       margin: 0.45em 0.3em 0.5em 0.6em;

    }
  }
  .answerRow {
    display: flex;
    flex-direction: row;
    margin: 0;
    .col-xs-10{
      padding: 0;
      width: 75%;
    }
    i{
      margin: 0.5em -1em;
      &.correct{
        color: $detailgreen;
      }
      &.incorrect{
        color: $lightred;
      }
    }
  }
  .exerciseScore {
    display: none;
    text-align: right;
  }
  &.attempted  .exerciseScore{
    display: block;
    color: $blueprimary;
    font-size: 0.8em;
  }


  &.attempted.showFeedback .answerRow {
    padding: 0;

  }
  .feedbackRow {
    padding: 0.8em 0;
    margin:0;
    .feedback {
      color: $blueprimary;
      margin:0;
      padding:0;
      border: 0.1em solid $blueprimary;
      border-radius: 0.2em;
    }

  }
  .correctAnswerFeedback {
    text-align: left;
    text-transform: uppercase;
    .correctAnswerLabel{
      text-transform: none;
    }
  }
}

`;

}

parseArgs(process.argv);
