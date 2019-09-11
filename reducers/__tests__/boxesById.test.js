import boxes_by_id from '../boxes/boxesById';
import * as ActionTypes from '../../common/actions';
import { isSortableContainer } from "../../common/utils";

const state = {
    "bs-1": {
        "id": "bs-1",
        "parent": "pa-1",
        "container": 0,
        "level": -1,
        "col": 0,
        "row": 0,
        "position": {
            "x": 0,
            "y": 0,
            "type": "relative",
        },
        "draggable": false,
        "resizable": false,
        "showTextEditor": false,
        "fragment": {},
        "children": [
            "sc-1",
        ],
        "sortableContainers": {
            "sc-1": {
                "children": [
                    "bo-1",
                ],
                "style": {
                    "padding": "0px",
                    "borderColor": "#ffffff",
                    "borderWidth": "0px",
                    "borderStyle": "solid",
                    "opacity": "1",
                    "textAlign": "center",
                    "className": "",
                },
                "height": "auto",
                "key": "sc-1",
                "colDistribution": [
                    50, 50,
                ],
                "cols": [
                    [
                        [100],
                        [100],
                    ],
                ],
            },
        },
        "containedViews": [],
    },
    "bo-1": {
        "id": "bo-1",
        "parent": "bs-1",
        "container": "sc-1",
        "level": 0,
        "col": 0,
        "row": 0,
        "position": {
            "x": 0,
            "y": 0,
            "type": "relative",
        },
        "content": {
            "type": "div",
            "key": null,
            "ref": null,
            "props": {
                "className": "dropableRichZone",
                "style": {
                    "height": "100%",
                },
                "children": [
                    {
                        "type": "img",
                        "key": null,
                        "ref": null,
                        "props": {
                            "className": "basicImageClass",
                            "style": {
                                "height": "100%",
                                "width": "100%",
                            },
                            "src": "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDIyLjAuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkNhcGFfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiCgkgdmlld0JveD0iMCAwIDU5OS4zIDQ1MC45IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1OTkuMyA0NTAuOTsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8c3R5bGUgdHlwZT0idGV4dC9jc3MiPgoJLnN0MHtmaWxsOiNDOEM4Qzg7fQoJLnN0MXtmaWxsOiM0OTQ5NDk7fQo8L3N0eWxlPgo8cmVjdCB4PSItMC40IiB5PSIwLjQiIGNsYXNzPSJzdDAiIHdpZHRoPSI2MDAiIGhlaWdodD0iNDUwIi8+CjxnPgoJPHBhdGggY2xhc3M9InN0MSIgZD0iTTI5OS42LDI4OC40Yy0yNCwwLTQ4LTAuMS03MiwwLjFjLTMuOSwwLTUuMS0xLTUuMS01YzAuMS0zOC43LDAuMS03Ny4zLDAtMTE2YzAtNCwxLjItNS4xLDUuMS01LjEKCQljNDgsMC4xLDk2LDAuMSwxNDMuOSwwYzMuOSwwLDUuMSwxLDUuMSw1Yy0wLjEsMzguNy0wLjEsNzcuMywwLDExNmMwLDQtMS4yLDUuMS01LjEsNUMzNDcuNiwyODguMywzMjMuNiwyODguNCwyOTkuNiwyODguNHoKCQkgTTI5OS42LDE3Mi41Yy0yMC41LDAtNDEsMC4xLTYxLjQtMC4xYy00LjQsMC01LjYsMS4xLTUuNiw1LjZjMC4yLDMxLjYsMC4yLDYzLjMsMCw5NC45YzAsNC4zLDEsNS43LDUuNSw1LjcKCQljNDEuMS0wLjIsODIuMy0wLjIsMTIzLjQsMGM0LjEsMCw1LjQtMS4xLDUuNC01LjNjLTAuMi0zMS44LTAuMi02My42LDAtOTUuNGMwLTQuNy0xLjYtNS41LTUuOC01LjQKCQlDMzQwLjUsMTcyLjYsMzIwLDE3Mi41LDI5OS42LDE3Mi41eiIvPgoJPHBhdGggY2xhc3M9InN0MSIgZD0iTTMxOC40LDIxMi44Yy0yLjYsNy43LTUuMywxNS4zLTcuNywyM2MtMC45LDMtMi4yLDUuMS01LjUsNS41Yy0wLjIsMC0wLjMsMC4xLTAuNSwwLjEKCQljLTE2LjUsMy42LTMwLjMsMTEuNC00MC43LDI0LjljLTIuNywzLjYtNi40LDIuOS0xMCwyLjljLTEyLjQsMC0xMi40LDAtMTIuNC0xMi40YzAtMjIuOCwwLjEtNDUuNi0wLjEtNjguNWMwLTQuNywxLTYuMyw2LTYuMgoJCWMzNC44LDAuMiw2OS42LDAuMiwxMDQuNCwwYzQuOCwwLDUuOCwxLjYsNS43LDZjLTAuMiwyNS0wLjEsNTAtMC4xLDc1YzAsMiwxLDQuOS0xLjcsNS43Yy0yLjksMC44LTYuNCwxLjYtOS0wLjkKCQljLTQuNy00LjQtOS4zLTguNy0xMS4yLTE1LjRjLTMuNS0xMi4zLTcuNC0yNC42LTEzLjktMzUuN0MzMjEsMjE1LjUsMzIwLjksMjEzLjYsMzE4LjQsMjEyLjh6IE0yNzUuNiwyMjAuNQoJCWM4LjYsMCwxNC01LjQsMTQuMS0xMy45YzAtOC42LTUuMy0xNC4xLTEzLjgtMTQuMmMtOC44LTAuMS0xNC4zLDUuNC0xNC4zLDE0LjFDMjYxLjYsMjE1LDI2Ny4xLDIyMC40LDI3NS42LDIyMC41eiIvPgo8L2c+Cjwvc3ZnPgo=",
                        },
                        "_owner": null,
                        "_store": {},
                    },
                    [],
                ],
            },
            "_owner": null,
            "_store": {},
        },
        "draggable": true,
        "resizable": false,
        "showTextEditor": false,
        "fragment": {},
        "children": [],
        "sortableContainers": {},
        "containedViews": [
            "cv-2",
        ],
    },
    "bs-2": {
        "parent": "cv-2",
        "id": "bs-2",
        "container": 0,
        "level": -1,
        "col": 0,
        "row": 0,
        "position": {
            "type": "relative",
            "x": 0,
            "y": 0,
        },
        "draggable": false,
        "resizable": false,
        "showTextEditor": false,
        "fragment": {},
        "children": [],
        "sortableContainers": {
            "sc-2": {
                "children": [
                    "bo-1",
                ],
                "style": {
                    "padding": "0px",
                    "borderColor": "#ffffff",
                    "borderWidth": "0px",
                    "borderStyle": "solid",
                    "opacity": "1",
                    "textAlign": "center",
                    "className": "",
                },
                "height": "auto",
                "key": "sc-1",
                "colDistribution": [
                    50, 50,
                ],
                "cols": [
                    [
                        [100],
                        [100],
                    ],
                ],
            },
        },
        "containedViews": [],
    },
};
// new box to add
const createdbox = {
    id: 'bo-4', parent: '', container: '', level: 0, col: 0, row: 0,
    position: { x: 0, y: 0, type: '' },
    content: {}, draggable: true,
    resizable: false, showTextEditor: false, fragment: {}, children: [], sortableContainers: {}, containedViews: [],
};

