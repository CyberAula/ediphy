import React from 'react';
/* eslint-disable react/prop-types */

export function InputText() {
    return {
        getRenderTemplate: function(state, props) {
            let clickHandler = (e)=>{
                props.setAnswer(e.target.value);
            };
            let attempted = props.exercises && props.exercises.attempted;
            let score = (props.exercises.score || 0) + "/" + (props.exercises.weight || 0);
            let correct = this.checkAnswer(props.exercises.currentAnswer, props.exercises.correctAnswer, state);
            let fs = state.fontSize + 'px';
            return <span className={"exercisePlugin inputTextPlugin" + (attempted ? " attempted " : " ") + (correct ? "correct " : "incorrect ") + (props.exercises.showFeedback ? "showFeedback" : "") }>
                <input type={state.type} disabled={attempted} style={{ fontSize: fs, lineHeight: fs }} className="inputText" name={props.id} value={props.exercises.currentAnswer} onChange={clickHandler}/>
                <span className="exerciseScore">{score}</span>
            </span>;
        },
        checkAnswer(current, correct, state) {

            if (state.type === 'text') {
                let answers = (correct && correct.split) ? correct.split("//") : [""];
                let user = current;
                let sanitizedAnswers = answers;
                if (state.characters) {
                    const sanitize = function removeAccents(str) {
                        let accents = 'ÀÁÂÃÄÅàáâãäåßÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž';
                        let accentsOut = "AAAAAAaaaaaaBOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
                        str = str.split('');
                        str.forEach((letter, index) => {
                            let i = accents.indexOf(letter);
                            if (i !== -1) {
                                str[index] = accentsOut[i];
                            }
                        });
                        return str.join('');
                    };
                    sanitizedAnswers = answers.map(an=>{
                        return sanitize((an || "").toLowerCase());
                    });
                    user = sanitize((current || "").toString().toLowerCase());
                }
                if (sanitizedAnswers.indexOf(user) > -1) {
                    return true;
                }
            } else if (state.type === 'number') {
                let user = (current);
                let answer = (correct);
                let precision = (state.precision);
                try {
                    user = parseFloat(current);
                    answer = parseFloat(correct);
                    precision = parseFloat(state.precision);
                    if (isNaN(user) || isNaN(answer) || isNaN(precision)) {
                        return false;
                    }
                } catch(e) {
                    return false;
                }

                if (user <= (answer + precision) && user >= (answer - precision)) {
                    return true;
                }
                return false;
            }
            return false;

            // return (current) === (correct);
        },
    };
}
/* eslint-enable react/prop-types */
