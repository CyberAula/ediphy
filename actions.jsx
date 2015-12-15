export const SELECT_PAGE = 'SELECT_PAGE';
export const ADD_PAGE = 'ADD_PAGE';
export const ADD_BOX = 'ADD_BOX';
export const SELECT_BOX = 'SELECT_BOX';
export const MOVE_BOX = 'MOVE_BOX';

export const ADD_SECTION = 'ADD_SECTION';
export const SELECT_SECTION = 'SELECT_SECTION';
export const EXPAND_SECTION = 'EXPAND_SECTION';
export const REMOVE_SECTION = 'REMOVE_SECTION';
export const DUPLICATE_SECTION = 'DUPLICATE_SECTION';

export const TOGGLE_PLUGIN_MODAL = 'TOGGLE_PLUGIN_MODAL';
export const TOGGLE_PAGE_MODAL = 'TOGGLE_PAGE_MODAL';

export function selectPage(id){
    return {type: SELECT_PAGE, payload: {id}};
}

export function addPage(id, name, parent, level){
    return {type: ADD_PAGE, payload: {id, name, parent, level}};
}

export function addBox(parent, id, type, draggable, resizable){
    return {type: ADD_BOX, payload: {parent, id, type, draggable, resizable}};
}

export function selectBox(id){
    return {type: SELECT_BOX, payload: {id}};
}

export function moveBox(id, x, y){
    return {type: MOVE_BOX, payload: {id, x, y}}
}

export function addSection(id, parent, name, children, level){
    return {type: ADD_SECTION, payload: {id, parent, name, children, level}};
}

export function selectSection(id){
    return {type: SELECT_SECTION, payload: {id}};
}

export function expandSection(id, newValue){
    return {type: EXPAND_SECTION, payload: {id, newValue}}
}

export function removeSection(ids){
    return {type: REMOVE_SECTION, payload: {ids}}
}

export function duplicateSection(id){
    return {type: DUPLICATE_SECTION, payload: {id}}
}

export function togglePluginModal(caller, fromSortable, value){
    return {type: TOGGLE_PLUGIN_MODAL, payload: {caller, fromSortable, value}}
}

export function togglePageModal(caller, value){
    return {type: TOGGLE_PAGE_MODAL, payload: {caller, value}}
}