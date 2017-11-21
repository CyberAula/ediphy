import reducer from '../global_config';
import * as types from '../../common/actions';

const initialState = 0;

describe('global_config reducer', ()=>{
    it('should not have initial state', () => {
        expect(reducer(undefined, {})).toEqual(initialState);
    });

    it('should load initial state (handle IMPORT_STATE)', () => {
        // reducerHelper.call({ type: types.IMPORT_STATE });
        // expect(reducerHelper.state).toEqual();

        // expect(reducer([], {type: types.IMPORT_STATE})).toEqual([]);
    });
    it('should change global config (handle CHANGE_GLOBAL_CONFIG)', () => {
        // expect(reducer([], {type: types.CHANGE_GLOBAL_CONFIG})).toEqual([]);
    });

});
