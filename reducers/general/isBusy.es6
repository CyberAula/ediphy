import { IMPORT_STATE, SET_BUSY } from '../../common/actions';

export default function isBusy(state = "", action = {}) {
    switch (action.type) {
    case SET_BUSY:
        return action.payload;
    case IMPORT_STATE:
        return /* action.payload.present.isBusy ||*/ state;
    default:
        return state;
    }
}
