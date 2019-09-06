export default function toMoodleXML(state, callback) {

    let download = (filename, text) => {
        let element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        callback();
    };

    let moodleType = (quizName) => {
        let out = quizName;
        switch (quizName) {
        case 'MultipleChoice':
            out = 'multichoice';
            break;
        case 'MultipleAnswer':
            out = 'multichoice';
            break;
        case 'InputText':
            out = 'shortanswer';
            break;
        case 'FreeResponse':
            out = 'essay';
            break;
        case 'TrueFalse':
            out = 'truefalse';
            break;
        default:
        }

        return out;
    };
    let sanitizeHTML = (htmlText) => {
        return htmlText.replace(/<(?:.|\n)*?>/gm, '');
    };
    /* eslint-disable */
    let moodleString = (questions) => {
        return(
        `<?xml version="1.0" encoding="UTF-8"?>
        <quiz>
        <question type="category">
            <category>
              <text>__Category Name__</text>
            </category>
        </question>
        ${questions.map((q,i)=>{
            return question(i,q);
        }).join("\n")}
        </quiz>`);};


        const question = (index,{type, question, answers, correctAnswer, useLetters, feedback, single}) => { return `	<!-- Question entry ${index} -->
        <question type="${type}">
            <name>
                <text><![CDATA[${question}]]></text>
            </name>
            <questiontext>
                <text><![CDATA[${question}]]></text>
            </questiontext>
            ${questionType(type, question, answers, correctAnswer, useLetters, feedback, single)}
            ${feedback ? `<generalfeedback><text>${feedback}</text></generalfeedback>` : ``}
        </question>
        `.replace('\n\t*\n', '');
        }

        const questionType = (type, question, answers, correctAnswer, useLetters, feedback, single) => {
            if (type === 'matching' || type === "order"){
                return `${(answers||[]).map((a,i) => {
                    return `<subquestion>
                <text><![CDATA[${a}]]></text>
                <answer>
                    <text><![CDATA[${correctAnswer[i]}]]></text>
                </answer>
            </subquestion>`
                }).join("")}`;

            } else {
                return `${(answers||[]).map((a,i) => {
                    const fraction = correctAnswer === i  || (Array.isArray(correctAnswer) && correctAnswer.indexOf(i) !== -1) ? "100" : "0";
                    return `
            <answer fraction="${fraction}">
                <text><![CDATA[${a}]]></text>
            </answer>`;
                }).join("")}
        ${single ?  `			<single>true</single>` : ``}
        ${useLetters === false ? `		<answernumbering>123</answernumbering>` : ``}	`;
            }

    };

    let toLibJson = (state) => {
        let out = {};
        let plugins = state.pluginToolbarsById;
        let exercises = state.exercises;

        Object.keys(exercises).map((navItem, index) => {
            Object.keys(exercises[navItem].exercises).map(exId => {
                let question = [];
                let answers = [];
                let feedback = [];
                Object.values(state.boxesById).map(box => {
                    if (box.parent === exId) {
                        if (box.container.indexOf("Question") !== -1) {
                            question.push(box);
                            return;
                        }
                        if (box.container.indexOf("Answer") !== -1) {
                            answers.push(box);
                            return;
                        }
                        if (box.container.indexOf("Feedback") !== -1) {
                            feedback.push(box);
                        }
                    }
                }
                );
                let ex = exercises[navItem].exercises[exId];
                let type = moodleType(ex.name);
                let feedbackText = feedback.length >= 1 ? sanitizeHTML(plugins[feedback[0].id].state["__text"]) : 'Well done!';
                let questionText = question.length >= 1 ? sanitizeHTML(plugins[question[0].id].state["__text"]): 'Question here';

                switch (type) {
                    case 'essay':
                        out[exId] = {
                            type: type,
                            question: questionText,
                            correctAnswer: 0,
                            answers: [''],
                        };
                        return;
                    case 'shortanswer':
                        let isNumerical = !isNaN(ex.correctAnswer);
                        // let question = plugins.hasOwnProperty(exId + '_0') && plugins[exId + '_0'].pluginId === 'BasicText' ? plugins[exId + '_0'].state['__text'] : 'Type the question here. Its answer is ' + ex.correctAnswer;
                        let question = 'Type the question here. Its answer is ' + ex.correctAnswer;
                        out[exId] = {
                            type: isNumerical ? 'numerical' : type,
                            question: question,
                            correctAnswer: 0,
                            answers: [ex.correctAnswer],
                        };
                        return;
                    case 'truefalse':
                        answers.map( a => sanitizeHTML(plugins[a.id].state["__text"])).map( (ans, i) => {
                            out[exId + '_' + i] =  {
                                answers: ['True', 'False'],
                                question: ans,
                                correctAnswer: ex.correctAnswer[i] === 'false' ? 1 : 0,
                                type: type,
                            }
                        });
                        return;
                    default:
                        out[exId] = {
                            answers: answers.map( a => sanitizeHTML(plugins[a.id].state["__text"])),
                            question: questionText,
                            feedback: feedbackText,
                            useLetters: ex.correctAnswer === 'Letters',
                            correctAnswer: ex.correctAnswer,
                            showFeedback: ex.showFeedback,
                            type: type,
                            single: !Array.isArray(ex.correctAnswer),
                        };
                        return;
                }
            });
        });
        return out;
    };

    download('moodle.xml', moodleString(Object.values(toLibJson(state))));
}
