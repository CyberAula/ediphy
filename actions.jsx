export const SET_SLIDE = 'SET_SLIDE';
export const ADD_SLIDE = 'ADD_SLIDE';
export const ADD_BOX = 'ADD_BOX';
export const SELECT_BOX = 'SELECT_BOX';

export function setSlide(index){
    return {type: SET_SLIDE, index};
}

export function addSlide(id){
    return {type: ADD_SLIDE, slideId: id};
}

export function addBox(slideId, boxId, type){
    return {type: ADD_BOX, payload: {slideId, boxId, type}};
}

export function selectBox(id){
    return {type: SELECT_BOX, id};
}