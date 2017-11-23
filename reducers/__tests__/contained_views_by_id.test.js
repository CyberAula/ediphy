import { testState } from '../../core/store/state.tests.js';
import contained_views_by_id from '../contained_views_by_id';
import * as ActionTypes from '../../common/actions';

const state = testState.present.containedViewsById;

// console.log(state);

describe('# contained_views_by_id reducer ******************************************************************* TODO :)', ()=>{

    describe('DEFAULT', ()=>{
        test('Should return test.state as default', () => {
            expect(contained_views_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle ADD_BOX', ()=>{
        test('If added box', () => {
            // expect(contained_views_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle EDIT_RICH_MARK', ()=>{
        test('If rich mark edited', () => {
            // expect(contained_views_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle DELETE_RICH_MARK', ()=>{
        test('If rich mark deleted', () => {
            // expect(contained_views_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle ADD_RICH_MARK', ()=>{
        test('If rich mark added', () => {
            // expect(contained_views_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle DELETE_BOX', ()=>{
        test('If box deleted', () => {
            // expect(contained_views_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle CHANGE_CONTAINED_VIEW_NAME', ()=>{
        test('If contained view name changed', () => {
            // expect(contained_views_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle DELETE_CONTAINED_VIEW', ()=>{
        test('If contained view deleted', () => {
            // expect(contained_views_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle DELETE_SORTABLE_CONTAINER', ()=>{
        test('If sortable container deleted', () => {
            // expect(contained_views_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle TOGGLE_TITLE_MODE', ()=>{
        test('If title mode toggled', () => {
            // expect(contained_views_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle IMPORT_STATE', ()=>{
        test('If state imported', () => {
            // expect(contained_views_by_id(state, {})).toEqual(state);
        });
    });
});

// Single contained view reducer
//* *************************************************************************************************

describe('# single_contained_views_by_id reducer ******************************************************************* TODO :)', ()=>{
    describe('DEFAULT', ()=>{
        test('Should return test.state as default', () => {
            expect(contained_views_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle ADD_BOX', ()=>{
        test('If added box', () => {
            // expect(contained_views_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle ADD_RICH_MARK', ()=>{
        test('If rich mark added', () => {
            // expect(contained_views_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle DELETE_RICH_MARK', ()=>{
        test('If rich mark deleted', () => {
            // expect(contained_views_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle DELETE_BOX', ()=>{
        test('If box deleted', () => {
            // expect(contained_views_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle TOGGLE_TITLE_MODE', ()=>{
        test('If title mode toggled', () => {
            // expect(contained_views_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle CHANGE_CONTAINED_VIEW_NAME', ()=>{
        test('If contained view name changed', () => {
            // expect(contained_views_by_id(state, {})).toEqual(state);
        });
    });
});
