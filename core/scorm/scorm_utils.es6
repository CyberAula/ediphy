import * as API from './scorm_wrapper';
import Config from './../config';
import {isSection} from './../../utils';


export function init(){
	var result = API.doInitialize();
	var currentStatus = API.doGetValue("cmi.completion_status");
	var bookmark = API.doGetValue("cmi.location");
	if (currentStatus !== 'completed') {
	    currentStatus = "incomplete";
	}

	return {currentStatus: currentStatus, bookmark: bookmark};
}

export function changeInitialScores(){
	var length = API.doGetValue("cmi.objectives._count");
	var scores = [];
	for (var i = 1; i < length; i++){
		var obj = API.doGetValue("cmi.objectives." + i + ".score.raw");
		scores.push(!obj || isNaN(obj) ? 0:parseFloat(obj));
	}
	return scores;
}

export function changeLocation(id) {
	API.doSetValue("cmi.location", id);
	return API.doCommit();
}

export function savePreviousResults(el, navsIds) {
	var num = getPageNum(el, navsIds);
	setScore("objectives." + num + ".", 0, 1, 1, 1, "completed", "passed");
	API.doCommit();
	return {index: num-1 , score: 1};
}

export function setFinalScore(scores) {
	var size = scores.length || 1;
	var num = 0;
	var sum = scores.reduce((a, b) => a + b, 0);
	var avg = sum/size;
	var threshold = API.doGetValue("cmi.completion_threshold");
	var isPassed = avg >= threshold ? "passed":"failed";
	var isComplete = true ? "completed":"incomplete";

	setScore("objectives." + num + ".", 0, size, sum, avg, isComplete, isPassed);
	setScore("", 0, size, sum, avg, isComplete, isPassed);

	return API.doCommit();
}

export function finish(){

	if (!window.terminated) {
	    // API.doSetValue("cmi.success_status", "passed");
	    // API.doSetValue("cmi.completion_status", "completed");
	    API.doTerminate();
	    window.terminated = true;
	}
}

function countScore(id){
	return Config.sections_have_content || (!Config.sections_have_content && !isSection(id));
}

function getPageNum(el, navsIds) {
	var newIds = navsIds.filter(countScore);
	var num = newIds.indexOf(el)+1;
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