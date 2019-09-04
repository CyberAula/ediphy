import marks_by_id from '../general/marksById';
import * as ActionTypes from '../../common/actions';

const state = {
    "rm-1": {
        "id": "rm-1",
        "origin": "bo-1",
        "title": "Nueva marca 1",
        "connection": "cv-1",
        "color": "#222222",
        "connectMode": "existing",
        "displayMode": "navigate",
        "value": "52.94,58.86",
    },
};

describe('# marks_by_id reducer', ()=>{
    describe('DEFAULT', ()=>{
        test('Should return test.state as default', () => {
            expect(marks_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle ADD_RICH_MARK', ()=>{
        test('If rich mark added', () => {
            const action = {
                type: ActionTypes.ADD_RICH_MARK,
                payload: {
                    "mark": {
                        "id": "rm-1524481518690",
                        "origin": "bo-1524479992144",
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
                            "rm-1524481518690": "bo-1524479992144",
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

            let newState = JSON.parse(JSON.stringify(state));
            newState["rm-1524481518690"] = {
                "id": "rm-1524481518690",
                "origin": "bo-1524479992144",
                "title": "Nueva marca 3",
                "connection": "cv-1524481518690",
                "color": "#222222",
                "connectMode": "existing",
                "displayMode": "navigate",
                "value": "50,50",
            };
            expect(marks_by_id(state, action)).toEqual(newState);
        });
    });
    describe('handle DELETE_BOX', ()=>{
        test('If box deleted', () => {
            const action = {
                type: ActionTypes.DELETE_BOX,
                payload: {
                    id: "bo-1524225237703",
                    children: [],
                },
            };
            let newState = JSON.parse(JSON.stringify(state));
            delete newState["rm-1524225239825"];
            expect(marks_by_id(state, action)).toEqual(newState);
        });
    });
    describe('handle DELETE_CONTAINED_VIEW', ()=>{
        test('If contained view deleted', () => {
            const action = {
                type: ActionTypes.DELETE_CONTAINED_VIEW,
                payload: {
                    ids: ["cv-1511252975055"],
                    boxes: ['bo-1511443052968'],
                    parent: {},
                },
            };
            let newState = JSON.parse(JSON.stringify(state));
            expect(marks_by_id(state, action)).toEqual(newState);
        });
    });
    describe('handle DUPLICATE_BOX', ()=>{
        test('If duplicated box', () => {
            const action = {
                type: ActionTypes.DUPLICATE_BOX,
                payload: {

                },
            };
            let newState = JSON.parse(JSON.stringify(state));
            expect(marks_by_id(state, action)).toEqual(newState);
        });
    });
    describe('handle EDIT_RICH_MARK', ()=>{
        test('If rich mark edited', () => {
            const action = {
                type: ActionTypes.EDIT_RICH_MARK,
                payload: {
                    "mark": {
                        "id": "rm-1",
                        "origin": "bo-1",
                        "title": "great mark",
                        "connection": "cv-1",
                        "color": "#3221f2",
                        "connectMode": "existing",
                        "displayMode": "navigate",
                        "value": "15,32",
                    },
                },
            };
            let newState = JSON.parse(JSON.stringify(state));
            newState["rm-1"].title = "great mark";
            newState["rm-1"].color = "#3221f2";
            newState["rm-1"].value = "15,32";
            expect(marks_by_id(state, action)).toEqual(newState);
        });
    });
    describe('handle DELETE_RICH_MARK', ()=>{
        test('If rich mark deleted', () => {
            const action = {
                type: ActionTypes.DELETE_RICH_MARK,
                payload: {
                    mark: {
                        id: "rm-1",
                    },
                },
            };
            let newState = {};
            expect(marks_by_id(state, action)).toEqual(newState);
        });
    });
    describe('handle PASTE_BOX', ()=>{
        test('If box pasted', () => {
            const boxPasted = {
                "id": "bo-1",
                "parent": "cv-2",
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
                    ids: { parent: "cv-2", container: 0, id: 'bo-1' },
                    box: boxPasted,
                    toolbar: {},
                },
            };
            let newState = JSON.parse(JSON.stringify(state));
            expect(marks_by_id(state, action)).toEqual(newState);
        });
    });
});
