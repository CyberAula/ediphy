import { testState } from '../../core/store/state.tests.js';
import boxes_by_id from '../boxes_by_id';
import * as ActionTypes from '../../common/actions';
import { CHANGE_SORTABLE_PROPS } from "../../common/actions";
import { changeProp, changeProps, deleteProps, isSortableContainer } from "../../common/utils";
import { DROP_BOX } from "../../common/actions";
import { CHANGE_COLS } from "../../common/actions";
import { CHANGE_ROWS } from "../../common/actions";
import { DELETE_BOX } from "../../common/actions";

const state = testState.present.boxesById;
// new box to add
const createdbox = {
    id: 'bo-1511443052929', parent: '', container: '', level: 0, col: 0, row: 0,
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
            "children": ["bo-1511443052925", "bo-1511443052967", "bo-1511443052929"],
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

describe('# boxes_by_id reducer ******************************************************************* DOING :)', () => {

    describe('DEFAULT', ()=>{
        test('Should return test.state as default', () => {
            expect(boxes_by_id(state, {})).toEqual(state);
        });
    });

    describe('handle ADD_BOX', () => {

        test('If added box is contained in sortableContainer (if is in a document)', () => {
            createdbox.container = 'sc-1511443052922';
            createdbox.parent = 'bs-1511252985426';
            createdbox.position.type = 'relative';
            createdbox.resizable = false;

            const action = {
                type: ActionTypes.ADD_BOX,
                payload: { ids:
                    { parent: 'bs-1511252985426', id: 'bo-1511443052929', container: 'sc-1511443052922' },
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
            newstate['bo-1511443052929'] = createdbox;

            expect(action.payload.ids.container !== 0).toBeTruthy;
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
                    { parent: 'pa-1511252955865', id: 'bo-1511443052929', container: '0' },
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
            newstate['bo-1511443052929'] = createdbox;
            expect(boxes_by_id(state, action)).toEqual(newstate);
        });
    });

    describe('handle MOVE_BOX', () => {
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

            expect(boxes_by_id(state, action)).toEqual(newstate);
        });
    });

    describe('handle DUPLICATE_BOX  **************************************** TODO copy & paste', () => {
        test.skip('If duplicated box', () => {
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

    describe('handle UPDATE_BOX ******************************************** TODO plugin inside plugin', ()=>{
        test.skip('If box updated', () => {
            const action = {
                type: ActionTypes.UPDATE_BOX,
                payload: {
                    id: 'bo-1511252970033',
                    content: '',
                    toolbar: {},
                    state: { url: 'http://vishub.org/pictures/1608.jpg' },
                },
            };
            // expect(boxes_by_id(state, action)).toEqual(state);
        });
    });

    describe('handle ADD_RICH_MARK', ()=>{
        // 4 diferent cases
        test('If rich mark added & connected to an external content', () => {
            const action = {
                type: ActionTypes.ADD_RICH_MARK,
                payload: {
                    parent: 'bo-1511252970033',
                    mark: { id: "rm-1511786135103",
                        title: "new mark",
                        connectMode: "external",
                        connection: "http://ging.github.io/ediphy/#/",
                        displayMode: "navigate",
                        value: "30.95,49.15",
                        color: "#222222" },
                    state: {},
                },
            };
            expect(boxes_by_id(state, {})).toEqual(state);
        });
        test('If rich mark added & connected to an existing page (not a contained view)', () => {
            const action = {
                type: ActionTypes.ADD_RICH_MARK,
                payload: {
                    parent: 'bo-1511252970033',
                    mark: { id: "rm-1511786135103",
                        title: "new mark",
                        connectMode: "existing",
                        connection: "pa-1497983247795",
                        displayMode: "navigate",
                        value: "30.95,49.15",
                        color: "#222222" },
                    state: {},
                },
            };
            expect(boxes_by_id(state, action)).toEqual(state);
        });

        test('If rich mark added and connected to a new contained view', () => {
            const action = {
                type: ActionTypes.ADD_RICH_MARK,
                payload: {
                    parent: 'bo-1511252970033',
                    mark: { id: "rm-1511786135103",
                        title: "new mark",
                        connectMode: "new",
                        connection: { id: "cv-1511789732970" },
                        displayMode: "navigate",
                        value: "30.95,49.15",
                        color: "#222222" },
                    state: {},
                },
            };
            const newstate = Object.assign({}, state, {
                ['bo-1511252970033']: Object.assign({}, state['bo-1511252970033'], { "containedViews": ['cv-1511252975055', action.payload.mark.connection.id] }),
            });

            expect(boxes_by_id(state, action)).toEqual(newstate);
        });

        test('If rich mark added and connected to an existing contained view', () => {
            const action = {
                type: ActionTypes.ADD_RICH_MARK,
                payload: {
                    parent: 'bo-1511252970033',
                    mark: { id: "rm-1511786135103",
                        title: "new mark",
                        connectMode: "existing",
                        connection: "cv-1511789732970",
                        displayMode: "navigate",
                        value: "30.95,49.15",
                        color: "#222222" },
                    state: {},
                },
            };
            const newstate = Object.assign({}, state, {
                ['bo-1511252970033']: Object.assign({}, state['bo-1511252970033'], { "containedViews": ['cv-1511252975055', action.payload.mark.connection] }),
            });

            expect(boxes_by_id(state, action)).toEqual(newstate);
        });
    });

    describe('handle REORDER_BOXES', () => {
        test('If boxes reordered in a sortable container', () => {
            const action = {
                type: ActionTypes.REORDER_BOXES,
                payload: {
                    parent: 'bs-1511252985426',
                    container: 'sc-1511443052922',
                    order: ['bo-1511443052967', 'bo-1511443052925'],
                },
            };

            const newState = JSON.parse(JSON.stringify(state));
            newState['bs-1511252985426'].sortableContainers['sc-1511443052922'].children = action.payload.order;
            expect(boxes_by_id(state, action)).toEqual(newState);
        });
    });

    describe('handle CHANGE_SORTABLE_PROPS', () => {
        test('If sortable container props updated', () => {
            const action = {
                type: ActionTypes.CHANGE_SORTABLE_PROPS,
                payload: {
                    id: 'sc-1511443052922',
                    parent: 'bs-1511252985426',
                    prop: 'borderWidth',
                    value: '2px',
                },
            };
            const newState = JSON.parse(JSON.stringify(state));
            newState['bs-1511252985426'].sortableContainers['sc-1511443052922'].style[action.payload.prop] = action.payload.value;
            expect(boxes_by_id(state, action)).toEqual(newState);
        });
    });

    describe('handle CHANGE_COLS  ********** TODO (remove columns ex. 3 -> 2)', () => {
        test('If number of cols changed in a sortable container (add)', () => {
            const action = {
                type: ActionTypes.CHANGE_COLS,
                payload: {
                    id: 'sc-1511443052922',
                    parent: 'bs-1511252985426',
                    distribution: [50, 50],
                    boxesAffected: ['bo-1511443052925', 'bo-1511443052967'],

                },
            };
            const newState = JSON.parse(JSON.stringify(state));
            newState['bs-1511252985426'].sortableContainers['sc-1511443052922'].colDistribution = action.payload.distribution;
            newState['bs-1511252985426'].sortableContainers['sc-1511443052922'].cols = [[100], [100]];
            expect(boxes_by_id(state, action)).toEqual(newState);
        });
    });

    describe('handle CHANGE_ROWS (remove rows ex. 2 -> 1)', () => {
        test('If number of rows changed in a sortable container (add)', () => {
            const action = {
                type: ActionTypes.CHANGE_ROWS,
                payload: {
                    id: 'sc-1511443052922',
                    parent: 'bs-1511252985426',
                    column: 0,
                    distribution: [50, 50],
                    boxesAffected: ['bo-1511443052925', 'bo-1511443052967'],
                },
            };
            const newState = JSON.parse(JSON.stringify(state));
            newState['bs-1511252985426'].sortableContainers['sc-1511443052922'].cols[action.payload.column] = action.payload.distribution;
            expect(boxes_by_id(state, action)).toEqual(newState);
        });
    });

    describe('handle DROP_BOX', () => {
        test('If box dropped between columns', () => {
            const action = {
                type: ActionTypes.DROP_BOX,
                payload: {
                    id: 'bo-1511443052925',
                    row: 0,
                    col: 1,
                },
            };
            const newState = JSON.parse(JSON.stringify(state));
            newState['bo-1511443052925'].col = action.payload.col;
            newState['bo-1511443052925'].row = action.payload.row;

            expect(boxes_by_id(state, action)).toEqual(newState);
        });
    });

    describe('handle DELETE_BOX', () => {
        test('If box deleted is in a sortable container', () => {
            const action = {
                type: ActionTypes.DELETE_BOX,
                payload: {
                    id: 'bo-1511443052925',
                    parent: 'bs-1511252985426',
                    container: 'sc-1511443052922',
                    children: [],
                    cvs: [],
                },
            };
            const newState = JSON.parse(JSON.stringify(state));
            delete newState['bo-1511443052925'];
            newState['bs-1511252985426'].sortableContainers['sc-1511443052922'].children = ['bo-1511443052967'];

            expect(isSortableContainer(action.payload.container)).toBeTruthy();
            expect(boxes_by_id(state, action)).toEqual(newState);
        });
        test('If box deleted is in a slide', () => {
            const action = {
                type: ActionTypes.DELETE_BOX,
                payload: {
                    id: 'bo-1511252970033',
                    parent: 'pa-1511252955865',
                    container: 0,
                    children: [],
                    cvs: [],
                },
            };
            const newState = JSON.parse(JSON.stringify(state));

            delete newState['bo-1511252970033'];
            expect(boxes_by_id(state, action)).toEqual(newState);
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
