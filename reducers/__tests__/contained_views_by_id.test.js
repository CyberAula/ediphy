import contained_views_by_id from '../containedViews/containedViewsById';
import * as ActionTypes from '../../common/actions';
import { isContainedView } from "../../common/utils";
import boxes_by_id from "../boxes/boxesById";

const state = {
    "cv-1": {
        "info": "new",
        "type": "document",
        "id": "cv-1",
        "parent": {
            "rm-11": "bo-11",
        },
        "boxes": [
            "bs-1",
            "bo-32",
        ],
        "extraFiles": {},
    },
    "cv-2": {
        "info": "new",
        "type": "document",
        "id": "cv-2",
        "parent": {
            "rm-12": "bo-11",
        },
        "boxes": [
            "bs-2",
            "bo-31",
        ],
        "extraFiles": {},
    },
};

describe('# contained_views_by_id reducer', ()=>{
    describe('DEFAULT', ()=>{
        test('Should return test.state as default', () => {
            expect(contained_views_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle ADD_BOX', ()=>{
        test('If added box in a contained view (Slide)', () => {

            const action = {
                type: ActionTypes.ADD_BOX,
                payload: { ids:
                        { parent: 'cv-1', id: 'bo-33', container: 0 },
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
            newState['cv-1'].boxes = ["bs-1",
                "bo-32",
                'bo-33'];

            expect(isContainedView(action.payload.ids.parent)).toBeTruthy();
            expect(contained_views_by_id(state, action)).toEqual(newState);
        });

    });
    describe('handle EDIT_RICH_MARK', () => {
        let newState;
        test('If rich mark edited and old/new links are not contained views', () => {
            const action = {
                type: ActionTypes.EDIT_RICH_MARK,
                payload: {
                    "mark": {
                        "id": "rm-45",
                        "origin": "bo-99",
                        "title": "Nueva marca 3",
                        "connection": "http://vishub.org",
                        "color": "#222222",
                        "connectMode": "external",
                        "displayMode": "navigate",
                        "value": "50,50",
                    },
                    "view": {
                    },
                    "viewToolbar": {
                    },
                },
            };
            newState = JSON.parse(JSON.stringify(state));
            expect(contained_views_by_id(state, action)).toEqual(newState);
        });
        test('If rich mark edited and old link is a contained view new isnt', () => {
            const action = {
                type: ActionTypes.EDIT_RICH_MARK,
                payload: {
                    "mark": {
                        "id": "rm-11",
                        "origin": "bo-77",
                        "title": "Nueva marca 3",
                        "connection": "https://testplace.org",
                        "color": "#222222",
                        "connectMode": "external",
                        "displayMode": "navigate",
                        "value": "50,50",
                    },
                    "view": {
                    },
                    "viewToolbar": {
                    },
                },
            };
            newState = JSON.parse(JSON.stringify(state));
            newState["cv-1"].parent = {};

            expect(contained_views_by_id(state, action)).toEqual(newState);
        });
        test('If rich mark edited and new link is a contained view', () => {
            const action = {
                type: ActionTypes.EDIT_RICH_MARK,
                payload: {
                    "mark": {
                        "id": "rm-11",
                        "origin": "bo-11",
                        "title": "Nueva marca 3",
                        "connection": "cv-2",
                        "color": "#222222",
                        "connectMode": "existing",
                        "displayMode": "navigate",
                        "value": "50,50",
                    },
                    "view": {
                    },
                    "viewToolbar": {
                    },
                },
            };
            newState = JSON.parse(JSON.stringify(state));
            newState["cv-1"].parent = {};
            newState["cv-2"].parent = {
                ...newState["cv-2"].parent,
                ...{ "rm-11": "bo-11" },
            };

            expect(contained_views_by_id(state, action)).toEqual(newState);
        });
    });
    describe('handle DELETE_RICH_MARK', () => {
        test('If rich mark deleted', () => {
            const action = {
                type: ActionTypes.DELETE_RICH_MARK,
                payload: {
                    mark: {
                        "id": "rm-11",
                        "origin": "bo-11",
                        "title": "Nueva marca 3",
                        "connection": "cv-1",
                        "color": "#222222",
                        "connectMode": "existing",
                        "displayMode": "navigate",
                        "value": "50,50",
                    },
                },
            };
            let newState = JSON.parse(JSON.stringify(state));
            newState["cv-1"].parent = {};

            expect(contained_views_by_id(state, action)).toEqual(newState);
        });
    });
    describe('handle ADD_RICH_MARK', () => {
        test('If rich mark added to an existing contained view', () => {
            const action = {
                type: ActionTypes.ADD_RICH_MARK,
                payload: {
                    mark: {
                        id: "rm-34",
                        title: "new mark",
                        connectMode: "existing",
                        "origin": "bo-1511786135103",
                        connection: "cv-2",
                        displayMode: "navigate",
                        value: "30.95,49.15",
                        color: "#222222",
                    },
                    state: {},
                },
            };

            const newState = JSON.parse(JSON.stringify(state));

            newState["cv-2"].parent["rm-34"] = 'bo-1511786135103';
            expect(contained_views_by_id(state, action)).toEqual(newState);
        });

        test('If rich mark added to a new contained view', () => {
            const action = {
                type: ActionTypes.ADD_RICH_MARK,
                payload: {
                    "mark": {
                        "id": "rm-1524225239825",
                        "origin": "bo-1524225237703",
                        "title": "Nueva marca 3",
                        "connection": "cv-1524481518690",
                        "color": "#222222",
                        "connectMode": "new",
                        "displayMode": "navigate",
                        "value": "50,50",
                    },
                    "view": {
                        "info": "new",
                        "type": "document",
                        "id": "cv-1524481518690",
                        "parent": {
                            "rm-1524225239825": "bo-1524225237703",
                        },
                        "boxes": [
                            "bs-1524481518690",
                        ],
                        "extraFiles": {},
                    },
                    "viewToolbar": {
                        "id": "cv-1524481518690",
                        "doc_type": "document",
                        "viewName": "Vista Contenida 3",
                    },
                },
            };
            const newState = JSON.parse(JSON.stringify(state));

            newState[action.payload.view.id] = action.payload.view;
            expect(contained_views_by_id(state, action)).toEqual(newState);
        });
    });
    describe('handle DELETE_BOX', () => {
        test('If deleted box is linked to a contained view', () => {
            const action = {
                type: ActionTypes.DELETE_BOX,
                payload: {
                    id: 'bo-1524225237703',
                    parent: "bs-1497983247797",
                    container: 0,
                    children: [],
                    cvs: ["cv-1511252975055"],
                },
            };
            const newState = JSON.parse(JSON.stringify(state));
            expect(contained_views_by_id(state, action)).toEqual(newState);
        });

        test('If the deleted box(s) parent is a contained view', () => {
            const action = {
                type: ActionTypes.DELETE_BOX,
                payload: {
                    ids: ["bs-32"],
                    parent: 'cv-1',
                    container: 0,
                    children: [],
                    cvs: [],
                },
            };
            const newState = JSON.parse(JSON.stringify(state));

            expect(contained_views_by_id(state, action)).toEqual(newState);
        });
    });
    describe('handle DELETE_CONTAINED_VIEW', () => {
        test('If contained view deleted', () => {
            const action = {
                type: ActionTypes.DELETE_CONTAINED_VIEW,
                payload: {
                    ids: ["cv-1511252975055"],
                    boxes: ['bo-1511443052968'],
                    parent: {},
                },
            };
            const newState = JSON.parse(JSON.stringify(state));
            delete newState["cv-1511252975055"];
            expect(contained_views_by_id(state, action)).toEqual(newState);
        });
    });
    describe('handle DELETE_NAV_ITEM', () => {
        test('If nav item deleted and has a linked contained view', () => {
            const action = {
                type: ActionTypes.DELETE_NAV_ITEM,
                payload: {
                    ids: ['pa-1'],
                    parent: 'se-2',
                    boxes: ['bo-11'],
                    containedViews: {},
                    linkedBoxes: {},
                },
            };
            const newState = JSON.parse(JSON.stringify(state));
            newState["cv-2"].parent = {};
            newState["cv-1"].parent = {};
            // delete newState["cv-1511252975058"].parent[action.payload.boxes[0]];
            expect(contained_views_by_id(state, action)).toEqual(newState);
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
    describe('handle PASTE_BOX', () => {
        test('If box pasted to cv slide', () => {

            let ids = {
                "id": "bo-6",
                "parent": "cv-1",
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

            const newState = JSON.parse(JSON.stringify(state));
            newState["cv-1"].boxes = ["bs-1", "bo-32", "bo-6"];
            expect(contained_views_by_id(state, action)).toEqual(newState);
        });
        test('If box pasted to regular view', () => {

            let ids = {
                "id": "bo-1511868565135",
                "parent": "bs-1497983247797",
                "container": "sc-1511868565133",

            };
            const action = {
                type: ActionTypes.PASTE_BOX,
                payload: {
                    ids: ids,
                    box: {},
                    toolbar: {},
                },

            };

            expect(contained_views_by_id(state, action)).toEqual(state);
        });
    });
    describe('handle CHANGE_BOX_LAYER', () => {
        test('Bring to front selected_box in a slide', () => {
            const action = {
                type: ActionTypes.CHANGE_BOX_LAYER,
                payload: {
                    id: 'bo-1',
                    parent: "cv-1",
                    container: 0,
                    value: 'front',
                    boxes_array: ['bo-1', 'bo-12'],
                },
            };
            const newState = JSON.parse(JSON.stringify(state));
            newState['cv-1'].boxes = ['bo-12', 'bo-1'];
            expect(contained_views_by_id(state, action)).toEqual(newState);
        });
    });
});

