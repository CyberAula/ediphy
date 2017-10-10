import helper from './test_helper';
import reducer from '../nav_items_by_id';
import { ADD_BOX, MOVE_BOX, ADD_NAV_ITEM, CHANGE_NAV_ITEM_NAME, CHANGE_UNIT_NUMBER, DELETE_BOX, DUPLICATE_BOX, EXPAND_NAV_ITEM,
    REORDER_NAV_ITEM, DELETE_NAV_ITEM, TOGGLE_NAV_ITEM, TOGGLE_TITLE_MODE, UPDATE_NAV_ITEM_EXTRA_FILES, DELETE_SORTABLE_CONTAINER,
    ADD_RICH_MARK, EDIT_RICH_MARK, DELETE_RICH_MARK,
    IMPORT_STATE } from '../../common/actions';

let reducerHelper = helper(undefined, reducer);

describe('empty_block reducer', ()=>{

    beforeAll(() => {
        reducerHelper.clean();
    });

    test('template', () => {
        expect(0).toEqual(-1);
    });

});
