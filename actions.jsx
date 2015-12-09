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

export function selectPage(index){
    return {type: SELECT_PAGE, index};
}

export function addPage(id){
    return {type: ADD_PAGE, slideId: id};
}

export function addBox(slideId, boxId, type){
    return {type: ADD_BOX, payload: {slideId, boxId, type}};
}

export function selectBox(id){
    return {type: SELECT_BOX, id};
}

export function moveBox(id, x, y){
    return {type: MOVE_BOX, payload: {id, x, y}}
}

export function addSection(id, parent, name, children){
    return {type: ADD_SECTION, payload: {id, parent, name, children}};
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