import { testState } from '../../core/store/state.tests.js';
import plugin_toolbars_by_id from '../toolbars/pluginToolbarsById';
import * as ActionTypes from '../../common/actions';

const state = testState.undoGroup.present.pluginToolbarsById;

/*
* ADD_BOX, DELETE_BOX, DELETE_CONTAINED_VIEW,
    DELETE_NAV_ITEM, DELETE_SORTABLE_CONTAINER, RESIZE_BOX, RESIZE_SORTABLE_CONTAINER,
    TOGGLE_TEXT_EDITOR, UPDATE_BOX, UPDATE_PLUGIN_TOOLBAR,
    VERTICALLY_ALIGN_BOX, IMPORT_STATE, PASTE_BOX,
* */

describe('# plugin_toolbars_by_id reducer', ()=>{
    describe('DEFAULT', ()=>{
        test('Should return test.state as default', () => {
            expect(plugin_toolbars_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle ADD_BOX', ()=>{
        test('If added box', () => {
            expect(plugin_toolbars_by_id(state, ActionTypes.ADD_BOX)).toEqual(state);
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
    describe('handle UPDATE_PLUGIN_TOOLBAR', ()=>{
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

