import helper from './test_helper';
import reducer from '../global_config';
import { CHANGE_GLOBAL_CONFIG, IMPORT_STATE } from '../../common/actions';

let reducerHelper = helper(undefined, reducer);

describe('empty_block reducer', ()=>{

    beforeAll(() => {
        reducerHelper.clean();
    });

    test('template', () => {
        expect(0).toEqual(-1);
    });

});