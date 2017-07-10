import * as API from './scorm_wrapper';

export function changeLocation(id) {
	API.doSetValue("cmi.location", id);
	return API.doCommit();
}