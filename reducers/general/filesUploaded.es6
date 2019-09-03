import { DELETE_FILE, IMPORT_EDI, IMPORT_STATE, UPLOAD_FILE } from '../../common/actions';

export default function filesUploaded(state = {}, action = {}) {
    switch(action.type) {
    case UPLOAD_FILE:
        return { ...state, [action.payload.id]: { ...action.payload } };
    case DELETE_FILE:
        return Object.keys(state)
            .filter(key => key !== action.payload.id)
            .reduce((result, current) => {
                result[current] = state[current];
                return result;
            }, {});
    case IMPORT_STATE:
        return action.payload.present.filesUploaded || state;
    case IMPORT_EDI:
        return { ...state, ...action.payload.state.filesUploaded };
    default:
        return state;
    }
}
