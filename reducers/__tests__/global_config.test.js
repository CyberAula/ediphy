import global_config from '../global_config';
import * as types from '../../common/actions';

describe('global_config reducer', ()=>{
    it('should return 0 as default initial state', () => {
        // setup
        let action = { type: 'unknown' };
        // execute
        let newState = global_config(0, action);

        expect(newState).toEqual(0);
    });
    describe('handle IMPORT_STATE', () => {
        it('should load globalConfig ', () => {
            // setup
            let action = {
                type: types.IMPORT_STATE,
            };
            // execute
            let newState = index_selected(undefined, action);

            // expect(newState).toEqual();
        });
    });

    it('should change global config (handle CHANGE_GLOBAL_CONFIG)', () => {

    });

});

// case CHANGE_GLOBAL_CONFIG:
//     if(action.payload.prop === 'STATE') {
//         return action.payload.value;
//     }
// return changeProp(state, action.payload.prop, action.payload.value);

// case IMPORT_STATE:
//     return action.payload.present.globalConfig || state;
// :
