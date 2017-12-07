import { CHANGE_GLOBAL_CONFIG, IMPORT_STATE } from '../common/actions';
import { changeProp } from '../common/utils';

export const emptyState = { title: "Ediphy", canvasRatio: 16 / 9, visorNav: { player: true, sidebar: true, keyBindings: true }, trackProgress: true, age: { min: 0, max: 100 }, context: 'school', rights: "Public Domain", keywords: [], typicalLearningTime: { h: 0, m: 0, s: 0 }, version: '1.0.0', thumbnail: '', status: 'draft', structure: 'linear', difficulty: 'easy' };

export default function(state = emptyState, action = {}) {
    switch (action.type) {
    case CHANGE_GLOBAL_CONFIG:
        if(action.payload.prop === 'STATE') {
            return action.payload.value;
        }
        return changeProp(state, action.payload.prop, action.payload.value);
    case IMPORT_STATE:
        return action.payload.present.globalConfig || state;
    default:
        return state;
    }
}
