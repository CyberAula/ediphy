import { testState } from '../../core/store/state.tests.js';
import global_config from '../global_config';
import * as ActionTypes from '../../common/actions';

const state = {
    "title": "Ediphy",
    "canvasRatio": 1.7777777777777777,
    "visorNav": {
        "player": true,
        "sidebar": true,
        "keyBindings": true,
    },
    "trackProgress": true,
    "age": {
        "min": 0,
        "max": 100,
    },
    "context": "school",
    "rights": "public",
    "keywords": [],
    "typicalLearningTime": {
        "h": 0,
        "m": 0,
        "s": 0,
    },
    "version": "1.0.0",
    "thumbnail": "",
    "status": "draft",
    "structure": "linear",
    "difficulty": "easy",
};

describe('# global_config reducer', ()=>{
    describe('DEFAULT', ()=>{
        test('Should return test.state as default', () => {
            expect(global_config(state, {})).toEqual(state);
        });
    });
    describe('handle CHANGE_GLOBAL_CONFIG', ()=> {
        test('Change the all Global config when save', () => {
            const newstate = { title: "Ediphy", canvasRatio: 16 / 9, visorNav: { player: true, sidebar: true, keyBindings: true }, trackProgress: true, age: { min: 0, max: 100 }, context: 'school', rights: "public", keywords: [], typicalLearningTime: { h: 0, m: 0, s: 0 }, version: '1.0.0', thumbnail: '', status: 'draft', structure: 'linear', difficulty: 'easy' };
            const action = {
                type: ActionTypes.CHANGE_GLOBAL_CONFIG,
                payload: { prop: 'STATE', value: newstate },
            };
            expect(global_config(state, action)).toEqual(newstate);
        });

        test('Change specific(s) prop in Global config when save', () => {
            const action = {
                type: ActionTypes.CHANGE_GLOBAL_CONFIG,
                payload: { prop: 'title', value: 'Changed title' },
            };
            const newstate = { title: "Changed title", canvasRatio: 16 / 9, visorNav: { player: true, sidebar: true, keyBindings: true }, trackProgress: true, age: { min: 0, max: 100 }, context: 'school', rights: "public", keywords: [], typicalLearningTime: { h: 0, m: 0, s: 0 }, version: '1.0.0', thumbnail: '', status: 'draft', structure: 'linear', difficulty: 'easy' };
            expect(global_config(state, action)).toEqual(newstate);
        });
    });
    describe('handle IMPORT_STATE', ()=> {

        test('Import global config from test.state', () => {
            const action = { type: ActionTypes.IMPORT_STATE, payload: { present: { globalConfig: state } } };
            expect(global_config(state, action)).toEqual(state);
        });
        test('Import empty default state', () => {
            const action = { type: ActionTypes.IMPORT_STATE, payload: { present: { } } };
            expect(global_config(undefined, action)).toEqual(state);
        });
    });
});

