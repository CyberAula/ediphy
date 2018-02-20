import * as API from './scorm_wrapper';
import Config from '../config';
import { isSection } from '../../common/utils';

export function init() {
    let result = API.doInitialize();
    let currentStatus = API.doGetValue("cmi.completion_status");
    let bookmark = API.doGetValue("cmi.location");
    if (currentStatus !== 'completed') {
        currentStatus = "incomplete";
    }

    return { currentStatus: currentStatus, bookmark: bookmark };
}

export function changeInitialState() {
    let length = API.doGetValue("cmi.objectives._count");
    let scores = [];
    let visited = [];
    for (let i = 1; i < length; i++) {
        let obj = API.doGetValue("cmi.objectives." + i + ".score.raw");
        let comp = API.doGetValue("cmi.objectives." + i + ".completion_status");
        scores.push(!obj || isNaN(obj) ? 0 : parseFloat(obj));
        visited.push(comp);
    }
    return { scores: scores, visited: visited };
}

export function changeLocation(id) {
    API.doSetValue("cmi.location", id);
    return API.doCommit();
}

export function savePreviousResults(el, navsIds, trackProgress) {
    let num = getPageNum(el, navsIds);
    if (trackProgress) {
        setScore("objectives." + num + ".", 0, 0, 0, 0, "completed", "passed");
    } else {
        setScore("objectives." + num + ".", 0, 1, 1, 1, "completed", "passed");
    }

    API.doCommit();
    return { index: num - 1, score: 1, visited: "completed" };
}

export function setFinalScore(scores, visited, trackProgress) {
    let sizeSc = scores.length || 1;
    let sizeV = visited.length || 1;
    let num = 0;
    let sumSc = scores.reduce((a, b) => a + b, 0);
    let sumV = visited.reduce((a, b) => a + (b === "completed" ? 1 : 0), 0);
    let avgSc = sumSc / sizeSc;
    let avgV = sumV / sizeV;
    let thresholdSc = API.doGetValue("cmi.scaled_passing_score") || 0.8;
    let thresholdV = API.doGetValue("cmi.completion_threshold") || 0.8;
    let isPassed = true;
    let isComplete = true;
    if (trackProgress) {
        /* Course is passed when more pages than threshold are viewed*/
        let completed = avgV >= thresholdV;
        isPassed = completed ? "passed" : "failed";
        isComplete = completed ? "completed" : "incomplete";
        setScore("objectives." + num + ".", 0, sizeV, sumV, avgV, isComplete, isPassed);
        setScore("", 0, sizeV, sumV, avgV, isComplete, isPassed);
    } else {
        /* Course is passed when the total score is greater than the threshold*/
        isPassed = avgSc >= thresholdSc ? "passed" : "failed";
        isComplete = avgV >= thresholdV ? "completed" : "incomplete";
        setScore("objectives." + num + ".", 0, sizeSc, sumSc, avgSc, isComplete, isPassed);
        setScore("", 0, sizeSc, sumSc, avgSc, isComplete, isPassed);
    }
    return API.doCommit();
}

export function setSCORMScore(score, maxScore, visited) {
    let sizeV = visited.length || 1;
    let num = 0;
    let sumV = visited.reduce((a, b) => a + (b === "completed" ? 1 : 0), 0);
    let avgV = sumV / sizeV;
    let thresholdSc = API.doGetValue("cmi.scaled_passing_score") || 0.5;
    let thresholdV = API.doGetValue("cmi.completion_threshold") || 0.5;
    let isPassed = true;
    let isComplete = true;
    /* Course is passed when the total score is greater than the threshold*/
    isPassed = score / maxScore >= thresholdSc ? "passed" : "failed";
    isComplete = avgV >= thresholdV ? "completed" : "incomplete";
    setScore("objectives." + num + ".", 0, maxScore, score, score / maxScore, isComplete, isPassed);
    setScore("", 0, maxScore, score, score / maxScore, isComplete, isPassed);
    console.log(maxScore, score, score / maxScore);
    return API.doCommit();
}

export function finish() {

    // if (!window.terminated) {
    // API.doSetValue("cmi.success_status", "passed");
    // API.doSetValue("cmi.completion_status", "completed");
    // set exit to suspend
    API.doSetValue("cmi.exit", "suspend");
    // API.doSetValue("cmi.exit", "");
    // issue a suspendAll navigation request
    // API.doSetValue("adl.nav.request", "exitAll");
    // API.doSetValue("adl.nav.request", "suspendAll");
    API.doTerminate();
    window.terminated = true;
    // }
}

function countScore(id) {
    return Config.sections_have_content || (!Config.sections_have_content && !isSection(id));
}

function getPageNum(el, navsIds) {
    let newIds = navsIds.filter(countScore);
    let num = newIds.indexOf(el) + 1;
    return num;
}

function setScore(who, min, max, raw, scaled, completion_status, success_status) {
    API.doSetValue("cmi." + who + "score.scaled", scaled);
    API.doSetValue("cmi." + who + "score.min", min);
    API.doSetValue("cmi." + who + "score.max", max);
    API.doSetValue("cmi." + who + "score.raw", raw);
    API.doSetValue("cmi." + who + "completion_status", completion_status);
    API.doSetValue("cmi." + who + "success_status", success_status);
}
