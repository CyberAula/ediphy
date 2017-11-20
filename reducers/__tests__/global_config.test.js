import reducer from '../global_config';
import * as types from '../../common/actions';

describe('global_config reducer', ()=>{
    it('should return the initial state', () => {
        expect(reducer(undefined, {})).toEqual(0);
    });

    // it('should handle CHANGE_GLOBAL_CONFIG', () => {

    // });

    // it('should handle IMPORT_STATE', () => {

    // });

});
