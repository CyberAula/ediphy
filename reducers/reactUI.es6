import { UPDATE_UI } from '../common/actions';
import { changeProp } from '../common/utils';
import { defaultUI } from '../common/constants';

export default function(state = { ...defaultUI }, action = {}) {
    switch (action.type) {
    case UPDATE_UI:
        if(action.payload.prop === 'STATE') {
            return action.payload.value;
        }
        if(typeof action.payload.prop === 'object' && action.payload.prop !== null) {
            let temp = { ...state };
            Object.keys(action.payload.prop).map((key) => {
                temp = changeProp(temp, key, action.payload.prop[key]);
            });
            return temp;
        }
        return changeProp(state, action.payload.prop, action.payload.value);

    default:
        return state;
    }
}
