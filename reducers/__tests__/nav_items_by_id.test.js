import nav_items_by_id from '../nav_items_by_id';
import * as ActionTypes from '../../common/actions';
import { isContainedView, isSortableContainer, isView, isSlide } from "../../common/utils";

const state = {
    "0": {
        "id": 0,
        "children": [
            "se-1",
        ],
        "boxes": [],
        "level": 0,
        "type": "",
        "hidden": false,
    },
    "se-1": {
        "id": "se-1",
        "isExpanded": true,
        "parent": 0,
        "linkedBoxes": {},
        "children": [
            "pa-1",
            "pa-2",
        ],
        "hidden": false,
        "boxes": [],
        "level": 1,
        "type": "section",
        "extraFiles": {},
        "customSize": 0,
    },
    "se-2": {
        "id": "se-2",
        "isExpanded": true,
        "parent": 0,
        "linkedBoxes": {},
        "children": [
        ],
        "hidden": false,
        "boxes": [],
        "level": 1,
        "type": "section",
        "extraFiles": {},
        "customSize": 0,
    },
    "pa-1": {
        "id": "pa-1",
        "isExpanded": true,
        "parent": "se-1",
        "linkedBoxes": {},
        "children": [],
        "boxes": [
            "bs-1",
        ],
        "level": 2,
        "type": "document",
        "hidden": false,
        "extraFiles": {},
        "customSize": 0,
    },
    "pa-2": {
        "id": "pa-2",
        "isExpanded": true,
        "parent": "se-1",
        "linkedBoxes": {},
        "children": [],
        "boxes": [
            "bs-3",
            "bo-4",
        ],
        "level": 2,
        "type": "slide",
        "hidden": false,
        "extraFiles": {},
        "customSize": 0,
    },
};

