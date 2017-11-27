import { testState } from '../../core/store/state.tests.js';
import nav_items_by_id from '../nav_items_by_id';
import * as ActionTypes from '../../common/actions';

const state = testState.present.navItemsById;

// console.log(state);

describe('# nav_items_by_id reducer ******************************************************************* TODO :)', ()=>{

    describe('DEFAULT', ()=>{
        test('Should return test.state as default', () => {
            expect(nav_items_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle ADD_BOX', ()=>{
        test('If added box', () => {
            // expect(nav_items_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle MOVE_BOX', ()=>{
        test('If moved box', () => {
            // expect(nav_items_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle ADD_NAV_ITEM', ()=>{
        test('If nav item added', () => {
            // expect(nav_items_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle CHANGE_NAV_ITEM_NAME', ()=>{
        test('If nav item name changed', () => {
            // expect(nav_items_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle CHANGE_UNIT_NUMBER', ()=>{
        test('If unit number changed', () => {
            // expect(nav_items_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle DELETE_BOX', ()=>{
        test('If box deleted', () => {
            // expect(nav_items_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle DELETE_SORTABLE_CONTAINER', ()=>{
        test('If sortable container deleted', () => {
            // expect(nav_items_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle DUPLICATE_BOX', ()=>{
        test('If duplicated box', () => {
            // expect(nav_items_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle EXPAND_NAV_ITEM', ()=>{
        test('If nav item expanded', () => {
            // expect(nav_items_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle REORDER_NAV_ITEM', ()=>{
        test('If nav item reordered', () => {
            // expect(nav_items_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle DELETE_NAV_ITEM', ()=>{
        test('If nav item deleted', () => {
            // expect(nav_items_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle TOGGLE_NAV_ITEM', ()=>{
        test('If nav item toggled', () => {
            // expect(nav_items_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle TOGGLE_TITLE_MODE', ()=>{
        test('If title mode toggled', () => {
            // expect(nav_items_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle ADD_RICH_MARK', ()=>{
        test('If rich mark added', () => {
            // expect(nav_items_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle EDIT_RICH_MARK', ()=>{
        test('If rich mark edited', () => {
            // expect(nav_items_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle DELETE_RICH_MARK', ()=>{
        test('If rich mark deleted', () => {
            // expect(nav_items_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle UPDATE_NAV_ITEM_EXTRA_FILES', ()=>{
        test('If updated nav items extra files', () => {
            // expect(nav_items_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle IMPORT_STATE', ()=>{
        test('If state imported', () => {
            // expect(nav_items_by_id(state, {})).toEqual(state);
        });
    });

});

// Single nav item reducer
//* *************************************************************************************************

describe('# single nav_item reducer ******************************************************************* TODO :)', ()=>{
    describe('handle ADD_BOX', ()=>{
        test('If added box', () => {
            // expect(nav_items_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle MOVE_BOX', ()=>{
        test('If moved box', () => {
            // expect(nav_items_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle ADD_NAV_ITEM', ()=>{
        test('If nav item added', () => {
            // expect(nav_items_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle CHANGE_NAV_ITEM_NAME', ()=>{
        test('If nav item name changed', () => {
            // expect(nav_items_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle CHANGE_UNIT_NUMBER', ()=>{
        test('If unit number changed', () => {
            // expect(nav_items_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle DELETE_BOX', ()=>{
        test('If box deleted', () => {
            // expect(nav_items_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle DELETE_RICH_MARK', ()=>{
        test('If rich mark deleted', () => {
            // expect(nav_items_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle EXPAND_NAV_ITEM', ()=>{
        test('If nav item expanded', () => {
            // expect(nav_items_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle DELETE_NAV_ITEM', ()=>{
        test('If nav item deleted', () => {
            // expect(nav_items_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle REORDER_NAV_ITEM', ()=>{
        test('If nav item reordered', () => {
            // expect(nav_items_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle TOGGLE_NAV_ITEM', ()=>{
        test('If nav item toggled', () => {
            // expect(nav_items_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle TOGGLE_TITLE_MODE', ()=>{
        test('If title mode toggled', () => {
            // expect(nav_items_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle ADD_RICH_MARK', ()=>{
        test('If rich mark added', () => {
            // expect(nav_items_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle UPDATE_NAV_ITEM_EXTRA_FILES', ()=>{
        test('If updated nav items extra files', () => {
            // expect(nav_items_by_id(state, {})).toEqual(state);
        });
    });
});
