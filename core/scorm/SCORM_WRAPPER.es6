import API from './SCORM_API.js';

let scorm;

export function init(debug = true, windowDebug = false) {
    scorm = new API({ debug: debug, windowDebug: windowDebug, exit_type: "" });
    scorm.initialize();
    scorm.debug("Connected: " + scorm.API.isActive, 4);
    scorm.setvalue("cmi.mode", "normal");
    return scorm;
}

export function getInitialState(exerciseObj, exerciseNums, numPages, suspendDataCalculated) {
    let currentStatus = scorm.getvalue('cmi.completion_status');
    let isPassed = scorm.getvalue('cmi.success_status');
    let bookmark = scorm.getvalue('cmi.location');

    if (currentStatus !== 'completed') {
        currentStatus = "incomplete";
    }
    let userProfile = getUserProfile();
    let userName = userProfile ? userProfile.name : "Anonymous";
    let { exercises, totalScore, suspendData, completionProgress } = changeInitialState(exerciseObj, exerciseNums, numPages, suspendDataCalculated);
    return { currentStatus, bookmark, userName, isPassed, userProfile, exercises, totalScore, suspendData, completionProgress };
}

export function getAPIInstance() {
    if((typeof scorm !== "undefined") && (typeof scorm.API !== "undefined") && (scorm.API.isActive)) {
        return scorm.API;
    }
    return undefined;
}

export function isConnected() {
    if (typeof getAPIInstance() === "undefined") {
        return false;
    }
    return scorm.API.isActive;
}

export function getUserProfile() {
    let user = {};
    if(isConnected()) {
        user.name = scorm.getvalue('cmi.learner_name') || "Anonymous";
        user.id = scorm.getvalue('cmi.learner_id');
        user.learner_preference = {};
        let learnerPreferenceChildren = scorm.getvalue('cmi.learner_preference._children');
        if(learnerPreferenceChildren !== 'false') {
            let learnerPreferences = learnerPreferenceChildren.split(",");
            for(let i = 0; i < learnerPreferences.length; i++) {
                if((typeof learnerPreferences[i] === "string") && (learnerPreferences[i].length > 0)) {
                    user.learner_preference[learnerPreferences[i]] = scorm.getvalue('cmi.learner_preference.' + learnerPreferences[i]);
                }
            }
        }
    }
    return user;
}

/**
 * Assign a number to each exercise
 * @param exercises
 * @returns {Array} An array where each position is an object containing the page and the box which that index represents
 */

export function getExerciseNumsAndAnswers(initData) {
    let exNums = [];
    let exercises = [];
    let pages = [];
    Object.keys(initData).map((page)=>{
        Object.keys(initData[page].exercises).map((box)=>{
            exNums.push({ page, box });
            let boxObj = initData[page].exercises[box];
            exercises.push({ a: boxObj.defaultCorrectAnswer, s: 0, c: "incomplete" });
        });
        pages.push(false);
    });
    return { exNums, exercises, pages };
}

/**
 * Retrieve state saved by SCORM and apply it to EDiphy's model
 * @param exercises
 * @param nums
 * @returns {{exercises, totalScore: number}}
 */
