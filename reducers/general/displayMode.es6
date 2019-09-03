import { IMPORT_STATE } from '../../common/actions';

export default function changeDisplayMode(state = "", action = {}) {
    switch (action.type) {
    case IMPORT_STATE:
        return action.payload.present.displayMode || state;
    default:
        return state;
    }
}
