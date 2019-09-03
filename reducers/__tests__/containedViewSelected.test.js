import helper from './_testHelper';
import reducer from '../containedViews/containedViewSelected';
import { ADD_NAV_ITEM, DELETE_CONTAINED_VIEW, SELECT_CONTAINED_VIEW, SELECT_NAV_ITEM, IMPORT_STATE } from '../../common/actions';

let reducerHelper = helper(undefined, reducer);

describe('# contained_view_selected reducer', () => {
    beforeAll(() => {
        reducerHelper.clean();
    });
    test('no action passed => default', () => {
        expect(reducer(undefined, {})).toEqual(0);
    });
    describe('handle ADD_NAV_ITEM', () => {
        test('always return 0', () => {
            reducerHelper.call({ type: SELECT_NAV_ITEM, payload: { ids: { id: reducerHelper.getBox(), parent: reducerHelper.getSortableBox() }, initialParams: { isDefaultPlugin: true } } });
            reducerHelper.call({ type: ADD_NAV_ITEM });
            expect(reducerHelper.state).toEqual(0);
        });
    });
    describe('handle SELECT_CONTAINED_VIEW', () => {
        test('return the id of the box', () => {
            let randomBox = reducerHelper.getBox();
            reducerHelper.call({ type: SELECT_CONTAINED_VIEW, payload: { id: randomBox } });
            expect(reducerHelper.state).toEqual(randomBox);
        });
    });
    describe('handle DELETE_CONTAINED_VIEW', () => {
        test('always return 0', () => {
            reducerHelper.call({ type: SELECT_NAV_ITEM, payload: { id: reducerHelper.getBox(), parent: reducerHelper.getSortableBox(), container: reducerHelper.getContainedView() } });
            reducerHelper.call({ type: DELETE_CONTAINED_VIEW });
            expect(reducerHelper.state).toEqual(0);
        });
    });
    describe('handle SELECT_NAV_ITEM', () => {
        test('always return 0', () => {
            reducerHelper.call({ type: SELECT_NAV_ITEM, payload: { id: reducerHelper.getBox(), parent: reducerHelper.getSortableBox(), container: reducerHelper.getContainedView() } });
            reducerHelper.call({ type: SELECT_NAV_ITEM });
            expect(reducerHelper.state).toEqual(0);
        });
    });
    describe('handle IMPORT_STATE', () => {
        test('return the present contained view', () => {
            let randomContainedView = reducerHelper.getContainedView();
            reducerHelper.call({ type: IMPORT_STATE, payload: { present: { containedViewSelected: randomContainedView } } });
            expect(reducerHelper.state).toEqual(randomContainedView);
        });

        test('return the current state', () => {
            let randomContainedView = reducerHelper.getContainedView();
            reducerHelper.set(randomContainedView);
            reducerHelper.call({ type: IMPORT_STATE, payload: { present: {} } });
            expect(reducerHelper.state).toEqual(0);
        });
    });

});
