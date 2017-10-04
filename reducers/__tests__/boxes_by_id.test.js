import helper from './test_helper';
import reducer from '../boxes_by_id';
import { ADD_BOX, MOVE_BOX, DUPLICATE_BOX, UPDATE_BOX, DELETE_BOX, REORDER_SORTABLE_CONTAINER, DROP_BOX, ADD_RICH_MARK,
    RESIZE_SORTABLE_CONTAINER, DELETE_SORTABLE_CONTAINER, CHANGE_COLS, CHANGE_ROWS, CHANGE_SORTABLE_PROPS, REORDER_BOXES,
    DELETE_NAV_ITEM, DELETE_CONTAINED_VIEW, IMPORT_STATE } from '../../common/actions';

let reducerHelper = helper(undefined, reducer);

describe('empty_block reducer', ()=>{

    beforeAll(() => {
        reducerHelper.clean();
    });

    test('template', () => {
        expect(0).toEqual(-1);
    });

});