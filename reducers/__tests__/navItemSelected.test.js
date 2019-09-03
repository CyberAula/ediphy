import { testState } from '../../core/store/state.tests.js';
import nav_item_selected from '../navItems/navItemSelected';
import * as ActionTypes from '../../common/actions';

const state = testState.undoGroup.present.navItemSelected; // pa-1511252955865

describe('# nav_item_selected reducer', ()=>{
    describe('DEFAULT', ()=>{
        test('should return test.state as initial state', () => {
            expect(nav_item_selected(state, {})).toEqual(state);
        });
    });
    describe('handle ADD_NAV_ITEM', ()=> {
        test('If Added navigation item & hasContent', () => {
            const addedId = 'pa-1511252985429';
            const action = { type: ActionTypes.ADD_NAV_ITEM, payload: { hasContent: true, id: addedId } };
            expect(action.payload.hasContent).toBeTruthy();
            expect(nav_item_selected(state, action)).toEqual(addedId);
        });
        test('If Added navigation item & nothasContent', () => {
            const action = { type: ActionTypes.ADD_NAV_ITEM, payload: { hasContent: false } };
            expect(action.payload.hasContent).toBeFalsy();
            expect(nav_item_selected(state, action)).toEqual(state);
        });
    });
    describe('handle DELETE_NAV_ITEM ', ()=> {
        test('Delete navigation item', () => {
            const action = { type: ActionTypes.DELETE_NAV_ITEM, payload: { ids: [state] } };
            const newstate = 0;
            expect(action.payload.ids && action.payload.ids.length > 0 && action.payload.ids.includes(state)).toBeTruthy();
            expect(nav_item_selected(newstate, action)).toEqual(0);
        });
    });
    describe('handle SELECT_NAV_ITEM', ()=> {
        test('Select navigation item', () => {
            const action = { type: ActionTypes.SELECT_NAV_ITEM, payload: { id: 'pa-1497983247795' } };
            expect(nav_item_selected(state, action)).toEqual('pa-1497983247795');

        });
    });
    describe('handle IMPORT_STATE', ()=> {
        test('Import navItemSelected from state.test', () => {
            const action = { type: ActionTypes.IMPORT_STATE, payload: { present: { navItemSelected: state } } };
            expect(nav_item_selected(state, action)).toEqual(state);
        });
        test('Import default state', () => {
            const action = { type: ActionTypes.IMPORT_STATE, payload: { present: { } } };
            expect(nav_item_selected(state, action)).toEqual(0);
        });
    });
});

