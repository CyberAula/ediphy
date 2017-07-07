import {CHANGE_GLOBAL_CONFIG} from './../actions';
import {changeProp} from './../utils';


export default function (state = 0, action = {}) {
    switch (action.type) {
        case CHANGE_GLOBAL_CONFIG:
            return changeProp(state, action.payload.prop, action.payload.value);
        default:
            return state;
    }
}