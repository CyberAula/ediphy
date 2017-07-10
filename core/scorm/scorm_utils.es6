import * as API from './scorm_wrapper';

export function changeLocation(id) {
	API.doSetValue("cmi.location", id);
	return API.doCommit();
}

export function init(){
	var result = API.doInitialize();
	var currentStatus = API.doGetValue("cmi.completion_status");
	var bookmark = API.doGetValue("cmi.location");
	if (currentStatus !== 'completed') {
	    currentStatus = "incomplete";
	    API.doSetValue("cmi.completion_status", "incomplete");
	    API.doSetValue("cmi.score.scaled", 1);
	    API.doSetValue("cmi.score.raw", 10);
	    API.doSetValue("cmi.score.min", 0);
	    API.doSetValue("cmi.score.max", 10);
	}

	return {currentStatus: currentStatus, bookmark: bookmark};
}

export function finish(){

	if (!window.terminated) {
	    API.doSetValue("cmi.success_status", "passed");
	    API.doSetValue("cmi.completion_status", "completed");
	    API.doTerminate();
	    window.terminated = true;
	}
}