export function changeInitialState(exercises, nums, numPages, suspendDataCalculated) {
    let exLength = nums.length;
    let updatedExercises = JSON.parse(JSON.stringify(exercises));

    let suspendData = scorm.getvalue("cmi.suspend_data");
    try {
        suspendData = JSON.parse(suspendData);

        if (!suspendData || !(suspendData instanceof Object) || !suspendData.exercises || !suspendData.pages) {
            suspendData = suspendDataCalculated;
        }
    } catch (e) {
        suspendData = suspendDataCalculated;
    }

    for (let i = 0; i < exLength; i++) {
        let obj = suspendData.exercises[i].s;
        let comp = suspendData.exercises[i].c;
        updatedExercises[nums[i].page].exercises[nums[i].box].attempted = (comp === "completed");
        updatedExercises[nums[i].page].exercises[nums[i].box].num = (i + 1);
        if (comp === "completed") {
            if (suspendData && suspendData.exercises && suspendData.exercises.length > i) {
                updatedExercises[nums[i].page].exercises[nums[i].box].currentAnswer = suspendData.exercises[i].a;
            }
            updatedExercises[nums[i].page].exercises[nums[i].box].score = obj;
        }

    }

    let totalScore = 0;
    let completionProgress = 0;
    let i = 0;
    for (let p in updatedExercises) {
        let attempted = false;
        let pageScore = 0;
        let page = updatedExercises[p];
        let totalExWeight = 0;
        for (let ex in page.exercises) {
            let box = page.exercises[ex];
            attempted = box.attempted;
            if(box.weight !== 0) {
                pageScore += parseFloat(box.score);
            }
            totalExWeight += box.weight;
        }
        if (totalExWeight === 0 && attempted) {
            pageScore = 1;
        }
        pageScore = pageScore / (totalExWeight || 1);
        page.visited = suspendData.pages[i];
        if (page.visited) {
            if (Object.keys(page.exercises).length === 0) {
                pageScore = 1;
                attempted = true;
            }
        }
        page.attempted = attempted;
        page.score = pageScore;
        completionProgress += attempted ? 1 : 0;
        totalScore += page.score * page.weight;
        i++;
    }
    completionProgress = completionProgress / (numPages || 1);
    completionProgress = parseFloat(completionProgress.toFixed(2));
    totalScore = parseFloat(totalScore.toFixed(2));
    commit();
    return { exercises: updatedExercises, totalScore, suspendData, completionProgress };
}

export function commit() {
    return scorm.commit();
}

export function changeLocation(id) {
    scorm.setvalue("cmi.location", id);
    return commit();
}

export function setSCORMScore(score, maxScore, completionProgress, suspendData) {
    let thresholdSc = scorm.getvalue("cmi.scaled_passing_score") || 0.5;
    let thresholdV = scorm.getvalue("cmi.completion_threshold") || 0.5;
    thresholdSc = (thresholdSc > 1 ? (thresholdSc / 100) : thresholdSc);
    thresholdV = thresholdV && !isNaN(parseFloat(thresholdV)) ? thresholdV : 0.5;
    let isPassed = true;
    let isComplete = true;
    /* Course is passed when the total score is greater than the threshold*/

    isPassed = ((score / maxScore) >= thresholdSc) ? "passed" : "failed";
    isComplete = completionProgress >= thresholdV ? "completed" : "incomplete";
    let scoreRounded = parseFloat(parseFloat(score).toFixed(2));
    let scoreScaled = parseFloat((score / maxScore).toFixed(2));
    setScore(0, maxScore, scoreRounded, scoreScaled, isComplete, isPassed);
    scorm.setvalue("cmi.suspend_data", JSON.stringify(suspendData));
    return commit();
}

export function savePageProgress(suspendData, completionProgress) {
    let thresholdV = scorm.getvalue("cmi.completion_threshold") || 0.5;
    thresholdV = thresholdV && !isNaN(parseFloat(thresholdV)) ? thresholdV : 0.5;
    let isComplete = completionProgress >= thresholdV ? "completed" : "incomplete";
    scorm.setvalue("cmi.mode", "normal");
    scorm.setvalue("cmi.suspend_data", JSON.stringify(suspendData));
    scorm.setvalue("cmi.completion_status", isComplete);
    return commit();
}

export function finish() {
    scorm.setvalue("cmi.exit", "suspend");
    scorm.terminate();
    window.terminated = true;
}

function setScore(min, max, raw, scaled, completion_status, success_status) {
    let currentStatus = scorm.getvalue('cmi.completion_status');
    // FIX to let SCORM 1.2 update score on reload after completed status
    if (currentStatus === "completed" && scorm.API.version === "1.2") {
        scorm.API.mode = "normal";
    }
    let ratio = max / 100;
    scorm.setvalue("cmi.mode", "normal");
    scorm.setvalue("cmi.score.scaled", scaled);
    scorm.setvalue("cmi.score.min", min / ratio);
    scorm.setvalue("cmi.score.max", max / ratio);
    /* if(scorm.API.version === "1.2" && max > 100) {
        raw = parseFloat(parseFloat(scaled * 100).toFixed(0));
    }*/
    scorm.setvalue("cmi.score.raw", raw / ratio);
    scorm.setvalue("cmi.success_status", success_status);
    scorm.setvalue("cmi.completion_status", completion_status);
    return commit();
}
