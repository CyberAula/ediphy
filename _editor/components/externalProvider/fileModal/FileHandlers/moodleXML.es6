import { isDataURL, dataURItoBlob } from '../../../../../common/utils';
import moodlexml2j from 'moodlexml-to-json';
import { ID_PREFIX_BOX } from '../../../../../common/constants';
import i18n from 'i18next';

export function parseMoodleXML(file, callback) {
    if (isDataURL(file)) {
        let fileReader = new FileReader();
        fileReader.onload = (e)=> {
            try {
                convert(e.srcElement.result, callback);
            } catch (_e) {
                // eslint-disable-next-line no-console
                console.error(_e);
                callback({ success: false, msg: i18n.t('MoodleXML.parse_error') });
            }
        };

        fileReader.readAsText(dataURItoBlob(file), 'utf8');
    } else {
        fetch(file).then(res => {
            return res.text();
        }).then(xml => {
            convert(xml, callback);
        }).catch(()=>{
            callback({ success: false, msg: i18n.t('MoodleXML.parse_error') });
        });
    }

}

function convert(res, callback) {
    moodlexml2j(res, (data, e)=>{

        try {
            if(e) {
                // eslint-disable-next-line no-console
                console.error(e);
            }
            let questions = data.questions.filter(q=>q.type && q.type !== "category");
            let correctAnswer;
            let filteredQuestions = [];
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
                        question: qu.questiontext || "<p></p>",
                        img: qu.img || null,
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
                    break;
                case "truefalse":
                    question = {
                        name: 'TrueFalse',
                        correctAnswer: ["" + qu.correctAnswer],
                        currentAnswer: ["false"],
                        answers: ["<p>" + qu.questiontext + "</p>"],
                        question: "<p>Indica si la siguiente afirmación es verdadera o falsa</p>",
                        img: qu.img || null,
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
                        correctAnswer: qu.answers.map(quest=>quest.text).join('//'),
                        currentAnswer: "",
                        question: qu.questiontext || "<p></p>",
                        img: qu.img || null,
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
                        correctAnswer: "",
                        currentAnswer: false,
                        question: qu.questiontext || "<p></p>",
                        img: qu.img || null,
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
                        question: qu.questiontext || "<p></p>",
                        img: qu.img || null,
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
                    // eslint-disable-next-line no-console
                    console.error("Not supported");
                }

                if (question.name) {filteredQuestions.push({ ...question, id: (ID_PREFIX_BOX + '_' + q + '_' + Date.now()) });}
                // callback({ success: true, question: { ...question, id: (ID_PREFIX_BOX + '_' + q + '_' + Date.now()) }, filtered: filteredQuestions });

            }

            callback({ success: true, filtered: filteredQuestions });
        }catch(err) {
            // eslint-disable-next-line no-console
            console.log(err);
            callback({ success: false, msg: i18n.t('MoodleXML.parse_error') });
        }
    });
}
