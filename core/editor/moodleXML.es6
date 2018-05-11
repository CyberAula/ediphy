import { isDataURL, dataURItoBlob } from '../../common/utils';
import xml2json from 'basic-xml2json';

export default function parseMoodleXML(file, callback) {
    let parser = new DOMParser();
    let xmlDoc = "";
    if (isDataURL(file)) {
        let fileReader = new FileReader();
        fileReader.onload = (e)=> {
            try {
                xml2jsonParser(e.srcElement.result, callback);
            } catch (e) {
                callback({ success: false, msg: 'Error al parsear el fichero' });
            }
        };
        fileReader.readAsBinaryString(dataURItoBlob(file), callback);
    } else {
        fetch(file).then(res => {
            return res.text();
        }).then(xml => {
            xml2jsonParser(xml, callback);
        }).catch(e=>{
            callback({ success: false, msg: 'Error al parsear el fichero' });
        });
    }

}

function xml2jsonParser(xmlDoc, callback) {
    try {
        let xmljson = xml2json.parse(xmlDoc); // TODO score
        let question = {};
        let answers, questiontext, answerTexts, scores, correctAnswer, currentAnswer, feedback, showFeedback;
        if (xmljson && xmljson.root && xmljson.root.name === "question") {
            let children = xmljson.root.children;
            feedback = children.filter(child => child.name === 'generalfeedback');
            showFeedback = feedback.length > 0;
            feedback = showFeedback ? feedback[0].content : "";
            questiontext = children.filter(child => child.name === 'questiontext');
            questiontext = questiontext.length > 0 ? (questiontext[0].content || (questiontext[0].children.map(c=>c.content)).join('<br/>')) : "";
            switch(xmljson.root.attributes.type) {
            case "multichoice":
                answers = children.filter(child => child.name === 'answer');
                answerTexts = answers.map(ans => ans.children.filter(el=>el.name === 'text')[0].content);
                scores = answers.map(ans => parseInt(ans.attributes.fraction, 0));

                let single = children.some(child => child.name === 'single' && (!child.content || child.content === 'true'));
                if (single) {
                    correctAnswer = scores.indexOf(100);
                } else {
                    correctAnswer = [];
                    scores.map((s, i) => {if (s === 100) {correctAnswer.push(i);}});
                }
                currentAnswer = false;
                let useNumbers = false;
                let answernumberingobj = children.filter(child => child.name === 'answernumbering');
                if (answernumberingobj && answernumberingobj.length > 0) {
                    useNumbers = answernumberingobj[0].content === '123';
                }
                question = {
                    name: single ? 'MultipleChoice' : 'MultipleAnswer',
                    correctAnswer, currentAnswer,
                    answers: answerTexts,
                    question: questiontext,
                    feedback,
                    state: {
                        nBoxes: 3,
                        showFeedback,
                        letters: !useNumbers,
                    },
                };
                if (single) {
                    question.state.allowPartialScore = false;
                }
                break;
            case "truefalse":
                answers = children.filter(child => child.name === 'answer');
                answerTexts = answers.map(ans => ans.children.filter(el => el.name === 'text')[0].content);
                scores = answers.map(ans => parseInt(ans.attributes.fraction, 0));
                correctAnswer = scores.map(s => (s === 100).toString());
                currentAnswer = scores.map(s => "false");
                question = {
                    name: 'TrueFalse',
                    correctAnswer,
                    currentAnswer,
                    answers: answerTexts,
                    question: questiontext,
                    feedback,
                    state: {
                        nBoxes: correctAnswer.length,
                        showFeedback,
                    },
                };
                break;
            case "shortanswer":
                answers = children.filter(child => child.name === 'answer');
                answerTexts = answers.map(ans => ans.children.filter(el => el.name === 'text')[0].content);
                correctAnswer = answerTexts.join('//');
                currentAnswer = "";
                let characters = !children.some(child => child.name === 'usecase' && (!child.content || child.content === 'true'));
                question = {
                    name: 'InputText',
                    correctAnswer,
                    currentAnswer,
                    state: {
                        type: 'text',
                        fontSize: 14,
                        precision: 0.01,
                        characters,
                        showFeedback,
                    },
                };
                break;
            case "essay":
                precision = precision[0].content;
                question = {
                    name: 'FreeResponse',
                    correctAnswer: true,
                    currentAnswer: false,
                    question: questiontext,
                    feedback,
                    state: {
                        showFeedback,
                    },
                };
                break;
            case "numerical":
                answers = children.filter(child => child.name === 'answer');
                correctAnswer = answers.join('//');
                currentAnswer = "";
                let precision = children.filter(child => child.name === 'tolerance');
                precision = precision[0].content;
                question = {
                    name: 'InputText',
                    correctAnswer,
                    currentAnswer,
                    question: questiontext,
                    feedback,
                    state: {
                        type: 'number',
                        fontSize: 14,
                        precision,
                        characters: true,
                        showFeedback,
                    },
                };
                break;
            case "matching":
            case "cloze":
            case "description":
                callback({ success: false, msg: 'Not yet supported' });
                return;
            default:
                callback({ success: false, msg: 'Unrecognized exercise type' });
                return;
            }
            callback({ success: true, question });

        } else {
            callback({ success: false, msg: 'Seguro que es MoodleXML?' });
        }

    } catch (e) {
        callback({ success: false, msg: 'Error al parsear el fichero' });
    }
}

