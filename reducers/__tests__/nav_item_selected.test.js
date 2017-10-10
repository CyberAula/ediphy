import helper from './test_helper';
import reducer from '../nav_item_selected';
import { ADD_NAV_ITEM, DELETE_NAV_ITEM, SELECT_NAV_ITEM, IMPORT_STATE } from '../../common/actions';

let reducerHelper = helper(undefined, reducer);

describe('empty_block reducer', ()=>{

    beforeAll(() => {
        reducerHelper.clean();
    });

    test('template', () => {
        expect(0).toEqual(-1);
    });

});
