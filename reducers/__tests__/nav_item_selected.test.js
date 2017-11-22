import { testState } from '../../core/store/state.tests.js';
import nav_item_selected from '../nav_item_selected';
import * as ActionTypes from '../../common/actions';

const initstate = testState;

describe('# nav_item_selected reducer', ()=>{
    describe('DEFAULT', ()=>{
        test('should return testState as initial state', () => {
            expect(nav_item_selected(initstate, {})).toEqual(initstate);
        });
    });
    describe('handle ADD_NAV_ITEM', ()=> {
        test('If Added navigation item & hasContent', () => {
            const action = { type: ActionTypes.ADD_NAV_ITEM, payload: { hasContent: true, id: 'pa-1511252985429' } };
            expect(action.payload.hasContent).toBeTruthy();
            expect(nav_item_selected(initstate, action)).toEqual(action.payload.id);
        });
        test('If Added navigation item & nothasContent', () => {
            const action = { type: ActionTypes.ADD_NAV_ITEM, payload: { hasContent: false } };
            expect(nav_item_selected(initstate, action)).toEqual(initstate);
        });
    });
    describe('handle DELETE_NAV_ITEM', ()=> {
        test('Delete navigation items', () => {
            const action = { type: ActionTypes.DELETE_NAV_ITEM, payload: { ids: [0, 1] } };
            expect(action.payload.ids && action.payload.ids.length > 0 && action.payload.ids.includes(0)).toBeTruthy();
            expect(nav_item_selected(undefined, action)).toEqual(0);
        });
    });

    describe('handle SELECT_NAV_ITEM', ()=> {
        test('Select navigation item', () => {
            const action = { type: ActionTypes.SELECT_NAV_ITEM, payload: { id: 'pa-1497983247795' } };
            expect(nav_item_selected(initstate, action)).toEqual(action.payload.id);

        });
    });

    describe('handle IMPORT_STATE', ()=> {
        test('Import navItemSelected from state.test', () => {
            const state = initstate.present.navItemSelected;
            const action = { type: ActionTypes.IMPORT_STATE, payload: { present: { navItemSelected: state } } };
            expect(nav_item_selected(state, action)).toEqual(state);
        });
        test('Import default state', () => {
            const state = 0;
            const action = { type: ActionTypes.IMPORT_STATE, payload: { present: { navItemSelected: state } } };
            expect(nav_item_selected(state, action)).toEqual(state);
        });
    });
});

