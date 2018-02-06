import { testState } from '../../core/store/state.tests.js';
import nav_items_by_id from '../nav_items_by_id';
import * as ActionTypes from '../../common/actions';
import { isContainedView, isSortableContainer, isView, isSlide } from "../../common/utils";
import { CHANGE_BOX_LAYER } from "../../common/actions";

const state = testState.present.navItemsById;

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
                        { parent: 'pa-1511252952332', id: 'bo-1511443052929', container: 0 },
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
            newState['pa-1511252952332'].boxes = ['bo-1511443052929'];

            expect(isView(action.payload.ids.parent)).toBeTruthy();
            expect(nav_items_by_id(state, action)).toEqual(newState);
        });
    });

    describe('handle MOVE_BOX', () => {
        test('If box moved in a slide', () => {
            const action = {
                type: ActionTypes.MOVE_BOX,
                payload: {
                    id: 'bo-1511252970033',
                    x: '29.42%',
                    y: '29.26%',
                    position: 'absolute',
                    parent: 'pa-1511252955865',
                    container: 0,
                },
            };
            const newState = JSON.parse(JSON.stringify(state));
            expect(nav_items_by_id(state, action)).toEqual(newState);
        });
    });

    describe('handle ADD_NAV_ITEM', () => {
        test('If nav item added is a section', () => {
            const newSection = { boxes: [],
                children: [],
                extraFiles: {},
                background: "rgb(255,255,255)",
                header: {
                    display: {
                        breadcrumb: "reduced",
                        courseTitle: "hidden",
                        documentSubTitle: "hidden",
                        documentTitle: "expanded",
                        pageNumber: "hidden",
                    },
                    elementContent: {
                        documentSubTitle: "",
                        documentTitle: "",
                        numPage: "",
                    },
                },
                hidden: false,
                id: "se-1512393803085",
                isExpanded: true,
                level: 2,
                linkedBoxes: {},
                name: "Sección",
                parent: "se-1467887497411",
                type: "section",
                "unitNumber": 1 };
            const action = {
                type: ActionTypes.ADD_NAV_ITEM,
                payload: {
                    id: 'se-1512393803085',
                    name: 'Sección',
                    parent: 'se-1467887497411',
                    type: 'section',
                    position: 4,
                    hasContent: false,
                },
            };
            const newState = JSON.parse(JSON.stringify(state));
            newState['se-1512393803085'] = newSection;
            newState['se-1467887497411'].isExpanded = true;
            newState['se-1467887497411'].children = ["pa-1497983247795", "pa-1511252952332", "se-1511252954307", "se-1512393803085"];
            expect(nav_items_by_id(state, action)).toEqual(newState);
        });
        test('If nav item added is a document', () => {
            const newPage = { boxes: [],
                children: [],
                extraFiles: {},
                header: {
                    display: {
                        breadcrumb: "reduced",
                        courseTitle: "hidden",
                        documentSubTitle: "hidden",
                        documentTitle: "expanded",
                        pageNumber: "hidden",
                    },
                    elementContent: {
                        documentSubTitle: "",
                        documentTitle: "",
                        numPage: "",
                    },
                },
                hidden: false,
                id: "pa-1512395563240",
                isExpanded: true,
                level: 2,
                linkedBoxes: {},
                name: "Página",
                background: "rgb(255,255,255)",
                parent: "se-1467887497411",
                type: "document",
                "unitNumber": 1 };
            const action = {
                type: ActionTypes.ADD_NAV_ITEM,
                payload: {
                    id: 'pa-1512395563240',
                    name: 'Página',
                    parent: 'se-1467887497411',
                    type: 'document',
                    position: 4,
                    hasContent: true,
                },
            };
            const newState = JSON.parse(JSON.stringify(state));
            newState['pa-1512395563240'] = newPage;
            newState['se-1467887497411'].isExpanded = true;
            newState['se-1467887497411'].children = ["pa-1497983247795", "pa-1511252952332", "se-1511252954307", 'pa-1512395563240'];
            expect(nav_items_by_id(state, action)).toEqual(newState);
        });
    });

    describe('handle CHANGE_NAV_ITEM_NAME', () => {
        test('If nav item name changed', () => {
            const action = {
                type: ActionTypes.CHANGE_NAV_ITEM_NAME,
                payload: {
                    id: 'pa-1497983247795',
                    title: 'Título de prueba',
                },
            };
            const newState = JSON.parse(JSON.stringify(state));
            newState['pa-1497983247795'].name = action.payload.title;
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

    // describe('handle CHANGE_UNIT_NUMBER *********************** TODO :)', ()=>{
    //     test('If unit number changed', () => {
    //         // expect(nav_items_by_id(state, {})).toEqual(state);
    //     });
    // });

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
                    id: 'bo-1511252970033',
                    parent: 'pa-1511252955865',
                    container: 0,
                    children: [],
                    cvs: [],
                },
            };
            const newState = JSON.parse(JSON.stringify(state));

            newState['pa-1511252955865'].boxes = ["bo-1511252970034"];

            expect(isView(action.payload.parent)).toBeTruthy();
            expect(action.payload.parent !== 0).toBeTruthy();
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
                    id: 'se-1511252954307',
                    value: false,
                },
            };
            const newState = JSON.parse(JSON.stringify(state));
            newState['se-1511252954307'].isExpanded = action.payload.value;
            expect(nav_items_by_id(state, action)).toEqual(newState);
        });
    });

    describe('handle DELETE_NAV_ITEM', () => {
        test('If nav item deleted', () => {
            const action = {
                type: ActionTypes.DELETE_NAV_ITEM,
                payload: {
                    ids: ['pa-1497983247795'],
                    parent: 'se-1467887497411',
                    boxes: ['bs-1497983247797'],
                    containedViews: {},
                    linkedBoxes: {},
                },
            };
            const newState = JSON.parse(JSON.stringify(state));
            // Prepare the newState
            delete newState[action.payload.ids];
            // This reducer
            newState[action.payload.parent].children = ["pa-1511252952332", "se-1511252954307"];
            expect(nav_items_by_id(state, action)).toEqual(newState);
        });
    });

    describe('handle REORDER_NAV_ITEM', () => {
        test('If nav item reordered', () => {
            const action = {
                type: ActionTypes.REORDER_NAV_ITEM,
                payload: {
                    id: 'pa-1511252955865',
                    newParent: 'se-1467887497411',
                    oldParent: 'se-1511252954307',
                    idsInOrder: ["se-1467887497411", "pa-1497983247795", "pa-1511252955865", "pa-1511252952332", "se-1511252954307", "pa-1511252955321", "pa-1511252985426"],
                    childrenInOrder: ["pa-1497983247795", "pa-1511252955865", "pa-1511252952332", "se-1511252954307"],
                },
            };
            const newState = JSON.parse(JSON.stringify(state));

            newState[action.payload.id].parent = action.payload.newParent;
            newState[action.payload.id].level = 2;

            newState[action.payload.newParent].children = action.payload.childrenInOrder;
            newState[action.payload.oldParent].children = ["pa-1511252955321"];

            expect(nav_items_by_id(state, action)).toEqual(newState);
        });
    });

    describe('handle TOGGLE_NAV_ITEM', () => {
        test('If nav item toggled (show/hide)', () => {
            const action = {
                type: ActionTypes.TOGGLE_NAV_ITEM,
                payload: {
                    id: 'pa-1497983247795',
                },
            };
            const newState = JSON.parse(JSON.stringify(state));
            newState["pa-1497983247795"].hidden = true;

            expect(nav_items_by_id(state, action)).toEqual(newState);
        });
    });

    describe('handle TOGGLE_TITLE_MODE', ()=>{
        test('If toggle course title option', () => {
            const action = {
                type: ActionTypes.TOGGLE_TITLE_MODE,
                payload: {
                    id: 'pa-1497983247795',
                    titles: {
                        elementContent: {
                            documentTitle: "",
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
            newState['pa-1497983247795'].header = action.payload.titles;
            expect(nav_items_by_id(state, action)).toEqual(newState);
        });
    });

    describe('handle ADD_RICH_MARK', () => {
        // the anv_item_by_id reducer only need test in case mark links with an existing page
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
            const newState = JSON.parse(JSON.stringify(state));

            newState['pa-1497983247795'].linkedBoxes = { 'bo-1511252970033': ["rm-1511786135103"] };
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
            newState['pa-1511252955865'].linkedBoxes = { 'bo-1511252970033': ["rm-1511786135103"] };
            expect(!isContainedView(action.payload.newConnection)).toBeTruthy();
            expect(nav_items_by_id(state, action)).toEqual(newState);
        });
    });

    describe('handle DELETE_RICH_MARK', () => {
        test('If rich mark deleted and is in a view (but not a contained view)', () => {
            const action = {
                type: ActionTypes.DELETE_RICH_MARK,
                payload: {
                    id: 'rm-1511253025114',
                    parent: 'bo-1511252970033',
                    cvid: 'pa-1511252985426',
                    state: {},
                },
            };
            const newState = JSON.parse(JSON.stringify(state));
            newState['pa-1511252985426'].linkedBoxes = {};
            expect(!isContainedView(action.payload.cvid)).toBeTruthy();
            expect(nav_items_by_id(state, action)).toEqual(newState);
        });
    });
    describe('handle CHANGE_BOX_LAYER', () => {
        test('Bring to front selected_box in a slide', () => {
            const action = {
                type: ActionTypes.CHANGE_BOX_LAYER,
                payload: {
                    id: 'bo-1511252970033',
                    parent: 'pa-1511252955865',
                    container: 0,
                    value: 'front',
                    boxes_array: ['bo-1511252970033', 'bo-1511252970034'],
                },
            };
            const newState = JSON.parse(JSON.stringify(state));
            newState['pa-1511252955865'].boxes = ['bo-1511252970034', 'bo-1511252970033'];
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
                "parent": "bs-1497983247797",
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
                    ids: { parent: 'bs-1497983247797', container: 'sc-1511868565133', id: 'bo-1511868565135' },
                    box: boxPasted,
                    toolbar: {},
                },

            };

            expect(nav_items_by_id(state, action)).toEqual(state);
        });
        test('If box pasted to slide', () => {
            let ids = { parent: "pa-1511252952332", container: 0, id: 'bo-151186856512235' };

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
            newState[ids.parent].boxes = [ids.id];

            expect(nav_items_by_id(state, action)).toEqual(newState);

        });
        test('If box pasted to cv slide with mark to navItem', () => {

            let ids = {
                "id": "bo-15118685651356",
                "parent": "cv-1511252975055",
                "container": 0,

            };
            let toolbar = { "id": "bo-15118685651356", "controls": { "main": { "__name": "Main", "accordions": { "basic": { "__name": "Fuente", "icon": "link", "buttons": { "url": { "__name": "URL", "type": "external_provider", "value": "myurl", "accept": "image/*", "autoManaged": false } } }, "style": { "__name": "Estilo caja", "icon": "palette", "buttons": { "padding": { "__name": "Padding", "type": "number", "value": 0, "min": 0, "max": 100, "autoManaged": true }, "backgroundColor": { "__name": "Color de fondo", "type": "color", "value": "#ffffff", "autoManaged": true }, "borderWidth": { "__name": "Grosor de borde", "type": "number", "value": 0, "min": 0, "max": 10, "autoManaged": true }, "borderStyle": { "__name": "Estilo de borde", "type": "select", "value": "solid", "options": ["none", "hidden", "dotted", "dashed", "solid", "double", "groove", "ridge", "inset", "outset", "initial", "inherit"], "autoManaged": true }, "borderColor": { "__name": "Color de borde", "type": "color", "value": "#000000", "autoManaged": true }, "borderRadius": { "__name": "Radio", "type": "number", "value": 0, "min": 0, "max": 50, "autoManaged": true }, "opacity": { "__name": "Opacidad", "type": "range", "value": 1, "min": 0, "max": 1, "step": 0.01, "autoManaged": true } } }, "__sortable": { "key": "structure", "__name": "Estructura", "icon": "border_all", "buttons": { "__width": { "__name": "Ancho", "type": "number", "displayValue": 25, "value": 25, "step": 5, "units": "%", "auto": false, "autoManaged": true }, "__height": { "__name": "Altura", "type": "text", "displayValue": "auto", "value": "20", "step": 5, "units": "%", "auto": true, "autoManaged": true }, "__rotate": { "__name": "Rotar (º)", "type": "range", "value": 0, "min": 0, "max": 360, "autoManaged": false }, "__aspectRatio": { "__name": "Relación de aspecto", "type": "checkbox", "checked": true, "autoManaged": true } } }, "z__extra": { "__name": "Alias", "icon": "rate_review", "buttons": { "alias": { "__name": "Alias", "type": "text", "value": "", "autoManaged": true, "isAttribute": true } } }, "__marks_list": { "key": "marks_list", "__name": "Lista de marcas", "icon": "room", "buttons": {} } } } }, "config": { "name": "HotspotImages", "displayName": "Imagen enriquecida", "category": "image", "needsConfigModal": false, "needsConfirmation": false, "needsTextEdition": false, "needsXMLEdition": false, "aspectRatioButtonConfig": { "location": ["main", "__sortable"], "defaultValue": true, "name": "Relación de aspecto" }, "allowFloatingBox": true, "icon": "image", "iconFromUrl": false, "isRich": true, "marksType": [{ "name": "Posición", "key": "value", "format": "[x,y]", "default": "50,50", "defaultColor": "#222222" }], "flavor": "react", "needsPointerEventsAllowed": false, "limitToOneInstance": false }, "state": { "url": "myurl", "__marks": { "rm-1511252975055": { "id": "rm-1511252975055", "title": "prueba", "connectMode": "new", "connection": "cv-1511252975055", "displayMode": "navigate", "value": "25.00,69.94", "color": "#222222" },
                "rm-1511253025114_1": { "id": "rm-1511253025114_1", "title": "nivel0", "connectMode": "existing", "connection": "pa-1511252985426", "displayMode": "navigate", "value": "50,50", "color": "#222222" } } }, "showTextEditor": false,
            };
            const action = {
                type: ActionTypes.PASTE_BOX,
                payload: {
                    ids: ids,
                    box: {},
                    toolbar: toolbar,
                },

            };

            let newState = JSON.parse(JSON.stringify(state));
            newState["pa-1511252985426"].linkedBoxes["bo-15118685651356"] = {};
            newState["pa-1511252985426"].linkedBoxes["bo-15118685651356"] = ["rm-1511253025114_1"];
            expect(nav_items_by_id(state, action)).toEqual(newState);
        });
    });
});
