import reducer from '../index_selected';
import * as types from '../../common/actions';
import * as prefixes from '../../common/constants';

// { ID_PREFIX_BOX, ID_PREFIX_PAGE, ID_PREFIX_SECTION, ID_PREFIX_SORTABLE_BOX, ID_PREFIX_CONTAINED_VIEW, ID_PREFIX_SORTABLE_CONTAINER, PAGE_TYPES }
const initialState = 0;

describe('index_selected reducer', ()=>{

    it('should not have initial state', () => {
        expect(reducer(undefined, {})).toEqual(initialState);
    });

    it('should delete nav item (handle DELETE_NAV_ITEM)', () => {
        expect(reducer([], { type: types.DELETE_NAV_ITEM })).toEqual(0);
    });

    it('should add nav item (handle ADD_NAV_ITEM)', () => {
        let random = Math.floor(Math.random() * (100000 - 10000 + 1)) + 10000;
        expect(reducer({ payload: { ids: { id: random, parent: prefixes.ID_PREFIX_CONTAINED_VIEW + random } } }, { type: types.ADD_NAV_ITEM })).toEqual(-1);
    });

});

// case ADD_NAV_ITEM:
//     return action.payload.id;
// case DELETE_NAV_ITEM:
//     return 0;
// case SELECT_NAV_ITEM:
//     return state;
// case INDEX_SELECT:
//     return action.payload.id;
// case IMPORT_STATE:
//     return 0;
// default:
// return state;

