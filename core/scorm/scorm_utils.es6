import * as API from './scorm_wrapper';
import Config from '../config';
import { isSection } from '../../common/utils';

export function init() {
    let result = API.doInitialize();
    let currentStatus = API.doGetValue("cmi.completion_status");
    let isPassed = API.doGetValue("cmi.success_status");

    let bookmark = API.doGetValue("cmi.location");
    if (currentStatus !== 'completed') {
        currentStatus = "incomplete";
    }
    let totalScore = API.doGetValue("cmi.score.raw") || 0;
    let userName = API.doGetValue("cmi.learner_name") || "Anonymous";
    return { currentStatus, bookmark, totalScore, userName, isPassed };
}

/**
 * Assign a number to each exercise
 * @param exercises
 * @returns {Array} An array where each position is an object containing the page and the box which that index represents
 */
export function getExerciseNums(exercises) {
    let list = [];
    Object.keys(exercises).map((page, pageIndex)=>{
        Object.keys(exercises[page].exercises).map((box, index)=>{
            list.push({ page, box });
        });

    });
    console.log(list);
    return list;
}

/**
 * Retrieve state saved by SCORM and apply it to EDiphy's model
 * @param exercises
 * @param nums
 * @returns {{exercises, totalScore: number}}
 */
export function changeInitialState(exercises, nums) {
    let length = nums.length; // API.doGetValue("cmi.objectives._count");
    let updatedExercises = JSON.parse(JSON.stringify(exercises));
    API.doSetValue("cmi.objectives." + (0) + ".id", 0);
    API.doSetValue("cmi.interactions." + (0) + ".id", 0);
    for (let i = 0; i < length; i++) {

        let id = API.doSetValue("cmi.objectives." + (i + 1) + ".id", i + 1);
        let interaction = API.doSetValue("cmi.interactions." + (i + 1) + ".id", i + 1);
        let type = API.doSetValue("cmi.interactions." + (i + 1) + ".type", "other");
        let obj = API.doGetValue("cmi.objectives." + (i + 1) + ".score.raw");
        let comp = API.doGetValue("cmi.objectives." + (i + 1) + ".completion_status");
        // let ans = API.doGetValue("cmi.objectives." + (i + 1) + ".description");
        let ans = API.doGetValue("cmi.interactions." + (i + 1) + ".learner_response");
        console.log(i, nums[i], updatedExercises[nums[i].page].exercises[nums[i].box]);
        updatedExercises[nums[i].page].exercises[nums[i].box].attempted = (comp === "completed");
        updatedExercises[nums[i].page].exercises[nums[i].box].num = (i + 1);
        if (comp === "completed") {
            updatedExercises[nums[i].page].exercises[nums[i].box].score = obj;
            updatedExercises[nums[i].page].exercises[nums[i].box].currentAnswer = JSON.parse(ans);
        }
        console.log("GETTING SCORE FOR EXERCISE ", nums[i].box, i + 1, obj, comp);

        console.log(updatedExercises[nums[i].page].exercises[nums[i].box]);
    }

    let totalScore = 0;

    for (let p in updatedExercises) {
        let attempted = false;
        let pageScore = 0;
        let page = updatedExercises[p];
        let totalExWeight = 0;
        for (let ex in page.exercises) {
            let box = page.exercises[ex];
            attempted = box.attempted;
            pageScore += parseFloat(box.score * box.weight);
            totalExWeight += box.weight;
        }
        pageScore = pageScore / (totalExWeight || 1);
        console.log("Total score for page " + p + ": " + pageScore);
        page.attempted = attempted;
        page.score = pageScore;
        totalScore += page.score * page.weight;
    }
    console.log(updatedExercises);
    console.log("RETRIEVED TOTAL SCORE " + totalScore);
    API.doCommit();
    return { exercises: updatedExercises, totalScore: parseFloat(totalScore.toFixed(2)) };
}

export function changeLocation(id) {
    API.doSetValue("cmi.location", id);
    return API.doCommit();
}

export function setSCORMScore(score, maxScore, attemptedPages) {
    let num = 0;
    let thresholdSc = API.doGetValue("cmi.scaled_passing_score") || 0.5;
    let thresholdV = API.doGetValue("cmi.completion_threshold") || 0.5;
    let isPassed = true;
    let isComplete = true;
    /* Course is passed when the total score is greater than the threshold*/
    console.log("attemptedPages", attemptedPages);
    isPassed = (score / maxScore) >= thresholdSc ? "passed" : "failed";
    isComplete = attemptedPages >= thresholdV ? "completed" : "incomplete";
    let scoreRounded = parseFloat(score.toFixed(2));
    let scoreScaled = parseFloat((score / maxScore).toFixed(2));
    setScore("objectives." + num + ".", 0, maxScore, scoreRounded, scoreScaled, isComplete, isPassed);
    setScore("", 0, maxScore, scoreRounded, scoreScaled, isComplete, isPassed);
    console.log("SETTING SCORE total ", scoreRounded, maxScore, attemptedPages);
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

function setScore(who, min, max, raw, scaled, completion_status, success_status) {
    API.doSetValue("cmi." + who + "score.scaled", scaled);
    API.doSetValue("cmi." + who + "score.min", min);
    API.doSetValue("cmi." + who + "score.max", max);
    API.doSetValue("cmi." + who + "score.raw", raw);
    API.doSetValue("cmi." + who + "completion_status", completion_status);
    API.doSetValue("cmi." + who + "success_status", success_status);
    console.log("SETTING SCORE GLOBAL", scaled, raw, completion_status, success_status);
    return API.doCommit();
}

export function setExerciseScore(who, score, answer) {
    API.doSetValue("cmi.objectives." + who + ".score.raw", score);
    API.doSetValue("cmi.objectives." + who + ".completion_status", "completed");
    // API.doSetValue("cmi.objectives." + who + ".description", JSON.stringify(answer));
    API.doSetValue("cmi.interactions." + who + ".learner_response", JSON.stringify(answer));
    console.log("SETTING SCORE FOR EXERCISE ", who, score, answer);
    console.log('DONE');
    return API.doCommit();

}

