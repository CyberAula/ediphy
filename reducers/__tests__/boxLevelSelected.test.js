import helper from './_testHelper';
import reducer from '../boxes/boxLevelSelected';
import { INCREASE_LEVEL, SELECT_BOX, SELECT_NAV_ITEM, DELETE_NAV_ITEM, PASTE_BOX } from '../../common/actions';
import { ID_PREFIX_SORTABLE_BOX } from '../../common/constants';

let reducerHelper = helper(undefined, reducer);

describe('# box_level_selected reducer', () => {

    beforeAll(() => {
        reducerHelper.clean();
    });

    test('should return the initial state', () => {
        expect(reducer(undefined, {})).toEqual(0);
    });

    test('should handle ADD_BOX', () => {
        expect(reducer(undefined, {})).toEqual(0);
    });

    test('should handle INCREASE_LEVEL', () => {
        let i = 0;
        for (; i < 10; i++) {
            reducerHelper.call({ type: INCREASE_LEVEL });
        }
        expect(reducerHelper.state).toEqual(i);
    });

    test('should handle DELETE_NAV_ITEM', () => {
        for (let i = 0; i < 10; i++) {
            reducerHelper.call({ type: DELETE_NAV_ITEM });
        }
        expect(reducerHelper.state).toEqual(0);
    });

    test('should handle SELECT_BOX', () => {
        reducerHelper.call({ type: SELECT_BOX, payload: { id: -1 } });
        expect(reducerHelper.state).toEqual(0);
        reducerHelper.call({ type: SELECT_BOX, payload: { id: "34534534543" } });
        expect(reducerHelper.state).toEqual(0);
        reducerHelper.call({ type: SELECT_BOX, payload: { id: "bg-23424234" } });
        expect(reducerHelper.state).toEqual(0);
        reducerHelper.call({ type: SELECT_BOX, payload: { id: ID_PREFIX_SORTABLE_BOX + "2" } });
        expect(reducerHelper.state).toEqual(-1);

        reducerHelper.call({ type: SELECT_BOX, payload: { id: "85584" } });
        expect(reducerHelper.state).toEqual(0);
        reducerHelper.call({ type: INCREASE_LEVEL });
        reducerHelper.call({ type: INCREASE_LEVEL });
        // reducerHelper.call({ type: SELECT_BOX, payload: { id: "asd-85584" } });
        expect(reducerHelper.state).toEqual(2);

    });

    test('should handle SELECT_NAV_ITEM', () => {
        reducerHelper.call({ type: SELECT_NAV_ITEM });
        expect(reducerHelper.state).toEqual(0);
    });
    test('should handle PASTE_BOX', () => {
        reducerHelper.call({ type: PASTE_BOX });
        expect(reducerHelper.state).toEqual(0);
    });

});
