import helper from './test_helper';
import reducer from '../contained_views_by_id';
import { ADD_BOX, ADD_CONTAINED_VIEW, ADD_RICH_MARK, DELETE_RICH_MARK, EDIT_RICH_MARK, DELETE_BOX, DELETE_CONTAINED_VIEW, CHANGE_CONTAINED_VIEW_NAME, TOGGLE_TITLE_MODE, DELETE_NAV_ITEM, DELETE_SORTABLE_CONTAINER, IMPORT_STATE } from '../../common/actions';

let reducerHelper = helper(undefined, reducer);

describe('empty_block reducer', ()=>{

    beforeAll(() => {
        reducerHelper.clean();
    });

    test('template', () => {
        expect(0).toEqual(-1);
    });

});
