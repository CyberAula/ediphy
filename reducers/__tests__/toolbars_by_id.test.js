import { testState } from '../../core/store/state.tests.js';
import toolbars_by_id from '../toolbars_by_id';
import * as ActionTypes from '../../common/actions';

const state = testState.present.toolbarsById;

// console.log(state);

describe('# toolbars_by_id reducer ******************************************************************* TODO :)', ()=>{

    describe('DEFAULT', ()=>{
        test('Should return test.state as default', () => {
            expect(toolbars_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle ADD_BOX', ()=>{
        test('If added box', () => {
            // expect(toolbars_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle ADD_NAV_ITEM', ()=>{
        test('If nav item added', () => {
            // expect(toolbars_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle ADD_RICH_MARK', ()=>{
        test('If rich mark added', () => {
            // expect(toolbars_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle CHANGE_NAV_ITEM_NAME', ()=>{
        test('If nav item name changed', () => {
            // expect(toolbars_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle CHANGE_CONTAINED_VIEW_NAME', ()=>{
        test('If contained view name changed', () => {
            // expect(toolbars_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle DELETE_BOX', ()=>{
        test('If box deleted', () => {
            // expect(toolbars_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle DELETE_CONTAINED_VIEW', ()=>{
        test('If contained view deleted', () => {
            // expect(toolbars_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle DELETE_NAV_ITEM', ()=>{
        test('If nav item deleted', () => {
            // expect(toolbars_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle DELETE_SORTABLE_CONTAINER', ()=>{
        test('If sortable container deleted', () => {
            // expect(toolbars_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle DUPLICATE_BOX', ()=>{
        test('If duplicated box', () => {
            // expect(toolbars_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle EDIT_RICH_MARK', ()=>{
        test('If rich mark edited', () => {
            // expect(toolbars_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle DELETE_RICH_MARK', ()=>{
        test('If rich mark deleted', () => {
            // expect(toolbars_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle RESIZE_BOX', ()=>{
        test('If box resized', () => {
            // expect(toolbars_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle RESIZE_SORTABLE_CONTAINER', ()=>{
        test('If resized sortable container', () => {
            // expect(toolbars_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle TOGGLE_TEXT_EDITOR', ()=>{
        test('If text editor toggled', () => {
            // expect(toolbars_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle UPDATE_BOX', ()=>{
        test('If updated box', () => {
            // expect(toolbars_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle UPDATE_TOOLBAR', ()=>{
        test('If updated toolbar', () => {
            // expect(toolbars_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle VERTICALLY_ALIGN_BOX', ()=>{
        test('If box vertically aligned', () => {
            // expect(toolbars_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle PASTE_BOX', ()=>{
        test('If box pasted', () => {
            // expect(toolbars_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle IMPORT_STATE', ()=>{
        test('If state imported', () => {
            // expect(toolbars_by_id(state, {})).toEqual(state);
        });
    });
});

// Single nav item reducer
//* *************************************************************************************************

describe('# toolbar reducer ******************************************************************* TODO :)', ()=>{
    describe('handle ADD_RICH_MARK', ()=>{
        test('If rich mark added', () => {
            // expect(toolbars_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle CHANGE_NAV_ITEM_NAME', ()=>{
        test('If nav item name changed', () => {
            // expect(toolbars_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle CHANGE_CONTAINED_VIEW_NAME', ()=>{
        test('If contained view name changed', () => {
            // expect(toolbars_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle EDIT_RICH_MARK', ()=>{
        test('If rich mark edited', () => {
            // expect(toolbars_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle RESIZE_BOX', ()=>{
        test('If box resized', () => {
            // expect(toolbars_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle RESIZE_SORTABLE_CONTAINER', ()=>{
        test('If resized sortable container', () => {
            // expect(toolbars_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle TOGGLE_TEXT_EDITOR', ()=>{
        test('If text editor toggled', () => {
            // expect(toolbars_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle UPDATE_BOX', ()=>{
        test('If updated box', () => {
            // expect(toolbars_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle UPDATE_TOOLBAR', ()=>{
        test('If updated toolbar', () => {
            // expect(toolbars_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle DELETE_RICH_MARK', ()=>{
        test('If rich mark deleted', () => {
            // expect(toolbars_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle VERTICALLY_ALIGN_BOX', ()=>{
        test('If box vertically aligned', () => {
            // expect(toolbars_by_id(state, {})).toEqual(state);
        });
    });
});
