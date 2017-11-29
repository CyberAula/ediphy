import { testState } from '../../core/store/state.tests.js';
import nav_items_by_id from '../nav_items_by_id';
import * as ActionTypes from '../../common/actions';

const state = testState.present.navItemsById;

// console.log(state);

describe('# nav_items_by_id reducer ******************************************************************* TODO :)', ()=>{

    describe('DEFAULT', ()=>{
        test('Should return test.state as default', () => {
            expect(nav_items_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle ADD_BOX', ()=>{
        test('If added box', () => {
            // expect(nav_items_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle MOVE_BOX', ()=>{
        test('If moved box', () => {
            // expect(nav_items_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle ADD_NAV_ITEM', ()=>{
        test('If nav item added', () => {
            // expect(nav_items_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle CHANGE_NAV_ITEM_NAME', ()=>{
        test('If nav item name changed', () => {
            // expect(nav_items_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle CHANGE_UNIT_NUMBER', ()=>{
        test('If unit number changed', () => {
            // expect(nav_items_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle DELETE_BOX', ()=>{
        test('If box deleted', () => {
            // expect(nav_items_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle DELETE_SORTABLE_CONTAINER', ()=>{
        test('If sortable container deleted', () => {
            // expect(nav_items_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle DUPLICATE_BOX', ()=>{
        test('If duplicated box', () => {
            // expect(nav_items_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle EXPAND_NAV_ITEM', ()=>{
        test('If nav item expanded', () => {
            // expect(nav_items_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle REORDER_NAV_ITEM', ()=>{
        test('If nav item reordered', () => {
            // expect(nav_items_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle DELETE_NAV_ITEM', ()=>{
        test('If nav item deleted', () => {
            // expect(nav_items_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle TOGGLE_NAV_ITEM', ()=>{
        test('If nav item toggled', () => {
            // expect(nav_items_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle TOGGLE_TITLE_MODE', ()=>{
        test('If title mode toggled', () => {
            // expect(nav_items_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle ADD_RICH_MARK', ()=>{
        test('If rich mark added', () => {
            // expect(nav_items_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle EDIT_RICH_MARK', ()=>{
        test('If rich mark edited', () => {
            // expect(nav_items_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle DELETE_RICH_MARK', ()=>{
        test('If rich mark deleted', () => {
            // expect(nav_items_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle PASTE_BOX', ()=>{
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
        // expect(boxes_by_id(state, {})).toEqual(state);
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
    describe('handle UPDATE_NAV_ITEM_EXTRA_FILES', ()=>{
        test('If updated nav items extra files', () => {
            // expect(nav_items_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle IMPORT_STATE', ()=>{
        test('If state imported', () => {
            // expect(nav_items_by_id(state, {})).toEqual(state);
        });
    });

});

// Single nav item reducer
//* *************************************************************************************************

describe('# single nav_item reducer ******************************************************************* TODO :)', ()=>{
    describe('handle ADD_BOX', ()=>{
        test('If added box', () => {
            // expect(nav_items_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle MOVE_BOX', ()=>{
        test('If moved box', () => {
            // expect(nav_items_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle ADD_NAV_ITEM', ()=>{
        test('If nav item added', () => {
            // expect(nav_items_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle CHANGE_NAV_ITEM_NAME', ()=>{
        test('If nav item name changed', () => {
            // expect(nav_items_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle CHANGE_UNIT_NUMBER', ()=>{
        test('If unit number changed', () => {
            // expect(nav_items_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle DELETE_BOX', ()=>{
        test('If box deleted', () => {
            // expect(nav_items_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle DELETE_RICH_MARK', ()=>{
        test('If rich mark deleted', () => {
            // expect(nav_items_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle EXPAND_NAV_ITEM', ()=>{
        test('If nav item expanded', () => {
            // expect(nav_items_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle DELETE_NAV_ITEM', ()=>{
        test('If nav item deleted', () => {
            // expect(nav_items_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle REORDER_NAV_ITEM', ()=>{
        test('If nav item reordered', () => {
            // expect(nav_items_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle TOGGLE_NAV_ITEM', ()=>{
        test('If nav item toggled', () => {
            // expect(nav_items_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle TOGGLE_TITLE_MODE', ()=>{
        test('If title mode toggled', () => {
            // expect(nav_items_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle ADD_RICH_MARK', ()=>{
        test('If rich mark added', () => {
            // expect(nav_items_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle UPDATE_NAV_ITEM_EXTRA_FILES', ()=>{
        test('If updated nav items extra files', () => {
            // expect(nav_items_by_id(state, {})).toEqual(state);
        });
    });

});
