import helper from './test_helper';
import reducer from '../box_selected';
import { ADD_BOX, ADD_NAV_ITEM, DELETE_BOX, DELETE_SORTABLE_CONTAINER, DUPLICATE_BOX, DELETE_NAV_ITEM, SELECT_BOX, SELECT_CONTAINED_VIEW, SELECT_NAV_ITEM, IMPORT_STATE } from '../../common/actions';

let reducerHelper = helper(undefined, reducer);

describe('box_selected reducer', () => {

    beforeAll(() => {
        reducerHelper.clean();
    });

    test('no action passed => default', () => {
        expect(reducer(undefined, {})).toEqual(-1);
    });

    describe('handle ADD_BOX', () => {
        test('sortable box', () => {
            reducerHelper.call({ type: ADD_BOX, payload: { ids: { id: reducerHelper.getSortableBox(), parent: 0 } } });
            expect(reducerHelper.state).toEqual(-1);
        });

        test('sortable box in contained view', () => {
            let randomBox = reducerHelper.getBox();
            reducerHelper.set(randomBox);
            reducerHelper.call({ type: ADD_BOX, payload: { ids: { id: reducerHelper.getSortableBox(), parent: reducerHelper.getContainedView() } } });
            expect(reducerHelper.state).toEqual(randomBox);
        });

        test('default plugin', () => {
            let randomBox = reducerHelper.getBox();
            reducerHelper.set(randomBox);
            reducerHelper.call({ type: ADD_BOX, payload: { ids: { id: reducerHelper.getBox(), parent: reducerHelper.getSortableBox() }, initialParams: { isDefaultPlugin: true } } });
            expect(reducerHelper.state).toEqual(randomBox);
        });

        test('normal box', () => {
            let randomBox = reducerHelper.getBox();
            reducerHelper.call({ type: ADD_BOX, payload: { ids: { id: randomBox, parent: reducerHelper.getContainedView() }, initialParams: { isDefaultPlugin: false } } });
            expect(reducerHelper.state).toEqual(randomBox);
        });
    });

    describe('handle ADD_NAV_ITEM', () => {
        test('always return -1', () => {
            reducerHelper.call({ type: ADD_BOX, payload: { ids: { id: reducerHelper.getBox(), parent: reducerHelper.getSortableBox() }, initialParams: { isDefaultPlugin: true } } });
            reducerHelper.call({ type: ADD_NAV_ITEM });
            expect(reducerHelper.state).toEqual(-1);
        });
    });

    describe('handle DELETE_BOX', () => {
        test('box in contained view', () => {
            reducerHelper.call({ type: DELETE_BOX, payload: { id: reducerHelper.getBox(), parent: reducerHelper.getSortableBox(), container: reducerHelper.getContainedView() } });
            expect(reducerHelper.state).toEqual(-1);
        });

        test('select parent', () => {
            let randomBox = reducerHelper.getBox();
            reducerHelper.call({ type: DELETE_BOX, payload: { id: reducerHelper.getBox(), parent: randomBox, container: reducerHelper.getSortableBox() } });
            expect(reducerHelper.state).toEqual(randomBox);
        });

        test('normal', () => {
            reducerHelper.call({ type: DELETE_BOX, payload: { id: reducerHelper.getBox(), parent: reducerHelper.getSortableBox(), container: reducerHelper.getContainedView() } });
            expect(reducerHelper.state).toEqual(-1);
        });
    });

    describe('handle DELETE_SORTABLE_CONTAINER', () => {
        test('always return -1', () => {
            reducerHelper.call({ type: DELETE_BOX, payload: { id: reducerHelper.getBox(), parent: reducerHelper.getSortableBox(), container: reducerHelper.getContainedView() } });
            reducerHelper.call({ type: DELETE_SORTABLE_CONTAINER });
            expect(reducerHelper.state).toEqual(-1);
        });
    });

    describe('handle DUPLICATE_BOX', () => {
        test('return the new id', () => {
            let id = reducerHelper.getRandomInt(10000, 100000);
            reducerHelper.call({ type: DUPLICATE_BOX, payload: { newId: id } });
            expect(reducerHelper.state).toEqual(reducerHelper.getBox(id));
        });
    });

    describe('handle DELETE_NAV_ITEM', () => {
        test('always return -1', () => {
            reducerHelper.call({ type: DELETE_BOX, payload: { id: reducerHelper.getBox(), parent: reducerHelper.getSortableBox(), container: reducerHelper.getContainedView() } });
            reducerHelper.call({ type: DELETE_NAV_ITEM });
            expect(reducerHelper.state).toEqual(-1);
        });
    });

    describe('handle SELECT_BOX', () => {
        test('return the id of the box', () => {
            let randomBox = reducerHelper.getBox();
            reducerHelper.call({ type: SELECT_BOX, payload: { id: randomBox } });
            expect(reducerHelper.state).toEqual(randomBox);
        });
    });

    describe('handle SELECT_CONTAINED_VIEW', () => {
        test('always return -1', () => {
            reducerHelper.call({ type: DELETE_BOX, payload: { id: reducerHelper.getBox(), parent: reducerHelper.getSortableBox(), container: reducerHelper.getContainedView() } });
            reducerHelper.call({ type: SELECT_CONTAINED_VIEW });
            expect(reducerHelper.state).toEqual(-1);
        });
    });

    describe('handle SELECT_NAV_ITEM', () => {
        test('always return -1', () => {
            reducerHelper.call({ type: DELETE_BOX, payload: { id: reducerHelper.getBox(), parent: reducerHelper.getSortableBox(), container: reducerHelper.getContainedView() } });
            reducerHelper.call({ type: SELECT_NAV_ITEM });
            expect(reducerHelper.state).toEqual(-1);
        });
    });

    describe('handle IMPORT_STATE', () => {
        test('return the present box', () => {
            let randomBox = reducerHelper.getBox();
            reducerHelper.call({ type: IMPORT_STATE, payload: { present: { boxSelected: randomBox } } });
            expect(reducerHelper.state).toEqual(-1);
        });

        test('return the current state', () => {
            let randomBox = reducerHelper.getBox();
            reducerHelper.set(randomBox);
            reducerHelper.call({ type: IMPORT_STATE, payload: { present: {} } });
            expect(reducerHelper.state).toEqual(-1);
        });
    });

});
