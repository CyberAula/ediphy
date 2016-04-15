import fetch from 'isomorphic-fetch'

export const ADD_BOX = 'ADD_BOX';
export const SELECT_BOX = 'SELECT_BOX';
export const MOVE_BOX = 'MOVE_BOX';
export const RESIZE_BOX = 'RESIZE_BOX';
export const UPDATE_BOX = 'UPDATE_BOX';
export const DELETE_BOX = 'DELETE_BOX';
export const REORDER_BOX = 'REORDER_BOX';
export const DROP_BOX = 'DROP_BOX';
export const INCREASE_LEVEL = 'INCREASE_LEVEL';
export const DUPLICATE_SECTION = 'DUPLICATE_SECTION';

export const RESIZE_SORTABLE_CONTAINER = 'RESIZE_SORTABLE_CONTAINER';
export const CHANGE_COLS = 'CHANGE_COLS';
export const CHANGE_ROWS = 'CHANGE_ROWS';

export const ADD_NAV_ITEM = 'ADD_NAV_ITEM';
export const SELECT_NAV_ITEM = 'SELECT_NAV_ITEM';
export const EXPAND_NAV_ITEM = 'EXPAND_NAV_ITEM';
export const REMOVE_NAV_ITEM = 'REMOVE_NAV_ITEM';

export const TOGGLE_PAGE_MODAL = 'TOGGLE_PAGE_MODAL';
export const TOGGLE_TEXT_EDITOR = 'TOGGLE_TEXT_EDITOR';
export const TOGGLE_TITLE_MODE = 'TOGGLE_TITLE_MODE';
export const CHANGE_DISPLAY_MODE = 'CHANGE_DISPLAY_MODE';
export const SET_BUSY = 'SET_BUSY';
export const UPDATE_TOOLBAR = 'UPDATE_TOOLBAR';
export const COLLAPSE_TOOLBAR = 'COLLAPSE_TOOLBAR';

export const IMPORT_STATE = 'IMPORT_STATE';

export function selectNavItem(id){
    return {type: SELECT_NAV_ITEM, payload: {id}};
}

export function addNavItem(id, name, parent, children, level, type, position){
    return {type: ADD_NAV_ITEM, payload: {id, name, parent, children, level, type, position}};
}

export function expandNavItem(id, value){
    return {type: EXPAND_NAV_ITEM, payload: {id, value}};
}

export function removeNavItem(ids, parent, boxes){
    return {type: REMOVE_NAV_ITEM, payload: {ids, parent, boxes}};
}


export function addBox(ids, type, draggable, resizable, content, toolbar, config, sections, state, initialParams){
    return {type: ADD_BOX, payload: {ids, type,  draggable, resizable, content, toolbar, config, sections, state, initialParams}};
}

export function selectBox(id){
    return {type: SELECT_BOX, payload: {id}};
}

export function moveBox(id, x, y){
    return {type: MOVE_BOX, payload: {id, x, y}};
}

export function resizeBox(id, width, height){
    return {type: RESIZE_BOX, payload: {id, width, height}};
}

export function updateBox(id, content, state){
    return {type: UPDATE_BOX, payload: {id, content, state}};
}

export function deleteBox(id, parent, container){
    return {type: DELETE_BOX, payload: {id, parent, container}};
}

export function reorderBox(ids,parent){
    return {type: REORDER_BOX, payload: {ids, parent}};
}

export function dropBox(id, row, col){
    return {type: DROP_BOX, payload: {id, row, col}};
}

export function increaseBoxLevel(){
    return {type: INCREASE_LEVEL, payload: {}};
}


export function resizeSortableContainer(id, parent, height){
    return {type: RESIZE_SORTABLE_CONTAINER, payload: {id, parent, height}};
}

export function changeCols(id, parent, distribution){
    return {type: CHANGE_COLS, payload: {id, parent, distribution}};
}

export function changeRows(id, parent, column, distribution){
    return {type: CHANGE_ROWS, payload: {id, parent, column, distribution}};
}

export function duplicateSection(id){
    return {type: DUPLICATE_SECTION, payload: {id}};
}

export function togglePageModal(caller, value){
    return {type: TOGGLE_PAGE_MODAL, payload: {caller, value}};
}

export function toggleTextEditor(caller, value){
    return {type: TOGGLE_TEXT_EDITOR, payload: {caller, value}};
}

export function toggleTitleMode(id, value){
    return {type: TOGGLE_TITLE_MODE, payload: {id, value}};
}

export function changeDisplayMode(mode){
    return {type: CHANGE_DISPLAY_MODE, payload: {mode}};
}

export function setBusy(value, msg){
    return {type: SET_BUSY, payload: {value, msg}};
}

export function importState(state){
    return {type: IMPORT_STATE, payload: state};
}

export function updateToolbar(caller, index, name, value){
    return {type: UPDATE_TOOLBAR, payload: {caller, index, name, value}};
}

export function collapseToolbar(id){
    return {type: COLLAPSE_TOOLBAR, payload: {id}};
}

//Async actions
export function exportStateAsync(state){
    return dispatch => {

        // First dispatch: the app state is updated to inform
        // that the API call is starting.
        dispatch(setBusy(true, "Exporting..."));

        // The function called by the thunk middleware can return a value,
        // that is passed on as the return value of the dispatch method.

        // In this case, we return a promise to wait for.
        // This is not required by thunk middleware, but it is convenient for us.
        return fetch('http://127.0.0.1:8081/saveConfig', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(state)
        })
            .then(response => {
                if(response.status >= 400)
                    throw new Error("Error while exporting");
                return true;
            })
            .then(result => {
                dispatch(setBusy(false, "Success!"))
            })
            .catch(e =>{
                dispatch(setBusy(false, e.message));
            });
    }
}

export function importStateAsync(){
    return dispatch => {
        dispatch(setBusy(true, "Importing..."));

        return fetch('http://127.0.0.1:8081/getConfig')
            .then(response => {
                if(response.status >= 400)
                    throw new Error("Error while importing");
                return response.text();
            })
            .then(result => {
                dispatch(importState(JSON.parse(result)));
                return true;
            })
            .then(result =>{
                dispatch(setBusy(false, "Success!"));
            })
            .catch(e =>{
                dispatch(setBusy(false, e.message));
            });
    }
}