import { testState } from '../../core/store/state.tests.js';
import contained_views_by_id from '../contained_views_by_id';
import * as ActionTypes from '../../common/actions';
import { changeProp, deleteProps, isContainedView } from "../../common/utils";
import { EDIT_RICH_MARK } from "../../common/actions";
import { ADD_RICH_MARK } from "../../common/actions";
import { DELETE_BOX } from "../../common/actions";
import { CHANGE_CONTAINED_VIEW_NAME } from "../../common/actions";
import { DELETE_CONTAINED_VIEW } from "../../common/actions";
import { DELETE_NAV_ITEM } from "../../common/actions";
import boxes_by_id from "../boxes_by_id";
import { DELETE_SORTABLE_CONTAINER } from "../../common/actions";
import { TOGGLE_TITLE_MODE } from "../../common/actions";

const state = testState.present.containedViewsById;

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
                        { parent: 'cv-1511252975055', id: 'bo-1511443052929', container: 0 },
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
            newState['cv-1511252975055'].boxes = ['bo-1511443052968', 'bo-1511443052929'];

            expect(isContainedView(action.payload.ids.parent)).toBeTruthy();
            expect(contained_views_by_id(state, action)).toEqual(newState);
        });

    });

    describe('handle EDIT_RICH_MARK', () => {
        test('If rich mark edited and old/new links are not contained views', () => {
            const action = {
                type: ActionTypes.EDIT_RICH_MARK,
                payload: {
                    parent: 'bo-1511252970033',
                    state: {},
                    mark: { id: "rm-1511786135103",
                        title: "new mark",
                        connectMode: "existing",
                        connection: "pa-1511252955865",
                        displayMode: "navigate",
                        value: "30.95,49.15",
                        color: "#222222",
                    },
                    oldConnection: 'pa-1497983247795',
                    newConnection: 'pa-1511252955865',

                },
            };
            const newState = JSON.parse(JSON.stringify(state));
            expect(contained_views_by_id(state, action)).toEqual(newState);
        });
        test('If rich mark edited and old link is a contained view', () => {
            const action = {
                type: ActionTypes.EDIT_RICH_MARK,
                payload: {
                    parent: 'bo-1511252970033',
                    state: {},
                    mark: { id: "rm-1511252975055",
                        title: "new mark",
                        connectMode: "existing",
                        connection: "pa-1511252955865",
                        displayMode: "navigate",
                        value: "30.95,49.15",
                        color: "#222222",
                    },
                    oldConnection: 'cv-1511252975055',
                    newConnection: 'pa-1511252955865',

                },
            };
            const newState = JSON.parse(JSON.stringify(state));
            newState['cv-1511252975055'].parent = { 'bo-1511443052925': ["rm-1511252975456"] };

            expect(isContainedView(action.payload.oldConnection)).toBeTruthy();
            expect(contained_views_by_id(state, action)).toEqual(newState);
        });

        test('If rich mark edited and new link is a contained view', () => {
            const action = {
                type: ActionTypes.EDIT_RICH_MARK,
                payload: {
                    parent: 'bo-1511252970033',
                    state: {},
                    mark: { id: "rm-1511786135103",
                        title: "new mark",
                        connectMode: "existing",
                        connection: "cv-1511252975055",
                        displayMode: "navigate",
                        value: "30.95,49.15",
                        color: "#222222",
                    },
                    oldConnection: 'pa-1497983247795',
                    newConnection: 'cv-1511252975055',

                },
            };
            const newState = JSON.parse(JSON.stringify(state));
            newState['cv-1511252975055'].parent[action.payload.parent] = ["rm-1511252975055", "rm-1511786135103"];

            expect(isContainedView(action.payload.newConnection)).toBeTruthy();
            expect(contained_views_by_id(state, action)).toEqual(newState);
        });
    });

    describe('handle DELETE_RICH_MARK', () => {
        test('If rich mark deleted', () => {
            const action = {
                type: ActionTypes.DELETE_RICH_MARK,
                payload: {
                    id: 'rm-1511252975055',
                    parent: 'bo-1511252970033',
                    cvid: 'cv-1511252975055',
                    state: {},
                },
            };
            const newState = JSON.parse(JSON.stringify(state));
            newState[action.payload.cvid].parent = { 'bo-1511443052925': ["rm-1511252975456"] };

            expect(contained_views_by_id(state, action)).toEqual(newState);
        });
    });

    describe('handle ADD_RICH_MARK', () => {

        test('If rich mark added to an existing contained view', () => {

            const action = {
                type: ActionTypes.ADD_RICH_MARK,
                payload: {
                    parent: 'bo-1511252970033',
                    mark: {
                        id: "rm-1511786135103",
                        title: "new mark",
                        connectMode: "existing",
                        connection: "cv-1511252975055",
                        displayMode: "navigate",
                        value: "30.95,49.15",
                        color: "#222222",
                    },
                    state: {},
                },
            };

            const newState = JSON.parse(JSON.stringify(state));

            newState["cv-1511252975055"].parent['bo-1511252970033'] = ["rm-1511252975055", "rm-1511786135103"];

            expect(action.payload.mark.connectMode === 'existing').toBeTruthy();
            expect(isContainedView(action.payload.mark.connection)).toBeTruthy();

            expect(contained_views_by_id(state, action)).toEqual(newState);
        });

        test('If rich mark added to a new contained view', () => {
            const action = {
                type: ActionTypes.ADD_RICH_MARK,
                payload: {
                    parent: 'bo-1511252970033',
                    mark: {
                        id: "rm-1511786135103",
                        title: "new mark",
                        connectMode: "new",
                        connection: {
                            id: "cv-1511252975056",
                            parent: { 'bo-1511252970033': { 0: 'rm-1511786135103' } },
                            name: 'CV2',
                            boxes: [],
                            type: 'slide',
                            extraFiles: {},
                            header: {},
                        },
                        displayMode: "navigate",
                        value: "30.95,49.15",
                        color: "#222222",
                    },
                    state: {},
                },
            };
            const newState = JSON.parse(JSON.stringify(state));

            newState[action.payload.mark.connection.id] = action.payload.mark.connection;
            expect(contained_views_by_id(state, action)).toEqual(newState);
        });
    });

    describe('handle DELETE_BOX', () => {
        test('If deleted box is linked to a contained view', () => {
            const action = {
                type: ActionTypes.DELETE_BOX,
                payload: {
                    id: 'bo-1511252970033',
                    parent: 'pa-1511252955865',
                    container: 0,
                    children: [],
                    cvs: ["cv-1511252975055"],
                },
            };
            const newState = JSON.parse(JSON.stringify(state));
            delete newState[action.payload.cvs[0]].parent[action.payload.id];
            expect(contained_views_by_id(state, action)).toEqual(newState);
        });

        test('If the deleted box(s) parent is a contained view', () => {
            const action = {
                type: ActionTypes.DELETE_BOX,
                payload: {
                    id: 'bo-1511443052968',
                    parent: 'cv-1511252975055',
                    container: 0,
                    children: [],
                    cvs: [],
                },
            };
            const newState = JSON.parse(JSON.stringify(state));
            delete newState[action.payload.parent].boxes[action.payload.id];
            newState['cv-1511252975055'].boxes = [];
            expect(contained_views_by_id(state, action)).toEqual(newState);
        });
    });

    describe('handle CHANGE_CONTAINED_VIEW_NAME', () => {
        test('If contained view name changed', () => {
            const action = {
                type: ActionTypes.CHANGE_CONTAINED_VIEW_NAME,
                payload: {
                    id: 'cv-1511252975055',
                    title: 'vc2',
                },
            };
            const newState = JSON.parse(JSON.stringify(state));
            newState[action.payload.id].name = action.payload.title;
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
                    ids: ['pa-1511252955865'],
                    parent: 'se-1511252954307',
                    boxes: ['bo-1511252970033'],
                    containedViews: {},
                    linkedBoxes: {},
                },
            };
            const newState = JSON.parse(JSON.stringify(state));
            delete newState["cv-1511252975055"].parent[action.payload.boxes[0]];
            // delete newState["cv-1511252975058"].parent[action.payload.boxes[0]];
            expect(contained_views_by_id(state, action)).toEqual(newState);
        });
    });

    describe('handle DELETE_SORTABLE_CONTAINER', () => {
        test('If sortable container deleted has a box linked to a contained view', () => {
            const action = {
                type: ActionTypes.DELETE_NAV_ITEM,
                payload: {
                    id: 'sc-1511443052922',
                    parent: 'bs-1511252985426',
                    children: ["bo-1511443052925", "bo-1511443052967"],
                    cvs: { 'cv-1511252975055': ["bo-1511443052925"] },
                },
            };
            const newState = JSON.parse(JSON.stringify(state));
            delete newState['cv-1511252975055'].parent[action.payload.cvs[0]];
            expect(contained_views_by_id(state, action)).toEqual(newState);
        });
    });

    describe('handle TOGGLE_TITLE_MODE', () => {
        test('If title mode toggled in a contained view', () => {
            const action = {
                type: ActionTypes.TOGGLE_TITLE_MODE,
                payload: {
                    id: 'cv-1511252975055',
                    titles: {
                        elementContent: {
                            documentTitle: "prueba",
                            documentSubTitle: "",
                            numPage: "",
                        },
                        display: {
                            courseTitle: "reduced",
                            documentTitle: "expanded",
                            documentSubTitle: "hidden",
                            breadcrumb: "reduced",
                            pageNumber: "hidden",
                        },
                    },
                },
            };

            const newState = JSON.parse(JSON.stringify(state));
            newState[action.payload.id].header = action.payload.titles;
            expect(isContainedView(action.payload.id)).toBeTruthy();
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

            const newState = JSON.parse(JSON.stringify(state));
            newState["cv-1511252975055"].boxes = ["bo-1511443052968", ids.id];
            expect(contained_views_by_id(state, action)).toEqual(newState);
        });
        test('If box pasted to cv slide with mark to navItem', () => {

            let ids = {
                "id": "bo-15118685651356",
                "parent": "cv-1511252975055",
                "container": 0,

            };
            let toolbar = {
                "id": "bo-15118685651356",
                "controls": { "main": { "__name": "Main", "accordions": { "basic": { "__name": "Fuente", "icon": "link", "buttons": { "url": { "__name": "URL", "type": "external_provider", "value": "myurl", "accept": "image/*", "autoManaged": false } } }, "style": { "__name": "Estilo caja", "icon": "palette", "buttons": { "padding": { "__name": "Padding", "type": "number", "value": 0, "min": 0, "max": 100, "autoManaged": true }, "backgroundColor": { "__name": "Color de fondo", "type": "color", "value": "#ffffff", "autoManaged": true }, "borderWidth": { "__name": "Grosor de borde", "type": "number", "value": 0, "min": 0, "max": 10, "autoManaged": true }, "borderStyle": { "__name": "Estilo de borde", "type": "select", "value": "solid", "options": ["none", "hidden", "dotted", "dashed", "solid", "double", "groove", "ridge", "inset", "outset", "initial", "inherit"], "autoManaged": true }, "borderColor": { "__name": "Color de borde", "type": "color", "value": "#000000", "autoManaged": true }, "borderRadius": { "__name": "Radio", "type": "number", "value": 0, "min": 0, "max": 50, "autoManaged": true }, "opacity": { "__name": "Opacidad", "type": "range", "value": 1, "min": 0, "max": 1, "step": 0.01, "autoManaged": true } } }, "__sortable": { "key": "structure", "__name": "Estructura", "icon": "border_all", "buttons": { "__width": { "__name": "Ancho", "type": "number", "displayValue": 25, "value": 25, "step": 5, "units": "%", "auto": false, "autoManaged": true }, "__height": { "__name": "Altura", "type": "text", "displayValue": "auto", "value": "20", "step": 5, "units": "%", "auto": true, "autoManaged": true }, "__rotate": { "__name": "Rotar (º)", "type": "range", "value": 0, "min": 0, "max": 360, "autoManaged": false }, "__aspectRatio": { "__name": "Relación de aspecto", "type": "checkbox", "checked": true, "autoManaged": true } } }, "z__extra": { "__name": "Alias", "icon": "rate_review", "buttons": { "alias": { "__name": "Alias", "type": "text", "value": "", "autoManaged": true, "isAttribute": true } } }, "__marks_list": { "key": "marks_list", "__name": "Lista de marcas", "icon": "room", "buttons": {} } } } },
                "config": { "name": "HotspotImages", "displayName": "Imagen enriquecida", "category": "image", "needsConfigModal": false, "needsConfirmation": false, "needsTextEdition": false, "needsXMLEdition": false, "aspectRatioButtonConfig": { "location": ["main", "__sortable"], "defaultValue": true, "name": "Relación de aspecto" }, "allowFloatingBox": true, "icon": "image", "iconFromUrl": false, "isRich": true, "marksType": [{ "name": "Posición", "key": "value", "format": "[x,y]", "default": "50,50", "defaultColor": "#222222" }], "flavor": "react", "needsPointerEventsAllowed": false, "limitToOneInstance": false },
                "state": { "url": "myurl",
                    "__marks": {
                        "rm-1511252975055_1": {
                            "id": "rm-1511252975055_1",
                            "title": "prueba",
                            "connectMode": "new",
                            "connection": "cv-1511252975055",
                            "displayMode": "navigate",
                            "value": "25.00,69.94",
                            "color": "#222222" },
                        "rm-1511253025114_1": {
                            "id": "rm-1511253025114_1",
                            "title": "nivel0",
                            "connectMode": "existing",
                            "connection": "pa-1511252985426",
                            "displayMode": "navigate",
                            "value": "50,50",
                            "color": "#222222" } } }, "showTextEditor": false };

            const action = {
                type: ActionTypes.PASTE_BOX,
                payload: {
                    ids: ids,
                    box: {},
                    toolbar: toolbar,
                },

            };

            const newState = JSON.parse(JSON.stringify(state));
            newState["cv-1511252975055"].parent["bo-15118685651356"] = ["rm-1511252975055_1"];
            newState["cv-1511252975055"].boxes = ["bo-1511443052968", ids.id];
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
});

