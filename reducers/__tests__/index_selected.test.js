import helper from './test_helper';
import reducer from '../index_selected';
import { ADD_NAV_ITEM, DELETE_NAV_ITEM, INDEX_SELECT, SELECT_NAV_ITEM, IMPORT_STATE } from '../../common/actions';

let reducerHelper = helper(undefined, reducer);

describe('empty_block reducer', ()=>{

    beforeAll(() => {
        reducerHelper.clean();
    });

    test('template', () => {
        // expect(0).toEqual(-1);
    });

});
