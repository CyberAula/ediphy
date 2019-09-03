import { testState } from '../../core/store/state.tests.js';
import nav_items_ids from '../navItems/navItemsIds';
import * as ActionTypes from '../../common/actions';

const state = testState.undoGroup.present.navItemsIds;

describe('# nav_items_ids reducer', ()=>{
    describe('DEFAULT', ()=>{
        test('should return testState as initial state', () => {
            expect(nav_items_ids(state, {})).toEqual(state);
        });
    });
    describe('handle ADD_NAV_ITEM', ()=> {
        test('If Added navigation item', () => {
            const action = { type: ActionTypes.ADD_NAV_ITEM, payload: { position: 7, id: 'pa-1511364505230' } };
            const newstate = ['se-1467887497411',
                'pa-1497983247795',
                'pa-1511364505230'];

            expect(nav_items_ids(state, action)).toEqual(newstate);
        });
    });
    describe('handle DELETE_NAV_ITEM', ()=> {
        test('Delete navigation items ', () => {
            const idstodelete = ['pa-1497983247795'];
            const action = { type: ActionTypes.DELETE_NAV_ITEM, payload: { ids: idstodelete } };
            const newstate = ["se-1467887497411"];
            expect(nav_items_ids(state, action)).toEqual(newstate);
        });
    });
    describe('handle REORDER_NAV_ITEM', ()=> {
        test('Select navigation item', () => {
            const idsinorder = ['se-1467887497411', 'pa-1497983247795', 'pa-1511252952332', 'se-1511252954307', 'pa-1511252955321', 'pa-1511252985426', 'pa-1511252955865'];
            const action = { type: ActionTypes.REORDER_NAV_ITEM, payload: { idsInOrder: idsinorder } };
            expect(nav_items_ids(state, action)).toEqual(idsinorder);

        });
    });
    describe('handle IMPORT_STATE', ()=> {
        test('Import navItemSelected (present)', () => {
            const ids = ['se-1467887497411', 'pa-1497983247795', 'pa-1511252952332', 'se-1511252954307', 'pa-1511252955321', 'pa-1511252985426', 'pa-1511252955865'];
            const action = { type: ActionTypes.IMPORT_STATE, payload: { present: { navItemsIds: ids } } };
            expect(nav_items_ids(state, action)).toEqual(ids);
        });
        test('Import default state from state.test', () => {
            const action = { type: ActionTypes.IMPORT_STATE, payload: { present: { navItemsIds: state } } };
            expect(nav_items_ids(state, action)).toEqual(state);
        });
    });
});
