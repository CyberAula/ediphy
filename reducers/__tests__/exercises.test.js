import { testState } from '../../core/store/state.tests.js';
import exercisesReducer from '../exercises/exercises';
import * as ActionTypes from '../../common/actions';

const state = testState.undoGroup.present.exercises;

describe('# exercisesReducer reducer', ()=>{
    describe('DEFAULT', ()=>{
        test('should return test.state as initial state', () => {
            expect(exercisesReducer(state, {})).toEqual(state);
        });
    });
    describe('handle ADD_NAV_ITEM', ()=> {
        test('If Added navigation item & hasContent', () => {
            const addedId = 'pa-1511252985429';
            const action = { type: ActionTypes.ADD_NAV_ITEM, payload: { hasContent: true, id: addedId } };
            expect(action.payload.hasContent).toBeTruthy();
            expect(exercisesReducer(state, action)).toEqual({ ...state, [addedId]: {
                id: addedId,
                submitButton: true,
                trackProgress: false,
                attempted: false,
                minForPass: 50,
                score: 0,
                weight: 10,
                exercises: {},
            } });
        });
        test('If Added navigation item & nothasContent', () => {
            const action = { type: ActionTypes.ADD_NAV_ITEM, payload: { hasContent: false } };
            expect(action.payload.hasContent).toBeFalsy();
            expect(exercisesReducer(state, action)).toEqual(state);
        });
    });
    describe('handle ADD_NAV_ITEMS', ()=> {
        test('If Added navigation items in bulk', () => {
            const addedId1 = 'pa-15112529854291';
            const addedId2 = 'pa-15112529854292';
            const action = { type: ActionTypes.ADD_NAV_ITEMS, payload: { navs: [{ id: addedId1, hasContent: true }, { id: addedId2, hasContent: true }] } };
            expect(exercisesReducer(state, action)).toEqual({ ...state,
                [addedId1]: {
                    id: addedId1,
                    submitButton: true,
                    trackProgress: false,
                    attempted: false,
                    minForPass: 50,
                    score: 0,
                    weight: 10,
                    exercises: {},
                },
                [addedId2]: {
                    id: addedId2,
                    submitButton: true,
                    trackProgress: false,
                    attempted: false,
                    minForPass: 50,
                    score: 0,
                    weight: 10,
                    exercises: {},
                } });
        });

    });
    describe('handle ADD_RICH_MARK', ()=> {
        test('If Added new cv', () => {
            const action = { type: ActionTypes.ADD_RICH_MARK, payload: {
                mark: {
                    id: 'rm-1234',
                    origin: 'bo-1234',
                    title: 'New Mark',
                    connection: 'cv-1234',
                    color: 'blue',
                    connectMode: 'new',
                    displayMode: "navigate",
                    value: "",
                },
                view: {
                    info: "new",
                    type: 'slide',
                    id: 'cv-1234',
                    parent: { ['rm-1234']: 'bo-1234' },
                    // name: name,
                    boxes: [],
                    extraFiles: {},
                },
                viewToolbar: {
                    id: 'cv-1234',
                    doc_type: 'slide',
                    viewName: 'Name',
                },
            } };
            let predictedSt = exercisesReducer(state, action);
            let expectedSt = { ...state, ['cv-1234']: {
                id: 'cv-1234',
                submitButton: true,
                trackProgress: false,
                attempted: false,
                minForPass: 50,
                score: 0,
                weight: 10,
                exercises: {},
            } };
            expect(predictedSt).toEqual(expectedSt);
            // If we add a repeated one the state should not change
            expect(exercisesReducer(predictedSt, action)).toEqual(expectedSt);
        });
        test('If Added existing cv', () => {
            const action = { type: ActionTypes.ADD_RICH_MARK, payload: {
                mark: {
                    id: 'rm-1234',
                    origin: 'bo-1234',
                    title: 'New Mark',
                    connection: 'cv-1524225239825',
                    color: 'blue',
                    connectMode: 'existing',
                    displayMode: "navigate",
                    value: "",
                },
                view: {
                    info: "new",
                    type: 'slide',
                    id: 'cv-1524225239825',
                    parent: 'bo-1234',
                    // name: name,
                    boxes: [],
                    extraFiles: {},
                },
            } };
            let predictedSt = exercisesReducer(state, action);
            let expectedSt = { ...state };
            expect(predictedSt).toEqual(expectedSt);
        });
        test('If Added existing page', () => {
            const action = { type: ActionTypes.ADD_RICH_MARK, payload: {
                mark: {
                    id: 'rm-1234',
                    origin: 'bo-1234',
                    title: 'New Mark',
                    connection: "pa-1497983247795",
                    color: 'blue',
                    connectMode: 'existing',
                    displayMode: "navigate",
                    value: "",
                },
                view: {
                    info: "new",
                    type: 'slide',
                    id: "pa-1497983247795",
                    parent: 'bo-1234',
                    // name: name,
                    boxes: [],
                    extraFiles: {},
                },
            } };
            let predictedSt = exercisesReducer(state, action);
            let expectedSt = { ...state };
            expect(predictedSt).toEqual(expectedSt);
        });
        test('If Added external', () => {
            const action = { type: ActionTypes.ADD_RICH_MARK, payload: {
                mark: {
                    id: 'rm-1234',
                    origin: 'bo-1234',
                    title: 'New Mark',
                    connection: "http://vishub.org",
                    color: 'blue',
                    connectMode: 'external',
                    displayMode: "navigate",
                    value: "",
                },
            } };
            let predictedSt = exercisesReducer(state, action);
            let expectedSt = { ...state };
            expect(predictedSt).toEqual(expectedSt);
        });
        test('If Added popup', () => {
            const action = { type: ActionTypes.ADD_RICH_MARK, payload: {
                mark: {
                    id: 'rm-1234',
                    origin: 'bo-1234',
                    title: 'New Mark',
                    connection: "Hello",
                    color: 'blue',
                    connectMode: 'popup',
                    displayMode: "navigate",
                    value: "",
                },
            } };
            let predictedSt = exercisesReducer(state, action);
            let expectedSt = { ...state };
            expect(predictedSt).toEqual(expectedSt);
        });
    });

    describe('handle EDIT_RICH_MARK', ()=> {
        test('If edit popup', () => {
            const action = { type: ActionTypes.EDIT_RICH_MARK, payload: {
                mark: {
                    id: 'rm-1234',
                    origin: 'bo-1234',
                    title: 'New Mark',
                    connection: "Hello",
                    color: 'blue',
                    connectMode: 'popup',
                    displayMode: "navigate",
                    value: "",
                },
            } };
            let predictedSt = exercisesReducer(state, action);
            let expectedSt = { ...state };
            expect(predictedSt).toEqual(expectedSt);
        });
        test('If edit mark to create new cv', () => {
            const action = { type: ActionTypes.EDIT_RICH_MARK, payload: {
                mark: {
                    id: 'rm-1234',
                    origin: 'bo-1234',
                    title: 'New Mark',
                    connection: 'cv-1234',
                    color: 'blue',
                    connectMode: 'new',
                    displayMode: "navigate",
                    value: "",
                },
                view: {
                    info: "new",
                    type: 'slide',
                    id: 'cv-1234',
                    parent: { ['rm-1234']: 'bo-1234' },
                    // name: name,
                    boxes: [],
                    extraFiles: {},
                },
                viewToolbar: {
                    id: 'cv-1234',
                    doc_type: 'slide',
                    viewName: 'Name',
                },
            } };
            let predictedSt = exercisesReducer(state, action);
            let expectedSt = { ...state, ['cv-1234']: {
                id: 'cv-1234',
                submitButton: true,
                trackProgress: false,
                attempted: false,
                minForPass: 50,
                score: 0,
                weight: 10,
                exercises: {},
            } };
            expect(predictedSt).toEqual(expectedSt);
        });
    });
    describe('handle ADD_BOX', ()=> {
        test('If Added boxSortable', () => {
            const addedId = 'bs-1511252985429';
            const action = { type: ActionTypes.ADD_BOX, payload: {
                ids: { parent: "pa-1497983247795", container: 0, id: addedId },
            } };
            expect(exercisesReducer(state, action)).toEqual({ ...state });
        });
        test('If Added non exercise box to page', () => {
            const addedId = 'bo-1511252985429';
            const action = { type: ActionTypes.ADD_BOX, payload: {
                ids: { parent: "bs-1497983247795", container: "sc-1524225237703", id: addedId, page: "pa-1497983247795", name: "HotspotsImage", config: { category: "image", defaultCurrentAnswer: false, defaultCorrectAnswer: false } }, draggable: true, resizable: true, content: null, style: {}, state: {}, structure: {}, initialParams: {
                    parent: "bs-1497983247795", container: "sc-1524225237703", id: addedId, page: "pa-1497983247795", name: "HotspotsImage", isDefaultPlugn: false,
                },
            } };
            expect(exercisesReducer(state, action)).toEqual({ ...state });
        });
        test('If Added  exercise box to page', () => {
            const addedId = 'bo-1511252985429';
            const action = { type: ActionTypes.ADD_BOX, payload: {
                ids: {
                    parent: "bs-1497983247795", container: "sc-1524225237703", id: addedId, page: "pa-1497983247795", name: "MultipleAnswer", config: { category: "evaluation", defaultCurrentAnswer: [], defaultCorrectAnswer: [] } },
                draggable: true, resizable: true, content: null, style: {}, state: {}, structure: {}, initialParams: {
                    parent: "bs-1497983247795", container: "sc-1524225237703", id: addedId, page: "pa-1497983247795", name: "MultipleAnswer", isDefaultPlugn: false,
                },
            } };
            expect(exercisesReducer(state, action)).toEqual({ ...state,
                "pa-1497983247795": {
                    ...state["pa-1497983247795"], exercises: {
                        ...state["pa-1497983247795"].exercises,
                        [addedId]: {
                            name: "MultipleAnswer",
                            id: addedId,
                            weight: 1,
                            correctAnswer: [],
                            currentAnswer: [],
                            showFeedback: undefined,
                            attempted: false,
                            score: 0,
                        },
                    },
                },
            });
        });

    });
    describe('handle PASTE_BOX', ()=> {
        test('If pasted non exercise box to page', () => {
            const addedId = 'bo-1511252985429';
            const action = { type: ActionTypes.PASTE_BOX, payload: {
                ids: { parent: "bs-1497983247795", container: "sc-1524225237703", id: addedId, page: "pa-1497983247795", name: "HotspotsImage", config: { category: "image", defaultCurrentAnswer: false, defaultCorrectAnswer: false } }, draggable: true, resizable: true, content: null, style: {}, state: {}, structure: {}, toolbar: { pluginId: "HotspotsImage" }, initialParams: {
                    parent: "bs-1497983247795", container: "sc-1524225237703", id: addedId, page: "pa-1497983247795", name: "HotspotsImage", isDefaultPlugn: false,
                },
            } };
            expect(exercisesReducer(state, action)).toEqual({ ...state });
        });
        test('If pasted  exercise box to page', () => {
            const addedId = 'bo-1511252985429';
            const action = { type: ActionTypes.PASTE_BOX, payload: {
                ids: {
                    parent: "bs-1497983247795", container: "sc-1524225237703", id: addedId, page: "pa-1497983247795", name: "MultipleAnswer", config: { category: "evaluation", defaultCurrentAnswer: [], defaultCorrectAnswer: [] } },
                draggable: true, resizable: true, content: null, style: {}, state: {}, structure: {}, toolbar: { pluginId: "MultipleAnswer" }, initialParams: {
                    parent: "bs-1497983247795", container: "sc-1524225237703", id: addedId, page: "pa-1497983247795", name: "MultipleAnswer", isDefaultPlugn: false,
                },
            } };
            expect(exercisesReducer(state, action)).toEqual({ ...state,
                "pa-1497983247795": {
                    ...state["pa-1497983247795"], exercises: {
                        ...state["pa-1497983247795"].exercises,
                        [addedId]: {
                            name: "MultipleAnswer",
                            id: addedId,
                            weight: 1,
                            correctAnswer: [],
                            currentAnswer: [],
                            showFeedback: undefined,
                            attempted: false,
                            score: 0,
                        },
                    },
                },
            });
        });
    });
    describe('handle DELETE_NAV_ITEM ', ()=> {
        test('Delete navigation item', () => {
            const action = { type: ActionTypes.DELETE_NAV_ITEM, payload: { ids: ["pa-1497983247795"] } };
            expect(exercisesReducer(state, action)).toEqual({ "cv-1524225239825": { ...state["cv-1524225239825"] } });
        });
    });
    describe('handle DELETE_CONTAINED_VIEW ', ()=> {
        test('Delete cv item', () => {
            const action = { type: ActionTypes.DELETE_CONTAINED_VIEW, payload: { ids: ["cv-1524225239825"] } };
            expect(exercisesReducer(state, action)).toEqual({ "pa-1497983247795": { ...state["pa-1497983247795"] } });
        });
    });
    describe('handle DELETE_BOX', ()=> {
        test('Delete delete box', () => {

            const addedId = 'bo-1511252985429';
            const actionDel = { type: ActionTypes.DELETE_BOX, payload: {
                parent: "bs-1497983247795", container: "sc-1524225237703", id: addedId, page: "pa-1497983247795",
            } };
            expect(exercisesReducer(state, actionDel)).toEqual({ ...state });
        });
    });
    describe('handle SET_CORRECT_ANSWER', ()=> {
        test('Set correct answer', () => {
            const addedId = 'bo-1511252985429';
            const actionAdd = { type: ActionTypes.ADD_BOX, payload: {
                ids: {
                    parent: "bs-1497983247795", container: "sc-1524225237703", id: addedId, page: "pa-1497983247795", name: "MultipleAnswer", config: { category: "evaluation", defaultCurrentAnswer: [], defaultCorrectAnswer: [] } },
                draggable: true, resizable: true, content: null, style: {}, state: {}, structure: {}, initialParams: {
                    parent: "bs-1497983247795", container: "sc-1524225237703", id: addedId, page: "pa-1497983247795", name: "MultipleAnswer", isDefaultPlugn: false,
                },
            } };
            const action = { type: ActionTypes.SET_CORRECT_ANSWER, payload: {
                id: addedId, correctAnswer: [0], page: "pa-1497983247795",
            } };
            expect(exercisesReducer(exercisesReducer(state, actionAdd), action)).toEqual({ ...state,
                "pa-1497983247795": {
                    ...state["pa-1497983247795"], exercises: {
                        ...state["pa-1497983247795"].exercises,
                        [addedId]: {
                            name: "MultipleAnswer",
                            id: addedId,
                            weight: 1,
                            correctAnswer: [0],
                            currentAnswer: [],
                            showFeedback: undefined,
                            attempted: false,
                            score: 0,
                        },
                    },
                },
            });
        });
    });
    describe('handle DELETE_SORTABLE_CONTAINER', ()=> {

    });
    describe('handle CONFIG_SCORE', ()=> {
        test('If changed score of page', () => {
            const addedId = "pa-1497983247795";
            const action = { type: ActionTypes.CONFIG_SCORE, payload: { id: addedId, button: "weight", value: 9, page: addedId } };
            expect(exercisesReducer(state, action)).toEqual({ ...state, [addedId]: {
                id: addedId,
                submitButton: true,
                trackProgress: false,
                attempted: false,
                minForPass: 50,
                score: 0,
                weight: 9,
                exercises: {},
            } });
        });
        test('If changed score of box', () => {
            const addedId = 'bo-1511252985429';
            const actionAdd = { type: ActionTypes.ADD_BOX, payload: {
                ids: {
                    parent: "bs-1497983247795", container: "sc-1524225237703", id: addedId, page: "pa-1497983247795", name: "MultipleAnswer", config: { category: "evaluation", defaultCurrentAnswer: [], defaultCorrectAnswer: [] } },
                draggable: true, resizable: true, content: null, style: {}, state: {}, structure: {}, initialParams: {
                    parent: "bs-1497983247795", container: "sc-1524225237703", id: addedId, page: "pa-1497983247795", name: "MultipleAnswer", isDefaultPlugn: false,
                },
            } };
            const action = { type: ActionTypes.CONFIG_SCORE, payload: { id: addedId, button: "weight", value: 30, page: "pa-1497983247795" } };
            let addState = exercisesReducer(state, actionAdd);
            expect(exercisesReducer(addState, action)).toEqual({ ...addState, "pa-1497983247795": {
                ...addState["pa-1497983247795"],
                exercises: {
                    [addedId]: { ...addState["pa-1497983247795"].exercises[addedId], weight: 30 },
                },
            } });
        });
    });
    describe('handle IMPORT_STATE', ()=> {
        test('Import exercises from state.test', () => {
            const action = { type: ActionTypes.IMPORT_STATE, payload: { present: { exercises: state } } };
            expect(exercisesReducer(state, action)).toEqual(state);
        });
        test('Import default state', () => {
            const action = { type: ActionTypes.IMPORT_STATE, payload: { present: { } } };
            expect(exercisesReducer(state, action)).toEqual(state);
        });
    });
});

