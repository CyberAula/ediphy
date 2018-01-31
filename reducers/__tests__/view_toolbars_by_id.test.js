import { testState } from '../../core/store/state.tests.js';
import view_toolbars_by_id from '../view_toolbars_by_id';
import * as ActionTypes from '../../common/actions';

const state = testState.present.viewToolbarsById;

describe('# plugin_toolbars_by_id reducer ******************************************************************* TODO :)', ()=>{

    describe('DEFAULT', ()=>{
        test('Should return test.state as default', () => {

            expect(view_toolbars_by_id(state, {})).toEqual(state);
        });
    });

    describe('handle ADD_NAV_ITEM', ()=>{
        test('If nav item added', () => {
            const action = { type: ActionTypes.ADD_NAV_ITEM, payload: { id: 'pa-1511252985429' } };
            expect(plugin_toolbars_by_id(state, action)).toEqual(state);
        });
    });

    describe('handle CHANGE_NAV_ITEM_NAME', ()=>{
        test('If nav item name changed', () => {
            // expect(plugin_toolbars_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle CHANGE_CONTAINED_VIEW_NAME', ()=>{
        test('If contained view name changed', () => {
            // expect(plugin_toolbars_by_id(state, {})).toEqual(state);
        });
    });

    describe('handle DELETE_CONTAINED_VIEW', ()=>{
        test('If contained view deleted', () => {
            // expect(plugin_toolbars_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle RESIZE_BOX', ()=>{
        test('If box resized', () => {
            // expect(plugin_toolbars_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle UPDATE_TOOLBAR', ()=>{
        test('If updated toolbar', () => {
            // expect(plugin_toolbars_by_id(state, {})).toEqual(state);
        });
    });

    describe('handle PASTE_BOX', ()=>{
        test('If box pasted', () => {
            // expect(plugin_toolbars_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle IMPORT_STATE', ()=>{
        test('If state imported', () => {
            // expect(plugin_toolbars_by_id(state, {})).toEqual(state);
        });
    });
});

