import { testState } from '../../core/store/state.tests.js';
import { emptyState } from '../../core/store/state.empty.js';
import global_config from '../global_config';
import * as ActionTypes from '../../common/actions';
import { changeProp } from '../../common/utils';

const initstate = testState;

describe('# global_config reducer', ()=>{

    test('Should return emptyState as default', () => {
        const state = initstate.present.globalConfig;
        expect(global_config(state, {})).toEqual(state);
    });

    test('Change the all Global config when save', () => {
        const state = initstate.present.globalConfig;
        const action = { type: ActionTypes.CHANGE_GLOBAL_CONFIG, payload: { prop: 'STATE', value: initstate.present.globalConfig } };
        expect(global_config(state, action)).toEqual(initstate.present.globalConfig);
    });
    test('Change specific prop in Global config', () => {
        const action = { type: ActionTypes.CHANGE_GLOBAL_CONFIG, payload: { prop: 'title', value: 'Título' } };
        expect(global_config(initstate, action)).toEqual(changeProp(initstate, action.payload.prop, action.payload.value));
    });
    test('Import global config present state', () => {
        const state = initstate.present.globalConfig;
        const action = { type: ActionTypes.IMPORT_STATE, payload: { present: { globalConfig: state } } };
        expect(global_config(state, action)).toEqual(state);
    });
    test('Import empty default state', () => {
        const state = emptyState().present.globalConfig;
        const action = { type: ActionTypes.IMPORT_STATE, payload: { present: { globalConfig: state } } };
        expect(global_config(state, action)).toEqual(state);
    });
});

