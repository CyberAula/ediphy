import API from './SCORM_API.js';

let scorm;

export function init(debug = true, windowDebug = false) {
    scorm = new API({ debug: debug, windowDebug: windowDebug, exit_type: "" });
    scorm.initialize();
    scorm.debug("Connected: " + scorm.API.isActive, 4);
    return scorm;
}

export function getInitialState() {
    let currentStatus = scorm.getvalue('cmi.completion_status');
    let isPassed = scorm.getvalue('cmi.success_status');

    let bookmark = scorm.getvalue('cmi.location');

    if (currentStatus !== 'completed') {
        currentStatus = "incomplete";
    }
    let totalScore = parseFloat(scorm.getvalue("cmi.score.raw") || 0);
    console.log(totalScore);
    let userProfile = getUserProfile();
    console.log(userProfile);
    let userName = userProfile ? userProfile.name : "Anonymous";
    return { currentStatus, bookmark, totalScore, userName, isPassed, userProfile };
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
        console.log(scorm.getvalue('cmi.learner_name'));
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
export function getExerciseNums(exercises) {
    let list = [];
    Object.keys(exercises).map((page, pageIndex)=>{
        Object.keys(exercises[page].exercises).map((box, index)=>{
            list.push({ page, box });
        });

    });
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
    scorm.setvalue("cmi.objectives." + 0 + ".id", 0);
    scorm.setvalue("cmi.interactions." + 0 + ".id", 0);
    scorm.setvalue("cmi.interactions." + 0 + ".type", "performance");

    for (let i = 0; i < length; i++) {

        let id = scorm.setvalue("cmi.objectives." + (i + 1) + ".id", i + 1);
        let interaction = scorm.setvalue("cmi.interactions." + (i + 1) + ".id", i + 1);
        let type = scorm.setvalue("cmi.interactions." + (i + 1) + ".type", "performance");
        let obj = scorm.getvalue("cmi.objectives." + (i + 1) + ".score.raw");
        let comp = scorm.getvalue("cmi.objectives." + (i + 1) + ".completion_status");
        let ans = scorm.getvalue("cmi.interactions." + (i + 1) + ".learner_response");

        updatedExercises[nums[i].page].exercises[nums[i].box].attempted = (comp === "completed");
        updatedExercises[nums[i].page].exercises[nums[i].box].num = (i + 1);
        if (comp === "completed") {
            updatedExercises[nums[i].page].exercises[nums[i].box].score = obj;
            updatedExercises[nums[i].page].exercises[nums[i].box].currentAnswer = JSON.parse(ans);
        }

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

        page.attempted = attempted;
        page.score = pageScore;
        totalScore += page.score * page.weight;
    }

    commit();
    console.log(updatedExercises, totalScore);
    return { exercises: updatedExercises, totalScore: parseFloat(totalScore.toFixed(2)) };
}

export function commit() {
    return scorm.commit();
}

export function changeLocation(id) {
    scorm.setvalue("cmi.location", id);
    return commit();
}

export function setSCORMScore(score, maxScore, attemptedPages) {
    let num = 0;
    let thresholdSc = scorm.getvalue("cmi.scaled_passing_score") || 0.5;
    let thresholdV = scorm.getvalue("cmi.completion_threshold") || 0.5;
    thresholdSc = (thresholdSc > 1 ? (thresholdSc / 100) : thresholdSc);
    thresholdV = thresholdV && !isNaN(parseFloat(thresholdV)) ? thresholdV : 0.5;
    let isPassed = true;
    let isComplete = true;
    /* Course is passed when the total score is greater than the threshold*/

    isPassed = ((score / maxScore) >= thresholdSc) ? "passed" : "failed";
    isComplete = attemptedPages >= thresholdV ? "completed" : "incomplete";
    console.log(thresholdSc, thresholdV, attemptedPages, score, maxScore, isPassed, isComplete);
    let scoreRounded = parseFloat(score.toFixed(2));
    let scoreScaled = parseFloat((score / maxScore).toFixed(2));
    setScore("objectives." + num + ".", 0, maxScore, scoreRounded, scoreScaled, isComplete, isPassed);
    setScore("", 0, maxScore, scoreRounded, scoreScaled, isComplete, isPassed);

    return commit();
}

export function finish() {

    scorm.setvalue("cmi.exit", "suspend");
    scorm.terminate();
    window.terminated = true;
    // }
}

function setScore(who, min, max, raw, scaled, completion_status, success_status) {
    scorm.setvalue("cmi." + who + "score.scaled", scaled);
    scorm.setvalue("cmi." + who + "score.min", min);
    scorm.setvalue("cmi." + who + "score.max", max);
    scorm.setvalue("cmi." + who + "score.raw", raw);
    scorm.setvalue("cmi." + who + "success_status", success_status);
    scorm.setvalue("cmi." + who + "completion_status", completion_status);

    return commit();
}

export function setExerciseScore(who, score, answer) {
    scorm.setvalue("cmi.objectives." + who + ".score.raw", score);
    scorm.setvalue("cmi.objectives." + who + ".completion_status", "completed");
    // API.doSetValue("cmi.objectives." + who + ".description", JSON.stringify(answer));
    scorm.setvalue("cmi.interactions." + who + ".learner_response", JSON.stringify(answer));

    return commit();

}

