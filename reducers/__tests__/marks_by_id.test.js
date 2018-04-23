import { testState } from '../../core/store/state.tests.js';
import marks_by_id from '../marks_by_id';
import * as ActionTypes from '../../common/actions';
import { ADD_RICH_MARK } from "../../common/actions";

const state = testState.present.marksById;

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
                    parent: 'bo-1511252970033',
                    id: "rm-1511252975055",
                    title: "new mark",
                    connectMode: "existing",
                    connection: "pa-1511252955865",
                    displayMode: "navigate",
                    value: "30.95,49.15",
                    color: "#222222",
                    oldConnection: 'cv-1511252975055',
                    newConnection: 'pa-1511252955865',
                },
            };
            let newState = JSON.parse(JSON.stringify(state));
            newState["rm-1511252975055"] = {
                parent: 'bo-1511252970033',
                id: "rm-1511252975055",
                title: "new mark",
                connectMode: "existing",
                connection: "pa-1511252955865",
                displayMode: "navigate",
                value: "30.95,49.15",
                color: "#222222",
                oldConnection: 'cv-1511252975055',
                newConnection: 'pa-1511252955865',
            };
            expect(marks_by_id(state, action)).toEqual(newState);
        });
    });
    describe('handle DELETE_BOX', ()=>{
        test('If box deleted', () => {
            const action = {
                type: ActionTypes.DELETE_BOX,
                payload: {
                    id: "1511252975065",
                },
            };
            let newState = JSON.parse(JSON.stringify(state));
            delete newState["1511252975065"];
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
                    parent: 'bo-1511252957954',
                    id: "rm-1511252975065",
                    title: "great mark",
                    connectMode: "existing",
                    connection: "cv-1511252975055",
                    displayMode: "navigate",
                    value: "30.95,49.15",
                    color: "#222222",
                    oldConnection: '',
                    newConnection: 'cv-1511252975055',
                },
            };
            let newState = JSON.parse(JSON.stringify(state));
            newState["rm-1511252975065"].title = "great mark";
            expect(marks_by_id(state, action)).toEqual(newState);
        });
    });
    describe('handle DELETE_RICH_MARK', ()=>{
        test('If rich mark deleted', () => {
            const action = {
                type: ActionTypes.DELETE_RICH_MARK,
                payload: {
                    parent: 'bo-1511252970033',
                    id: "rm-1511252975055",
                    title: "new mark",
                    connectMode: "existing",
                    connection: "pa-1511252955865",
                    displayMode: "navigate",
                    value: "30.95,49.15",
                    color: "#222222",
                    oldConnection: 'cv-1511252975055',
                    newConnection: 'pa-1511252955865',
                },
            };
            let newState = JSON.parse(JSON.stringify(state));
            expect(marks_by_id(state, action)).toEqual(newState);
        });
    });
    describe('handle PASTE_BOX', ()=>{
        test('If box pasted', () => {
            const boxPasted = {
                "id": "bo-1511868565135",
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
                },
            };
            let newState = JSON.parse(JSON.stringify(state));
            expect(marks_by_id(state, action)).toEqual(newState);
        });
    });
});

