import { testState } from '../../core/store/state.tests.js';
import toolbars_by_id from '../toolbars_by_id';
import { ADD_BOX, ADD_RICH_MARK, CHANGE_NAV_ITEM_NAME, DELETE_BOX, DELETE_RICH_MARK, DELETE_CONTAINED_VIEW, ADD_NAV_ITEM, DELETE_NAV_ITEM, DELETE_SORTABLE_CONTAINER, DUPLICATE_BOX,
    EDIT_RICH_MARK, RESIZE_BOX, RESIZE_SORTABLE_CONTAINER, TOGGLE_TEXT_EDITOR, UPDATE_BOX, UPDATE_TOOLBAR, CHANGE_CONTAINED_VIEW_NAME,
    VERTICALLY_ALIGN_BOX, IMPORT_STATE } from '../../common/actions';

let reducerHelper = helper(undefined, reducer);

const state = testState.present.navItemSelected;

describe('empty_block reducer', ()=>{

    beforeAll(() => {
        reducerHelper.clean();
    });

    test('template', () => {
        // expect(0).toEqual(-1);
    });

    test('Change background color', () => {

        const action = {
            action: UPDATE_TOOLBAR, payload: {
                id: "pa-1497983292801",
                tab: "main",
                accordions: ["basic"],
                name: "change_background",
                value: "#00000",
            } };

        expect(toolbars_by_id(state, action)).toEqual(-1);
    });

    test('Change background image', () => {
        // expect(0).toEqual(-1);
    });
});
