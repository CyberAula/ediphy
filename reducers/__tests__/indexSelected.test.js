import index_selected from '../navItems/indexSelected';
import * as ActionTypes from '../../common/actions';

const state = "pa-1";
describe('# index_selected reducer', ()=>{
    describe('DEFAULT', ()=>{
        test('should return testState as initial state', () => {
            expect(index_selected(state, {})).toEqual(state);
        });
    });
    describe('handle DELETE_NAV_ITEM', ()=> {
        test('Delete navigation item', () => {
            const action = { type: ActionTypes.DELETE_NAV_ITEM };
            expect(index_selected(state, action)).toEqual(0);
        });
    });
    describe('handle ADD_NAV_ITEM', ()=> {
        test('Add navigation item', () => {
            const action = { type: ActionTypes.ADD_NAV_ITEM, payload: { id: 'pa-2' } };
            expect(index_selected(state, action)).toEqual('pa-2');

        });
    });
    describe('handle SELECT_NAV_ITEM', ()=> {
        test('Select navigation item', () => {
            const action = { type: ActionTypes.SELECT_NAV_ITEM, payload: { id: 'pa-2' } };
            expect(index_selected(state, action)).toEqual(state);

        });
    });
    describe('handle INDEX_SELECT', ()=> {
        test('Index selected item - Page', () => {
            const action = { type: ActionTypes.INDEX_SELECT, payload: { id: 'pa-1' } };
            expect(index_selected(state, action)).toEqual('pa-1');

        });
        test('Index selected item - Section', () => {
            const action = { type: ActionTypes.INDEX_SELECT, payload: { id: 'se-1' } };
            expect(index_selected(state, action)).toEqual('se-1');

        });
        test('Index selected item - Contained View', () => {
            const action = { type: ActionTypes.INDEX_SELECT, payload: { id: 'cv-1' } };
            expect(index_selected(state, action)).toEqual('cv-1');

        });
        // TODO. why slide has not iD_prefix => sl-*
    });
    describe('handle IMPORT_STATE', ()=> {
        test('Import state from state.test', () => {
            const action = { type: ActionTypes.IMPORT_STATE, payload: { present: {} } };
            expect(index_selected(state, action)).toEqual(0);

        });
    });
});
