import { CHANGE_STYLE_CONFIG } from '../../common/actions';
import { changeProp } from '../../common/utils';

export default function(state = { theme: 'default', font: 'Ubuntu', color: '#17CFC8' }, action = {}) {
    switch (action.type) {
    case CHANGE_STYLE_CONFIG:
        if(action.payload.prop === 'STATE') {
            return action.payload.value;
        }
        return changeProp(state, action.payload.prop, action.payload.value);
    default:
        return state;
    }
}
