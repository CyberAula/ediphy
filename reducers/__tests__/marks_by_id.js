import { testState } from '../../core/store/state.tests.js';
import marks_by_id from '../marks_by_id';
import * as ActionTypes from '../../common/actions';
import { ADD_RICH_MARK } from "../../common/actions";

const state = testState.present.marksById;

// console.log(state);

describe('# marks_by_id reducer', ()=>{

    describe('DEFAULT', ()=>{
        test('Should return test.state as default', () => {
            expect(marks_by_id(state, {})).toEqual(state);
        });
    });

    describe('handle ADD_RICH_MARK', ()=>{
        test('If rich mark added', () => {
            const action = {
                type: ActionTypes.ADD_RICH_MARK,
                payload: {
                    parent: 'bo-1511252970033',
                    state: {},
                    mark: { id: "rm-1511252975055",
                        title: "new mark",
                        connectMode: "existing",
                        connection: "pa-1511252955865",
                        displayMode: "navigate",
                        value: "30.95,49.15",
                        color: "#222222",
                    },
                    oldConnection: 'cv-1511252975055',
                    newConnection: 'pa-1511252955865',
                },
            };
            // expect(plugin_toolbars_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle DELETE_BOX', ()=>{
        test('If box deleted', () => {
            const action = {
                type: ActionTypes.DELETE_BOX,
                payload: {
                    parent: 'bo-1511252970033',
                    state: {},
                    mark: { id: "rm-1511252975055",
                        title: "new mark",
                        connectMode: "existing",
                        connection: "pa-1511252955865",
                        displayMode: "navigate",
                        value: "30.95,49.15",
                        color: "#222222",
                    },
                    oldConnection: 'cv-1511252975055',
                    newConnection: 'pa-1511252955865',
                },
            };
            // expect(plugin_toolbars_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle DELETE_CONTAINED_VIEW', ()=>{
        test('If contained view deleted', () => {
            const action = {
                type: ActionTypes.DELETE_CONTAINED_VIEW,
                payload: {
                    parent: 'bo-1511252970033',
                    state: {},
                    mark: { id: "rm-1511252975055",
                        title: "new mark",
                        connectMode: "existing",
                        connection: "pa-1511252955865",
                        displayMode: "navigate",
                        value: "30.95,49.15",
                        color: "#222222",
                    },
                    oldConnection: 'cv-1511252975055',
                    newConnection: 'pa-1511252955865',
                },
            };
            // expect(plugin_toolbars_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle DUPLICATE_BOX', ()=>{
        test('If duplicated box', () => {
            const action = {
                type: ActionTypes.DUPLICATE_BOX,
                payload: {

                },
            };
            // expect(plugin_toolbars_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle EDIT_RICH_MARK', ()=>{
        test('If rich mark edited', () => {
            const action = {
                type: ActionTypes.EDIT_RICH_MARK,
                payload: {

                },
            };
            // expect(plugin_toolbars_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle DELETE_RICH_MARK', ()=>{
        test('If rich mark deleted', () => {
            const action = {
                type: ActionTypes.DELETE_RICH_MARK,
                payload: {

                },
            };
            // expect(plugin_toolbars_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle PASTE_BOX', ()=>{
        test('If box pasted', () => {
            const action = {
                type: ActionTypes.DELETE_CONTAINED_VIEW,
                payload: {
                },
            };
            // expect(plugin_toolbars_by_id(state, {})).toEqual(state);
        });
    });
});

