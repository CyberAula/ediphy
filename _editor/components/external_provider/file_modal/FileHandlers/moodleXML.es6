import { isDataURL, dataURItoBlob } from '../../../../../common/utils';
import xml2json from 'basic-xml2json';
import moodlexml2j from 'moodlexml-to-json';
import { ID_PREFIX_BOX } from '../../../../../common/constants';
import i18n from 'i18next';
export default function parseMoodleXML(file, callback) {
    let parser = new DOMParser();
    let xmlDoc = "";
    if (isDataURL(file)) {
        let fileReader = new FileReader();
        fileReader.onload = (e)=> {
            try {
                convert(e.srcElement.result, callback);
                // xml2jsonParser(e.srcElement.result, callback);
            } catch (_e) {
                callback({ success: false, msg: i18n.t('MoodleXML.parse_error') });
            }
        };

        fileReader.readAsText(dataURItoBlob(file), 'utf8');
    } else {
        fetch(file).then(res => {
            return res.text();
        }).then(xml => {
            xml2jsonParser(xml, callback);
        }).catch(e=>{
            callback({ success: false, msg: i18n.t('MoodleXML.parse_error') });
        });
    }

}

function convert(res, callback) {
    moodlexml2j(res, (data, e)=>{
        try {
            if(e) {
                console.error(e);
            }
            let questions = data.questions.filter(q=>q.type && q.type !== "category");
            console.log(questions);
            let answers, questiontext, answerTexts, scores, correctAnswer, currentAnswer, feedback, showFeedback;
            for (let q in questions) {
                let qu = questions[q];
                let question = {};
                switch(qu.type) {
                case "multichoice":
                    correctAnswer = qu.single ? qu.correctAnswer[0] : qu.correctAnswer;
                    question = {
                        name: qu.single ? 'MultipleChoice' : 'MultipleAnswer',
                        correctAnswer,
                        currentAnswer: false,
                        answers: qu.answers.map(ans=>"<p>" + ans.text + "</p>"),
                        question: "<p>" + qu.questiontext + "</p>",
                        feedback: qu.generalfeedback || "<p></p>",
                        state: {
                            nBoxes: qu.answers.length,
                            showFeedback: !!qu.generalfeedback,
                            letters: qu.answernumbering !== '123',
                        },
                    };
                    if (qu.single) {
                        question.state.allowPartialScore = false;
                    }
                    console.log(question);
                    break;
                case "truefalse":
                    question = {
                        name: 'TrueFalse',
                        correctAnswer: ["" + qu.correctAnswer],
                        currentAnswer: ["false"],
                        answers: ["<p>" + qu.questiontext + "</p>"],
                        question: "<p>Indica si la siguiente afirmación es verdadera o falsa</p>",
                        feedback: qu.generalfeedback || "<p></p>",
                        state: {
                            nBoxes: 1,
                            showFeedback: !!qu.generalfeedback,
                        },
                    };
                    break;
                case "shortanswer":
                    question = {
                        name: 'InputText',
                        correctAnswer: qu.answers.map(q=>q.text).join('//'),
                        currentAnswer: "",
                        state: {
                            type: 'text',
                            fontSize: 14,
                            precision: 0.01,
                            characters: qu.usecase,
                            showFeedback: !!qu.generalfeedback,
                        },
                    };
                    break;
                case "essay":
                    question = {
                        name: 'FreeResponse',
                        correctAnswer: true,
                        currentAnswer: false,
                        question: qu.questiontext,
                        feedback: qu.generalfeedback || "<p></p>",
                        state: {
                            showFeedback: !!qu.generalfeedback,
                        },
                    };
                    break;
                case "numerical":
                    question = {
                        name: 'InputText',
                        correctAnswer: qu.correctAnswer.join("//"),
                        currentAnswer: "",
                        question: qu.questiontext,
                        feedback: qu.generalfeedback || "<p></p>",
                        state: {
                            type: 'number',
                            fontSize: 14,
                            precision: qu.tolerance || 0,
                            characters: true,
                            showFeedback: !!qu.generalfeedback,
                        },
                    };
                    break;
                case "matching":
                case "cloze":
                case "description":
                default:
                    console.error("Not supported");

                }
                console.log(question);
                callback({ success: true, question: { ...question, id: (ID_PREFIX_BOX + '_' + q + '_' + Date.now()) } });
            }
        }catch(err) {
            console.error(err);
            callback({ success: false, msg: i18n.t('MoodleXML.parse_error') });
        }

    });
}

function xml2jsonParser(xmlDoc, callback) {
    try {
        let xmljson = xml2json.parse(xmlDoc); // TODO score
        let question = {};
        let answers, questiontext, answerTexts, scores, correctAnswer, currentAnswer, feedback, showFeedback;
        if (xmljson && xmljson.root && xmljson.root.name === "quiz") {
            for (let q in xmljson.root.children) {
                question = xmljson.root.children[q];
                if (question.attributes.type === "category") {
                    continue;
                }
                let children = question.children;
                // let children = xmljson.root.children;
                feedback = children.filter(child => child.name === 'generalfeedback');
                showFeedback = feedback.length > 0;
                feedback = showFeedback ? feedback[0].content : "";
                questiontext = children.filter(child => child.name === 'questiontext');
                if (questiontext && questiontext.children && questiontext.children.text) {
                    questiontext = questiontext.children.text;
                }
                questiontext = questiontext.length > 0 ? (questiontext[0].content || (questiontext[0].children.map(c=>c.content)).join('<br/>')) : "";
                if (!questiontext) {
                    // throw new UnknownErrorException();
                }
                switch(question.attributes.type) {
                case "multichoice":
                    answers = children.filter(child => child.name === 'answer');
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
                            nBoxes: answerTexts.length,
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
                    callback({ success: false, msg: i18n.t('MoodleXML.not_supported') });
                    break;
                default:
                    callback({ success: false, msg: i18n.t('MoodleXML.unrecognized') });
                    break;
                }
                console.log(question);
                // callback({ success: true, question: { ...question, id: (ID_PREFIX_BOX + '_' + q + '_' + Date.now()) } });
            }

        } else {
            console.error(e);
            callback({ success: false, msg: i18n.t('MoodleXML.are_you_sure') });
        }

    } catch (e) {
        console.error(e);
        callback({ success: false, msg: i18n.t('MoodleXML.parse_error') });
    }
}

