import { arrayContainsArray } from '../../common/utils';

export function correctLiterally(current, correct) {
    return (JSON.stringify(current) === JSON.stringify(correct)) ? 1 : 0;
}

export function correctArrayUnordered(current, correct, allowPartial, totalPossibleAnswers) {
    if (!current && correct && correct.length === 0) {
        return 1;
    }
    let correctSanitized = correct.filter((c)=>{
        return (c < totalPossibleAnswers);
    });
    if (allowPartial) {
        let score = 0;
        if (Array.isArray(current) && Array.isArray(correctSanitized)) {
            for (let i = 0; i < totalPossibleAnswers; i++) {
                let isCorrect = correctSanitized.indexOf(i) === -1 && current.indexOf(i) === -1;
                isCorrect = isCorrect || (correctSanitized.indexOf(i) > -1 && current.indexOf(i) > -1);
                score = score + (isCorrect ? 1 : 0);
            }
            return score / (totalPossibleAnswers || 1);
        }
    } else if (Array.isArray(current) && Array.isArray(correctSanitized)) {
        return (arrayContainsArray(correctSanitized, current) && (current.length === correctSanitized.length)) || (current.length === 0 && correctSanitized.length === 0);
    }

    return 0;
}

export function correctArrayOrdered(current, correct, totalAnswers, allowPartial = false) {
    let total = Math.min(totalAnswers || 1, correct ? correct.length : 1);
    let score = 0;
    for (let q in current) {
        if (current[q] === correct[q]) {
            score += 1;
        }
    }
    let finalScore = (score / total);
    return (!allowPartial && finalScore < 1) ? 0 : finalScore;
}

export function compareNumbersLiterally(current, correct) {
    if (!isNaN(current)) {
        return ((current) === (correct)) ? 1 : 0;
    }
    return 0;
}

export function correctNumericInput(current, correct, tol = 0) {
    let user = (current);
    let answer = (correct);
    let precision = (tol);
    try {
        user = parseFloat(user);
        answer = parseFloat(answer);
        precision = parseFloat(precision);
        if (isNaN(user) || isNaN(answer) || isNaN(precision)) {
            return 0;
        }
    } catch(e) {
        return 0;
    }

    if (user <= (answer + precision) && user >= (answer - precision)) {
        return 1;
    }
    return 0;
}

function sanitize(str) {
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
}

export function correctTextInput(current, correct, strictCorrection) {
    let answers = (correct && correct.split) ? correct.split("//") : [""];
    let user = current;
    let sanitizedAnswers = answers;
    if (!strictCorrection) {

        sanitizedAnswers = answers.map(an=>{
            return sanitize((an || "").toLowerCase());
        });
        user = sanitize((current || "").toString().toLowerCase());
    }
    if (sanitizedAnswers.indexOf(user) > -1) {
        return 1;
    }
    return 0;
}

export function correctLongAnswer(current, correct, strictCorrection, limit = 100) {
    if (correct && correct.length > limit) {
        return (current && current.length && current.length > 0) ? 1 : 0;
    }
    if (strictCorrection) {
        if (((current || "").toString()) === ((correct || "").toString())) {
            return 1;
        }
    } else if (sanitize((current || "").toString().toLowerCase()) === sanitize((correct || "").toString().toLowerCase())) {
        return 1;
    }

    return 0;
}
