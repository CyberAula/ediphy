export const ADD_BOX = 'ADD_BOX';
export const SELECT_BOX = 'SELECT_BOX';
export const MOVE_BOX = 'MOVE_BOX';

export const REMOVE_SECTION = 'REMOVE_SECTION';
export const DUPLICATE_SECTION = 'DUPLICATE_SECTION';

export const ADD_NAV_ITEM = 'ADD_NAV_ITEM';
export const SELECT_NAV_ITEM = 'SELECT_NAV_ITEM';
export const EXPAND_NAV_ITEM = 'EXPAND_NAV_ITEM';

export const TOGGLE_PLUGIN_MODAL = 'TOGGLE_PLUGIN_MODAL';
export const TOGGLE_PAGE_MODAL = 'TOGGLE_PAGE_MODAL';

export function selectNavItem(id){
    return {type: SELECT_NAV_ITEM, payload: {id}};
}

export function addNavItem(id, name, parent, children, level, type){
    return {type: ADD_NAV_ITEM, payload: {id, name, parent, children, level, type}};
}

export function expandNavItem(id, value){
    return {type: EXPAND_NAV_ITEM, payload: {id, value}}
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