describe('# boxes_by_id reducer', () => {
    describe('DEFAULT', () => {
        test('Should return test.state as default', () => {
            expect(boxes_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle ADD_BOX', () => {
        test('If added box in an existing sortableContainer (if is in a document)', () => {
            createdbox.container = 'sc-1';
            createdbox.parent = 'bs-1';
            createdbox.position.type = 'relative';
            createdbox.resizable = false;

            const action = {
                type: ActionTypes.ADD_BOX,
                payload: {
                    ids:
                        { parent: 'bs-1', id: 'bo-4', container: 'sc-1' },
                    draggable: true,
                    resizable: false,
                    content: '',
                    toolbar: {},
                    config: {},
                    state: {},
                    initialParams: {},
                },
            };

            const newState = JSON.parse(JSON.stringify(state));

            // state modications
            newState['bs-1'].sortableContainers['sc-1'].children = ["bo-1", "bo-4"];
            newState['bo-4'] = createdbox;

            expect(action.payload.ids.container !== 0).toBeTruthy();
            expect(boxes_by_id(state, action)).toEqual(newState);
        });
        test('If added box in a slide', () => {
            // new box to add
            createdbox.container = '0';
            createdbox.parent = 'pa-7';
            createdbox.position.type = 'absolute';
            createdbox.resizable = true;

            const action = {
                type: ActionTypes.ADD_BOX,
                payload: {
                    ids:
                        { parent: 'pa-7', id: 'bo-4', container: '0' },
                    draggable: true,
                    resizable: true,
                    content: '',
                    toolbar: {},
                    config: {},
                    state: {},
                    initialParams: {},
                },
            };
            const newstate = { ...state };
            newstate['bo-4'] = createdbox;
            expect(boxes_by_id(state, action)).toEqual(newstate);
        });
    });
    describe('handle MOVE_BOX', () => {
        test('If box moved', () => {
            const action = {
                type: ActionTypes.MOVE_BOX,
                payload: {
                    id: 'bo-1',
                    x: '29.42%',
                    y: '29.26%',
                    position: 'relative',
                    parent: 'pa-1511252955865',
                    container: 0,
                },
            };

            const newstate = JSON.parse(JSON.stringify(state));
            newstate['bo-1'].position.x = action.payload.x;
            newstate['bo-1'].position.y = action.payload.y;

            expect(boxes_by_id(state, action)).toEqual(newstate);
        });
    });
    describe('handle RESIZE_SORTABLE_CONTAINER', () => {
        test('If resized sortable container', () => {
            const action = {
                type: ActionTypes.RESIZE_SORTABLE_CONTAINER,
                payload: {
                    id: 'sc-1',
                    parent: 'bs-1',
                    height: 500,
                },
            };

            const newState = JSON.parse(JSON.stringify(state));
            newState['bs-1'].sortableContainers['sc-1'].height = action.payload.height;

            expect(boxes_by_id(state, action)).toEqual(newState);
        });
    });
    describe('handle ADD_RICH_MARK', () => {
        // 4 diferent cases
        test('If rich mark added & connected to an external content', () => {
            expect(boxes_by_id(state, {})).toEqual(state);
        });
        test('If rich mark added & connected to an existing page (not a contained view)', () => {
            const action = {
                type: ActionTypes.ADD_RICH_MARK,
                payload: {
                    mark: {
                        id: "rm-1",
                        origin: "bo-1",
                        title: "new mark",
                        connectMode: "existing",
                        connection: "pa-1",
                        displayMode: "navigate",
                        value: "30.95,49.15",
                        color: "#222222",
                    },
                    view: {
                        id: "pa-1",
                    },
                },
            };
            const newState = JSON.parse(JSON.stringify(state));

            expect(boxes_by_id(state, action)).toEqual(newState);
        });
        test('If rich mark added and connected to a new contained view', () => {
            const action = {
                type: ActionTypes.ADD_RICH_MARK,
                payload: {
                    parent: 'bo-1',
                    mark: {
                        id: "rm-1",
                        origin: "bo-1",
                        title: "new mark",
                        connectMode: "new",
                        connection: "cv-1",
                        displayMode: "navigate",
                        value: "30.95,49.15",
                        color: "#222222",
                    },
                    view: {
                        id: "cv-1",
                    },
                },
            };
            const newState = JSON.parse(JSON.stringify(state));
            newState["bo-1"].containedViews = ["cv-2", "cv-1"];

            expect(boxes_by_id(state, action)).toEqual(newState);
        });
        test('If rich mark added and connected to an existing contained view', () => {
            const action = {
                type: ActionTypes.ADD_RICH_MARK,
                payload: {
                    parent: 'bo-1',
                    mark: {
                        id: "rm-1",
                        origin: "bo-1",
                        title: "new mark",
                        connectMode: "existing",
                        connection: "cv-1",
                        displayMode: "navigate",
                        value: "30.95,49.15",
                        color: "#222222",
                    },
                    view: {
                        id: "cv-1",
                    },
                },
            };
            const newState = JSON.parse(JSON.stringify(state));
            newState["bo-1"].containedViews = ["cv-2", "cv-1"];

            expect(boxes_by_id(state, action)).toEqual(newState);
        });
    });
    describe('handle REORDER_BOXES', () => {
        test('If boxes reordered in a sortable container', () => {
            const action = {
                type: ActionTypes.REORDER_BOXES,
                payload: {
                    parent: 'bs-1',
                    container: 'sc-1',
                    order: ['bo-1', 'bo-2'],
                },
            };

            const newState = JSON.parse(JSON.stringify(state));
            newState["bs-1"].sortableContainers["sc-1"].children = ["bo-1", "bo-2"];
            expect(boxes_by_id(state, action)).toEqual(newState);
        });
    });
    describe('handle CHANGE_SORTABLE_PROPS', () => {
        test('If sortable container props updated', () => {
            const action = {
                type: ActionTypes.CHANGE_SORTABLE_PROPS,
                payload: {
                    id: 'sc-1',
                    parent: 'bs-1',
                    prop: 'borderWidth',
                    value: '2px',
                },
            };
            const newState = JSON.parse(JSON.stringify(state));
            newState['bs-1'].sortableContainers['sc-1'].style[action.payload.prop] = action.payload.value;
            expect(boxes_by_id(state, action)).toEqual(newState);
        });
    });
    describe('handle CHANGE_COLS  ********** TODO (remove columns ex. 3 -> 2)', () => {
        test('If number of cols changed in a sortable container (add)', () => {
            const action = {
                type: ActionTypes.CHANGE_COLS,
                payload: {
                    id: 'sc-1',
                    parent: 'bs-1',
                    distribution: [50, 50],
                    boxesAffected: [],

                },
            };
            const newState = JSON.parse(JSON.stringify(state));
            newState['bs-1'].sortableContainers['sc-1'].colDistribution = action.payload.distribution;
            newState['bs-1'].sortableContainers['sc-1'].cols = [[[100], [100]], [100]];
            expect(boxes_by_id(state, action)).toEqual(newState);
        });
    });
    describe('handle CHANGE_ROWS ********** TODO (remove rows ex. 2 -> 1)', () => {
        test('If number of rows changed in a sortable container (add)', () => {
            const action = {
                type: ActionTypes.CHANGE_ROWS,
                payload: {
                    id: 'sc-1',
                    parent: 'bs-1',
                    column: 0,
                    distribution: [50, 50],
                    boxesAffected: [],
                },
            };
            const newState = JSON.parse(JSON.stringify(state));
            newState['bs-1'].sortableContainers['sc-1'].cols[action.payload.column] = action.payload.distribution;
            expect(boxes_by_id(state, action)).toEqual(newState);
        });
    });
    describe('handle DROP_BOX', () => {
        test('If box dropped between columns', () => {
            const action = {
                type: ActionTypes.DROP_BOX,
                payload: {
                    id: 'bo-1',
                    row: 0,
                    col: 0,
                    container: 'sc-1',
                    parent: 'bs-1',
                    oldParent: 'bs-1',
                    oldContainer: 'sc-1',
                    index: 1,
                },
            };
            const newState = JSON.parse(JSON.stringify(state));
            newState['bo-1'].col = action.payload.col;
            // newState['bo-5'].row = action.payload.row;
            expect(boxes_by_id(state, action)).toEqual(newState);
        });
        test('If box dropped from one sc to another in the same Sortable box', ()=> {
            const action = {
                type: ActionTypes.DROP_BOX,
                payload: {
                    id: 'bo-1',
                    row: 0,
                    col: 0,
                    container: 'sc-2',
                    parent: 'bs-2',
                    oldParent: 'bs-1',
                    oldContainer: 'sc-1',
                    index: 1,
                },
            };
            const newState = JSON.parse(JSON.stringify(state));
            newState['bo-1'].container = "sc-2";
            newState['bo-1'].parent = "bs-2";
            newState['bs-2'].sortableContainers["sc-2"].children = ["bo-1"];
            newState['bs-1'].sortableContainers["sc-1"].children = [];
            expect(boxes_by_id(state, action)).toEqual(newState);
        });
        // TODO Plugins inside plugins
    });
    describe('handle DELETE_BOX', () => {
        test('If box deleted is in a sortable container', () => {
            const action = {
                type: ActionTypes.DELETE_BOX,
                payload: {
                    id: 'bo-1',
                    parent: 'bs-1',
                    container: 'sc-1',
                    children: [],
                    cvs: [],
                },
            };
            const newState = JSON.parse(JSON.stringify(state));
            delete newState['bo-1'];
            newState['bs-1'].sortableContainers['sc-1'].children = [];

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
    describe('handle DELETE_CONTAINED_VIEW TODO*', () => {
        test('If contained view deleted', () => {
            const action = {
                type: ActionTypes.DELETE_CONTAINED_VIEW,
                payload: {
                    ids: ['cv-1'],
                    boxes: [],
                    parent: { "bo-1511252970033": ["rm-1511252975055"] },
                },
            };
            const newState = JSON.parse(JSON.stringify(state));
            expect(boxes_by_id(state, action)).toEqual(newState);
        });
    });
    describe('handle DELETE_SORTABLE_CONTAINER', () => {
        test('If sortable container with 2 boxes deleted', () => {
            const action = {
                type: ActionTypes.DELETE_SORTABLE_CONTAINER,
                payload: {
                    id: 'sc-1',
                    parent: 'bs-1',
                    children: ["bo-1", "bo-2"],
                    cvs: '',
                },
            };
            const newState = JSON.parse(JSON.stringify(state));
            // delete content (children boxes)
            delete newState['bo-1'];
            delete newState['bo-2'];
            // delete sortable from page
            delete newState['bs-1'].sortableContainers['sc-1'];
            newState['bs-1'].children = [];

            expect(boxes_by_id(state, action)).toEqual(newState);
        });
    });
    describe('handle DELETE_NAV_ITEM', () => {
        test('If nav item with a box inside deleted', () => {
            const action = {
                type: ActionTypes.DELETE_NAV_ITEM,
                payload: {
                    ids: ['pa-1511252955865'],
                    parent: 'se-1511252954307',
                    boxes: ['bo-1511252970033'],
                    containedViews: {},
                    linkedBoxes: {},
                },
            };
            const newState = JSON.parse(JSON.stringify(state));
            delete newState['bo-1511252970033'];
            expect(boxes_by_id(state, action)).toEqual(newState);
        });
    });
    describe('handle REORDER_SORTABLE_CONTAINER', () => {
        test('If sortable container reordered', () => {
            const action = {
                type: ActionTypes.REORDER_SORTABLE_CONTAINER,
                payload: {
                    ids: ['sc-1511443052923', 'sc-1'],
                    parent: 'bs-1',
                },
            };
            const newState = JSON.parse(JSON.stringify(state));
            newState['bs-1'].children = action.payload.ids;
            expect(boxes_by_id(state, action)).toEqual(newState);
        });
    });
    // TODO: Error with contained view "cv-1511252975055"
    describe('handle PASTE_BOX', () => {
        // eslint-disable-next-line jest/no-disabled-tests
        test.skip('If box pasted to document', () => {

            const boxPasted = {
                "id": "bo-8",
                "parent": "bs-1",
                "container": "sc-1",
                "level": 0,
                "col": 0,
                "row": 0,
                "position": { "x": 0, "y": 0, "type": "relative" },
                "content": "",
                "draggable": true,
                "resizable": false,
                "showTextEditor": false,
                "fragment": {},
                "children": [],
                "sortableContainers": {},
                "containedViews": [],
            };
            const action = {
                type: ActionTypes.PASTE_BOX,
                payload: {
                    ids: { parent: 'bs-1', container: 'sc-1', id: 'bo-8' },
                    box: boxPasted,
                    toolbar: {},
                    children: {},
                },
            };
            let newState = JSON.parse(JSON.stringify(state));
            newState["bo-8"] = boxPasted;
            expect(boxes_by_id(state, action)).toEqual(newState);
        });

        test('If box pasted to slide', () => {

            const boxPasted = {
                "id": "bo-8",
                "parent": "cv-1511252975055",
                "container": 0,
                "level": 0,
                "col": 0,
                "row": 0,
                "position": { "x": "50%", "y": "50%", "type": "absolute" },
                "content": "",
                "draggable": true,
                "resizable": true,
                "showTextEditor": false,
                "fragment": {},
                "children": [],
                "sortableContainers": {},
                "containedViews": [],
            };
            const action = {
                type: ActionTypes.PASTE_BOX,
                payload: {
                    ids: { parent: "cv-1511252975055", container: 0, id: 'bo-1511868565135' },
                    box: boxPasted,
                    toolbar: {},
                    children: {},
                },

            };

            let newState = JSON.parse(JSON.stringify(state));
            newState["bo-1511868565135"] = boxPasted;
            expect(boxes_by_id(state, action)).toEqual(newState);
        });
    });
    describe('handle IMPORT_STATE', () => {
        test('If state imported', () => {
            const action = {
                type: ActionTypes.IMPORT_STATE,
                payload: {
                    present: {},
                },
            };
            expect(boxes_by_id(state, action)).toEqual(state);
        });
    });

});
