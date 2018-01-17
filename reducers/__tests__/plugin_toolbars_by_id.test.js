import { testState } from '../../core/store/state.tests.js';
import plugin_toolbars_by_id from '../plugin_toolbars_by_id';
import * as ActionTypes from '../../common/actions';

const state = testState.present.pluginToolbarsById;

// console.log(state);

describe('# plugin_toolbars_by_id reducer ******************************************************************* TODO :)', ()=>{

    describe('DEFAULT', ()=>{
        test('Should return test.state as default', () => {
            expect(plugin_toolbars_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle ADD_BOX', ()=>{
        test('If added box', () => {
            // expect(plugin_toolbars_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle ADD_NAV_ITEM', ()=>{
        test('If nav item added', () => {
            // expect(plugin_toolbars_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle ADD_RICH_MARK', ()=>{
        test('If rich mark added', () => {
            // expect(plugin_toolbars_by_id(state, {})).toEqual(state);
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
    describe('handle DELETE_BOX', ()=>{
        test('If box deleted', () => {
            // expect(plugin_toolbars_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle DELETE_CONTAINED_VIEW', ()=>{
        test('If contained view deleted', () => {
            // expect(plugin_toolbars_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle DELETE_NAV_ITEM', ()=>{
        test('If nav item deleted', () => {
            // expect(plugin_toolbars_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle DELETE_SORTABLE_CONTAINER', ()=>{
        test('If sortable container deleted', () => {
            // expect(plugin_toolbars_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle DUPLICATE_BOX', ()=>{
        test('If duplicated box', () => {
            // expect(plugin_toolbars_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle EDIT_RICH_MARK', ()=>{
        test('If rich mark edited', () => {
            // expect(plugin_toolbars_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle DELETE_RICH_MARK', ()=>{
        test('If rich mark deleted', () => {
            // expect(plugin_toolbars_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle RESIZE_BOX', ()=>{
        test('If box resized', () => {
            // expect(plugin_toolbars_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle RESIZE_SORTABLE_CONTAINER', ()=>{
        test('If resized sortable container', () => {
            // expect(plugin_toolbars_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle TOGGLE_TEXT_EDITOR', ()=>{
        test('If text editor toggled', () => {
            // expect(plugin_toolbars_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle UPDATE_BOX', ()=>{
        test('If updated box', () => {
            // expect(plugin_toolbars_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle UPDATE_TOOLBAR', ()=>{
        test('If updated toolbar', () => {
            // expect(plugin_toolbars_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle VERTICALLY_ALIGN_BOX', ()=>{
        test('If box vertically aligned', () => {
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

