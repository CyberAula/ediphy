import { testState } from '../../core/store/state.tests.js';
import boxes_by_id from '../boxes_by_id';
import * as ActionTypes from '../../common/actions';

const state = testState.present.boxesById;

// console.log(state);

describe('# boxes_by_id reducer ******************************************************************* TODO :)', ()=>{

    describe('DEFAULT', ()=>{
        test('Should return test.state as default', () => {
            expect(boxes_by_id(state, {})).toEqual(state);
        });
    });

    describe('handle ADD_BOX', ()=>{
        test('If added box is contained in sortableContainer (if is in a document)', () => {
            const boxpayload = { ids: { parent: 'bs-1497983247797', id: 'bo-1511443052925', container: 'sc-1511443052922' }, draggable: true, resizable: false, content: '', toolbar: {}, config: {}, state: {}, initialParams: {} };
            const action = {
                type: ActionTypes.ADD_BOX,
                payload: { boxpayload },
            };
            const createdbox = {
                id: 'bo-1511443052925',
                parent: 'bs-1497983247797',
                container: 'sc-1511443052922',
                level: 0,
                col: 0,
                row: 0,
                position: { x: 0, y: 0, type: 'relative' },
                content: "",
                draggable: true,
                resizable: false,
                showTextEditor: false,
                fragment: {},
                children: [],
                sortableContainers: {},
                containedViews: [],
            };
            state['bo-1511443052925'] = createdbox;
            const newstate = state;
            expect(action.ids.container != 0).toBeTruthy;
            // expect(boxes_by_id(state, action)).toEqual(newstate);

        });
    });

    // case ADD_BOX:
    //         // if box is contained in sortableContainer, add it as well to its children
    //         if (isSortableContainer(action.payload.ids.container)) {
    //             return changeProps(
    //                 state,
    //                 [
    //                     action.payload.ids.id,
    //                     action.payload.ids.parent,
    //                 ], [
    //                     boxCreator(state, action),
    //                     boxReducer(state[action.payload.ids.parent], action),
    //                 ]
    //             );
    //         }
    //     return changeProp(state, action.payload.ids.id, boxCreator(state, action));
    //

    describe('handle MOVE_BOX', ()=>{
        test('If moved box', () => {
            // expect(boxes_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle DUPLICATE_BOX', ()=>{
        test('If duplicated box', () => {
            // expect(boxes_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle RESIZE_SORTABLE_CONTAINER', ()=>{
        test('If resized sortable container', () => {
            // expect(boxes_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle UPDATE_BOX', ()=>{
        test('If updated box', () => {
            // expect(boxes_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle ADD_RICH_MARK', ()=>{
        test('If rich mark added', () => {
            // expect(boxes_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle REORDER_BOXES', ()=>{
        test('If boxes reordered', () => {
            // expect(boxes_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle CHANGE_SORTABLE_PROPS', ()=>{
        test('If updated box', () => {
            // expect(boxes_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle DROP_BOX', ()=>{
        test('If box dropped', () => {
            // expect(boxes_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle CHANGE_COLS', ()=>{
        test('If cols changed', () => {
            // expect(boxes_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle CHANGE_ROWS', ()=>{
        test('If rows changed', () => {
            // expect(boxes_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle DELETE_BOX', ()=>{
        test('If box deleted', () => {
            // expect(boxes_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle DELETE_CONTAINED_VIEW', ()=>{
        test('If contained view deleted', () => {
            // expect(boxes_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle DELETE_SORTABLE_CONTAINER', ()=>{
        test('If sortable container deleted', () => {
            // expect(boxes_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle DELETE_NAV_ITEM', ()=>{
        test('If nav item deleted', () => {
            // expect(boxes_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle REORDER_SORTABLE_CONTAINER', ()=>{
        test('If cortable container reordered', () => {
            // expect(boxes_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle IMPORT_STATE', ()=>{
        test('If state imported', () => {
            // expect(boxes_by_id(state, {})).toEqual(state);
        });
    });
});

// case ADD_BOX:
//     // if box is contained in sortableContainer, add it as well to its children
//     if (isSortableContainer(action.payload.ids.container)) {
//         return changeProps(
//             state,
//             [
//                 action.payload.ids.id,
//                 action.payload.ids.parent,
//             ], [
//                 boxCreator(state, action),
//                 boxReducer(state[action.payload.ids.parent], action),
//             ]
//         );
//     }
// return changeProp(state, action.payload.ids.id, boxCreator(state, action));

// case MOVE_BOX:
//     return changeProp(state, action.payload.id, boxReducer(state[action.payload.id], action));

// case DUPLICATE_BOX:
//     // TODO
//     newState = Object.assign({}, state);
// let replaced = Object.assign({}, state);
// let newIds = action.payload.newIds;
// let newId = ID_PREFIX_BOX + action.payload.newId;
// // let count = 0;
// Object.keys(newIds).map(box => {
//     replaced = Object.replaceAll(replaced, box, newIds[box]);
// });
// replaced = Object.replaceAll(replaced, action.payload.id.substr(3), action.payload.newId);// split -
// let defState = Object.assign({}, newState, replaced);
// if (action.payload.container !== 0) {
//     replaced[action.payload.parent].sortableContainers[action.payload.container].children.push(action.payload.id);
// }
//
// return Object.assign({}, defState, {
//     [newId]: Object.assign({}, defState[newId], { position: { x: 0, y: 0, position: 'absolute' } }),
// });

// case RESIZE_SORTABLE_CONTAINER:
//     return changeProp(state, action.payload.parent, boxReducer(state[action.payload.parent], action));

// case UPDATE_BOX:
//     return changeProp(state, action.payload.id, boxReducer(state[action.payload.id], action));

// case ADD_RICH_MARK:
//     // If rich mark is connected to a new contained view, mark.connection will include this information;
//     // otherwise, it's just the id/url and we're not interested
//     if (action.payload.mark.connection.id || isContainedView(action.payload.mark.connection)) {
//         return changeProp(state, action.payload.parent, boxReducer(state[action.payload.parent], action));
//     }
// return state;
// case REORDER_BOXES:
//     return changeProp(state, action.payload.parent, boxReducer(state[action.payload.parent], action));
// case CHANGE_SORTABLE_PROPS:
//     return changeProp(state, action.payload.parent, boxReducer(state[action.payload.parent], action));
// case DROP_BOX:
//     return changeProp(state, action.payload.id, boxReducer(state[action.payload.id], action));
// case CHANGE_COLS:
//     newState = changeProp(state, action.payload.parent, boxReducer(state[action.payload.parent], action));
// action.payload.boxesAffected.forEach(id => {
//     newState = changeProp(newState, id, boxReducer(newState[id], action));
// });
// return newState;
// case CHANGE_ROWS:
//     newState = changeProp(state, action.payload.parent, boxReducer(state[action.payload.parent], action));
// action.payload.boxesAffected.forEach(id => {
//     newState = changeProp(newState, id, boxReducer(newState[id], action));
// });
// return newState;
// case DELETE_BOX:
//     let children = action.payload.children ? action.payload.children : [];
// let which_children = children.concat(action.payload.id);
// temp = deleteProps(state, children.concat(action.payload.id));
//
// // If box is in sortableContainer, delete from its children aswell
// if (isSortableContainer(action.payload.container)) {
//     return changeProp(temp, action.payload.parent, boxReducer(state[action.payload.parent], action));
// }
// return temp;
// case DELETE_CONTAINED_VIEW:
//     let newBoxes = Object.assign({}, state);
// Object.keys(action.payload.parent).forEach((el)=>{
//     if(newBoxes[el] && newBoxes[el].containedViews) {
//         let index = newBoxes[el].containedViews.indexOf(action.payload.ids[0]);
//         if(index > -1) {
//             newBoxes[el].containedViews.splice(index, 1);
//         }
//     }
// });
// return deleteProps(newBoxes, action.payload.boxes);
// case DELETE_SORTABLE_CONTAINER:
//     temp = deleteProps(state, action.payload.children);
// return changeProp(temp, action.payload.parent, boxReducer(state[action.payload.parent], action));
// case DELETE_NAV_ITEM:
//     // TODO: Delete linked marks
//     return deleteProps(state, action.payload.boxes);
// case REORDER_SORTABLE_CONTAINER:
//     return changeProp(state, action.payload.parent, boxReducer(state[action.payload.parent], action));
// case IMPORT_STATE:
//     return action.payload.present.boxesById || state;
// default:
// return state;