describe('# nav_items_by_id reducer', ()=>{
    describe('DEFAULT', ()=>{
        test('Should return test.state as default', () => {
            expect(nav_items_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle ADD_BOX', () => {
        test('If added box in a sortable container', () => {
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
            const newState = JSON.parse(JSON.stringify(state));
            expect(isView(action.payload.ids.parent)).toBeFalsy();
            expect(nav_items_by_id(state, action)).toEqual(newState);
        });
        test('If added box in a slide', () => {
            const action = {
                type: ActionTypes.ADD_BOX,
                payload: { ids:
                        { parent: 'pa-2', id: 'bo-3', container: 0 },
                draggable: true,
                resizable: true,
                content: '',
                toolbar: {},
                config: {},
                state: {},
                initialParams: {},
                },
            };
            const newState = JSON.parse(JSON.stringify(state));
            newState['pa-2'].boxes = ['bs-3', "bo-4", "bo-3"];

            expect(isView(action.payload.ids.parent)).toBeTruthy();
            expect(nav_items_by_id(state, action)).toEqual(newState);
        });
    });
    describe('handle MOVE_BOX', () => {
        test('If box moved in a slide', () => {
            const action = {
                type: ActionTypes.MOVE_BOX,
                payload: {
                    id: 'bo-1',
                    x: '29.42%',
                    y: '29.26%',
                    position: 'absolute',
                    parent: 'pa-1',
                    container: 0,
                },
            };
            const newState = JSON.parse(JSON.stringify(state));
            expect(nav_items_by_id(state, action)).toEqual(newState);
        });
    });
    describe('handle ADD_NAV_ITEM', () => {
        test('If nav item added is a section', () => {
            const action = {
                type: ActionTypes.ADD_NAV_ITEM,
                payload: {
                    id: 'se-2',
                    name: 'Sección',
                    parent: 'se-1',
                    type: 'section',
                    position: 4,
                    hasContent: false,
                },
            };
            const newState = JSON.parse(JSON.stringify(state));
            newState["se-1"].children = ["pa-1", "pa-2", "se-2"];
            newState["se-2"] = {
                "boxes": [],
                "children": [],
                "customSize": undefined,
                "extraFiles": {},
                "hidden": false,
                "id": "se-2",
                "isExpanded": true,
                "level": 2,
                "linkedBoxes": {},
                "parent": "se-1",
                "type": "section",
            };
            expect(nav_items_by_id(state, action)).toEqual(newState);
        });
        test('If nav item added is a document', () => {
            const action = {
                type: ActionTypes.ADD_NAV_ITEM,
                payload: {
                    id: 'pa-3',
                    name: 'Página',
                    parent: 'se-1',
                    sortable_id: "bs-5",
                    type: 'document',
                    position: 4,
                    hasContent: true,
                },
            };
            const newState = JSON.parse(JSON.stringify(state));
            newState["se-1"].children = newState["se-1"].children.slice().concat(["pa-3"]);
            newState["pa-3"] = {
                "boxes": ["bs-5"],
                "children": [],
                "customSize": undefined,
                "extraFiles": {},
                "hidden": false,
                "id": "pa-3",
                "isExpanded": true,
                "level": 2,
                "linkedBoxes": {},
                "parent": "se-1",
                "type": "document",
            };
            expect(nav_items_by_id(state, action)).toEqual(newState);
        });
    });
    describe('handle CHANGE_NAV_ITEM_BACKGROOUND', ()=>{
        test('If nav item background changed', () => {
            // expect(nav_items_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle CHANGE_UNIT_NUMBER', ()=>{
        test('If unit number changed', () => {
            // expect(nav_items_by_id(state, {})).toEqual(state);
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
            expect(isSortableContainer(action.payload.container)).toBeTruthy();
            expect(nav_items_by_id(state, action)).toEqual(newState);
        });
        test('If box deleted is in a slide', () => {
            const action = {
                type: ActionTypes.DELETE_BOX,
                payload: {
                    id: 'bo-4',
                    parent: 'pa-2',
                    container: 0,
                    children: [],
                    cvs: [],
                },
            };
            const newState = JSON.parse(JSON.stringify(state));
            newState['pa-2'].boxes = ["bs-3"];
            expect(nav_items_by_id(state, action)).toEqual(newState);
        });
    });
    describe('handle DELETE_SORTABLE_CONTAINER', () => {
        test('If sortable container deleted', () => {
            const action = {
                type: ActionTypes.DELETE_SORTABLE_CONTAINER,
                payload: {
                    id: 'sc-1511443052922',
                    parent: 'bs-1511252985426',
                    children: [],
                    cvs: {},
                },
            };
            const newState = JSON.parse(JSON.stringify(state));
            expect(nav_items_by_id(state, action)).toEqual(newState);
        });
    });
    describe('handle EXPAND_NAV_ITEM', () => {
        test('If nav item (SECTION) expanded', () => {
            const action = {
                type: ActionTypes.EXPAND_NAV_ITEM,
                payload: {
                    id: 'se-1',
                    value: false,
                },
            };
            const newState = JSON.parse(JSON.stringify(state));
            newState['se-1'].isExpanded = action.payload.value;
            expect(nav_items_by_id(state, action)).toEqual(newState);
        });
    });
    describe('handle DELETE_NAV_ITEM', () => {
        test('If nav item deleted', () => {
            const action = {
                type: ActionTypes.DELETE_NAV_ITEM,
                payload: {
                    ids: ['pa-1'],
                    parent: 'se-1',
                    boxes: ['bs-1'],
                    containedViews: {},
                    linkedBoxes: {},
                },
            };
            const newState = JSON.parse(JSON.stringify(state));
            // Prepare the newState
            delete newState[action.payload.ids];
            // This reducer
            newState[action.payload.parent].children = ["pa-2"];
            expect(nav_items_by_id(state, action)).toEqual(newState);
        });
    });
    describe('handle REORDER_NAV_ITEM', () => {
        test('If nav item reordered', () => {
            const action = {
                type: ActionTypes.REORDER_NAV_ITEM,
                payload: {
                    id: 'pa-1',
                    newParent: 'se-1',
                    oldParent: 'se-2',
                    idsInOrder: ["se-1", "se-2", "pa-1", "pa-2"],
                    childrenInOrder: ["pa-1"],
                },
            };
            const newState = JSON.parse(JSON.stringify(state));
            newState["se-1"].children = ["pa-1"];
            expect(nav_items_by_id(state, action)).toEqual(newState);
        });
    });
    describe('handle TOGGLE_NAV_ITEM', () => {
        test('If nav item toggled (show/hide)', () => {
            const action = {
                type: ActionTypes.TOGGLE_NAV_ITEM,
                payload: {
                    id: 'pa-1',
                },
            };
            const newState = JSON.parse(JSON.stringify(state));
            newState["pa-1"].hidden = true;

            expect(nav_items_by_id(state, action)).toEqual(newState);
        });
    });
    describe('handle TOGGLE_TITLE_MODE', ()=>{
        test('If toggle course title option', () => {
            const action = {
                type: ActionTypes.TOGGLE_TITLE_MODE,
                payload: {
                    id: 'pa-1',
                    titles: {
                        elementContent: {
                            documentTitle: "",
                            documentSubtitle: "",
                            numPage: "",
                        },
                        display: {
                            courseTitle: "reduced",
                            documentTitle: "expanded",
                            documentSubtitle: "hidden",
                            breadcrumb: "reduced",
                            pageNumber: "hidden",
                        },
                    },
                },
            };
            const newState = JSON.parse(JSON.stringify(state));
            newState['pa-1'].header = action.payload.titles;
            expect(nav_items_by_id(state, action)).toEqual(newState);
        });
    });
    describe('handle ADD_RICH_MARK', () => {
        // the anv_item_by_id reducer only need test in case mark links with an existing page
        test('If rich mark added & connected to an existing page (not a contained view)', () => {
            // doesnt change only box linkedboxes
            const action = {
                type: ActionTypes.ADD_RICH_MARK,
                payload: {
                    mark: {
                        origin: 'bo-4',
                        id: "rm-1",
                        title: "new mark",
                        connectMode: "existing",
                        connection: "pa-1",
                        displayMode: "navigate",
                        value: "30.95,49.15",
                        color: "#222222",
                    },
                },
            };
            const newState = JSON.parse(JSON.stringify(state));
            newState["pa-1"].linkedBoxes = { "rm-1": "bo-4" };
            expect(nav_items_by_id(state, action)).toEqual(newState);
        });
    });
    describe('handle EDIT_RICH_MARK', () => {
        test('If no changes happen', () => {
            const action = {
                type: ActionTypes.EDIT_RICH_MARK,
                payload: {
                },
            };
            expect(nav_items_by_id(state, action)).toEqual(state);
        });
        test('If rich mark edited and new link is not a cv-', () => {
            const action = {
                type: ActionTypes.EDIT_RICH_MARK,
                payload: {
                    mark: {
                        origin: 'bo-4',
                        id: "rm-1",
                        title: "new mark",
                        connectMode: "existing",
                        connection: "pa-1",
                        displayMode: "navigate",
                        value: "30.95,49.15",
                        color: "#222222",
                    },
                },
            };
            const newState = JSON.parse(JSON.stringify(state));
            newState['pa-1'].linkedBoxes = { "rm-1": 'bo-4' };

            expect(nav_items_by_id(state, action)).toEqual(newState);
        });
    });
    describe('handle DELETE_RICH_MARK', () => {
        test('If rich mark deleted and is in a view (but not a contained view)', () => {
            const action = {
                type: ActionTypes.DELETE_RICH_MARK,
                payload: {
                    mark: {
                        id: "rm-1",
                        connection: "cv-2",
                        origin: "pa-1",
                    },
                },
            };
            const newState = JSON.parse(JSON.stringify(state));
            expect(nav_items_by_id(state, action)).toEqual(newState);
        });

        test('If rich mark deleted and connects to a view (but not a contained view)', () => {
            let concreteState = JSON.parse(JSON.stringify(state));
            concreteState["pa-1"].linkedBoxes = { "rm-1": "bo-7" };

            const action = {
                type: ActionTypes.DELETE_RICH_MARK,
                payload: {
                    mark: {
                        id: "rm-1",
                        connection: "pa-1",
                        origin: "bo-34",
                        connectMode: "existing",
                    },
                },
            };
            const newState = JSON.parse(JSON.stringify(state));
            newState["pa-1"].linkedBoxes = {};
            expect(nav_items_by_id(concreteState, action)).toEqual(newState);
        });
    });
    describe('handle CHANGE_BOX_LAYER', () => {
        test('Bring to front selected_box in a slide', () => {
            const action = {
                type: ActionTypes.CHANGE_BOX_LAYER,
                payload: {
                    id: 'bo-4',
                    parent: 'pa-2',
                    container: 0,
                    value: 'front',
                    boxes_array: ['bo-4', 'bo-2'],
                },
            };
            const newState = JSON.parse(JSON.stringify(state));
            newState['pa-2'].boxes = ['bo-2', 'bo-4'];
            expect(nav_items_by_id(state, action)).toEqual(newState);
        });
    });
    describe('handle UPDATE_NAV_ITEM_EXTRA_FILES  ***************** TODO (Adams heritage ??)', () => {
        test('If updated nav items extra files', () => {
        // TODO
            // expect(nav_items_by_id(state, action)).toEqual(newState);
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
            expect(nav_items_by_id(state, action)).toEqual(state);
        });
    });
    describe('handle PASTE_BOX', () => {
        test('If box pasted to cv slide', () => {
            let ids = {
                "id": "bo-1511868565135",
                "parent": "cv-1511252975055",
                "container": 0,

            };
            const action = {
                type: ActionTypes.PASTE_BOX,
                payload: {
                    ids: ids,
                    box: {},
                    toolbar: {},
                },

            };

            expect(nav_items_by_id(state, action)).toEqual(state);
        });
        test('If box pasted to document', () => {

            const boxPasted = {
                "id": "bo-1511868565135",
                "parent": "bs-1",
                "container": "sc-1511868565133",
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
                    ids: { parent: 'bs-1', container: 'sc-1511868565133', id: 'bo-1511868565135' },
                    box: boxPasted,
                    toolbar: {},
                },

            };

            expect(nav_items_by_id(state, action)).toEqual(state);
        });
        test('If box pasted to slide', () => {
            let ids = { parent: "pa-2", container: 0, id: 'bo-151186856512235' };

            const boxPasted = {
                "id": ids.id,
                "parent": ids.parent,
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
                    ids: ids,
                    box: boxPasted,
                    toolbar: {},
                },

            };

            let newState = JSON.parse(JSON.stringify(state));
            newState[ids.parent].boxes = ["bs-3", "bo-4", ids.id];

            expect(nav_items_by_id(state, action)).toEqual(newState);

        });
        test.skip('If box pasted to cv slide with mark to navItem', () => {
            let ids = {
                "id": "bo-4",
                "parent": "cv-4",
                "container": 0,
            };

            const action = {
                type: ActionTypes.PASTE_BOX,
                payload: {
                    ids: ids,
                    box: {},
                },

            };

            let newState = JSON.parse(JSON.stringify(state));
            newState["pa-1"].linkedBoxes["bo-1"] = {};
            newState["pa-1"].linkedBoxes["bo-1"] = ["rm-1511253025114_1"];
            expect(nav_items_by_id(state, action)).toEqual(newState);
        });
    });
});
