import { testState } from '../../core/store/state.tests.js';
import index_selected from '../index_selected';
import * as ActionTypes from '../../common/actions';

const initstate = testState;

describe('# index_selected reducer', ()=>{
    describe('DEFAULT', ()=>{
        test('should return testState as initial state', () => {
            expect(index_selected(initstate, {})).toEqual(initstate);
        });
    });
    describe('handle DELETE_NAV_ITEM', ()=> {
        test('Delete navigation item', () => {
            const action = { type: ActionTypes.DELETE_NAV_ITEM };
            expect(index_selected(initstate, action)).toEqual(0);
        });
    });
    describe('handle ADD_NAV_ITEM', ()=> {
        test('Add navigation item', () => {
            const action = { type: ActionTypes.ADD_NAV_ITEM, payload: { id: 'pa-1511252985429' } };
            expect(index_selected(initstate, action)).toEqual('pa-1511252985429');

        });
    });
    describe('handle SELECT_NAV_ITEM', ()=> {
        test('Select navigation item', () => {
            const action = { type: ActionTypes.SELECT_NAV_ITEM, payload: { id: 'pa-1497983247795' } };
            expect(index_selected(initstate, action)).toEqual(initstate);

        });
    });
    describe('handle INDEX_SELECT', ()=> {
        test('Index selected item - Page', () => {
            const action = { type: ActionTypes.INDEX_SELECT, payload: { id: 'pa-1497983247795' } };
            expect(index_selected(initstate, action)).toEqual('pa-1497983247795');

        });
        test('Index selected item - Section', () => {
            const action = { type: ActionTypes.INDEX_SELECT, payload: { id: 'se-1467887497411' } };
            expect(index_selected(initstate, action)).toEqual('se-1467887497411');

        });
        test('Index selected item - Contained View', () => {
            const action = { type: ActionTypes.INDEX_SELECT, payload: { id: 'cv-1511252975055' } };
            expect(index_selected(initstate, action)).toEqual('cv-1511252975055');

        });
        // TODO. why slide has not iD_prefix => sl-*
    });
    describe('handle IMPORT_STATE', ()=> {
        test('Import state from state.test', () => {
            const action = { type: ActionTypes.IMPORT_STATE, payload: { present: {} } };
            expect(index_selected(initstate, action)).toEqual(0);

        });
    });

});
