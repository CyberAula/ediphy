import { testState } from '../../core/store/state.tests.js';
import boxes_by_id from '../boxes_by_id';
import * as ActionTypes from '../../common/actions';

const state = testState.present.boxesById;
// new box to add
const createdbox = {
    id: 'bo-1511443052925', parent: '', container: '', level: 0, col: 0, row: 0,
    position: { x: 0, y: 0, type: '' },
    content: "", draggable: true,
    resizable: false, showTextEditor: false, fragment: {}, children: [], sortableContainers: {}, containedViews: [],
};

// sortable container modified
const modifiedsortable = {
    id: 'bs-1511252985426',
    parent: 'pa-1511252985426',
    container: 0,
    level: -1,
    col: 0,
    row: 0,
    position: { x: 0, y: 0, type: 'relative' },
    draggable: false,
    resizable: false,
    showTextEditor: false,
    fragment: {},
    children: ["sc-1511443052922"],
    sortableContainers: {
        "sc-1511443052922": {
            "children": ["bo-1511443052925"],
            "colDistribution": [100],
            "cols": [[100]],
            "height": "auto",
            "key": "",
            "style": {
                "borderColor": "#ffffff",
                "borderStyle": "solid",
                "borderWidth": "0px",
                "className": "",
                "opacity": "1",
                "padding": "0px",
                "textAlign": "center",
            },
        },
    },
    containedViews: [],
};
// console.log(state);

describe('# boxes_by_id reducer ******************************************************************* DOING :)', ()=>{

    describe('DEFAULT', ()=>{
        test('Should return test.state as default', () => {
            expect(boxes_by_id(state, {})).toEqual(state);
        });
    });

    describe('handle ADD_BOX', ()=>{

        test('If added box is contained in sortableContainer (if is in a document)', () => {
            createdbox.container = 'sc-1511443052922';
            createdbox.parent = 'bs-1511252985426';
            createdbox.position.type = 'relative';
            createdbox.resizable = false;

            const action = {
                type: ActionTypes.ADD_BOX,
                payload: { ids:
                    { parent: 'bs-1511252985426', id: 'bo-1511443052925', container: 'sc-1511443052922' },
                draggable: true,
                resizable: false,
                content: '',
                toolbar: {},
                config: {},
                state: {},
                initialParams: {},
                },
            };

            const newstate = Object.assign({}, state);

            // state modications
            newstate['bs-1511252985426'] = modifiedsortable;
            newstate['bo-1511443052925'] = createdbox;

            expect(action.payload.ids.container != 0).toBeTruthy;
            expect(boxes_by_id(state, action)).toEqual(newstate);

        });
        test('If added box in a slide', () => {
            // new box to add

            createdbox.container = '0';
            createdbox.parent = 'pa-1511252955865';
            createdbox.position.type = 'absolute';
            createdbox.resizable = true;

            const action = {
                type: ActionTypes.ADD_BOX,
                payload: { ids:
                    { parent: 'pa-1511252955865', id: 'bo-1511443052925', container: '0' },
                draggable: true,
                resizable: true,
                content: '',
                toolbar: {},
                config: {},
                state: {},
                initialParams: {},
                },
            };
            const newstate = Object.assign({}, state);
            newstate['bo-1511443052925'] = createdbox;
            expect(boxes_by_id(state, action)).toEqual(newstate);
        });
    });

    describe('handle MOVE_BOX', ()=>{
        test('If box moved', () => {
            const action = {
                type: ActionTypes.MOVE_BOX,
                payload: {
                    id: 'bo-1511252970033',
                    x: '29.425837320574164%',
                    y: '29.26829268292683%',
                    position: 'absolute',
                    parent: 'pa-1511252955865',
                    container: 0,
                },
            };

            const newstate = Object.assign({}, state);
            newstate['bo-1511252970033'].position.x = action.payload.x;
            newstate['bo-1511252970033'].position.y = action.payload.y;

            // console.log(state['bo-1511252970033']);

            expect(boxes_by_id(state, action)).toEqual(newstate);
        });
    });

    describe('handle DUPLICATE_BOX  ********************************************************** TODO', ()=>{
        test('If duplicated box', () => {
            // expect(boxes_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle RESIZE_SORTABLE_CONTAINER', ()=>{
        test('If resized sortable container', () => {
            const action = {
                type: ActionTypes.RESIZE_SORTABLE_CONTAINER,
                payload: {
                    id: 'sc-1511443052922',
                    parent: 'bs-1511252985426',
                    height: 500,
                },
            };
            // needed because de test.state hasn't a sortable defined
            const statewithsortable = Object.assign({}, state);
            statewithsortable['bs-1511252985426'] = modifiedsortable;

            const newstate = Object.assign({}, statewithsortable);
            newstate['bs-1511252985426'].sortableContainers['sc-1511443052922'].height = action.payload.height;

            expect(boxes_by_id(statewithsortable, action)).toEqual(newstate);
        });
    });

    describe('handle UPDATE_BOX ********************************************************** TODO', ()=>{
        test('If updated box', () => {
            // expect(boxes_by_id(state, {})).toEqual(state);
        });
    });
    // return changeProp(state, action.payload.id, boxReducer(state[action.payload.id], action));

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
