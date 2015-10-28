import {combineReducers} from 'redux';
import {SELECT_SLIDE, ADD_SLIDE, ADD_BOX, SELECT_BOX} from './actions';

function slideCreator(state = {}, action = {}){
    switch (action.type){
        case ADD_SLIDE:
            return state;
        default:
            return state;
    }
}

function slides(state = [], action = {}){
    switch (action.type){
        case ADD_SLIDE:
            console.log("Adding slide to slides with id: " + action.slideId);
            return [...state, action.slideId];
        default:
            return state;
    }
}

function slidesById(state = {}, action = {}){
    switch (action.type){
        case ADD_SLIDE:
            console.log("Adding slide to slidesById with id: " + action.slideId);
            return Object.assign({}, state, {
                [action.slideId]: slideCreator(state[action.slideId], action)
            });
        default:
            return state;
    }
}

function slideSelected(state = -1, action = {}) {
    switch (action.type) {
        case ADD_SLIDE:
            console.log("Setting slide");
            return action.slideId;
        case SELECT_SLIDE:
            console.log("Setting slide");
            return action.index;
        default:
            return state;
    }
}

function boxCreator(state = {}, action = {}){
    switch (action.type){
        case ADD_BOX:
            let styleStr = "width: '100px'; height: '100px'; border: 'solid black 5px'; background-color: 'yellow'".split(';');
            let style = {};
            styleStr.forEach(item =>{
                let keyValue = item.split(':');
                //We camelCase style keys
                let key = keyValue[0].trim().replace(/-./g,function(char){return char.toUpperCase()[1]});
                style[key] = keyValue[1].trim().replace(/'/g, "");
            });
            return {
                slideId: action.payload.slideId,
                type: action.payload.type,
                position: {x: Math.floor(Math.random() * 100), y: Math.floor(Math.random() * 100)},
                style: style,
                content: "<h1>Hola</h1>",
                fragment: {}
            };
        default:
            return state;
    }
}

function boxesById(state = {}, action = {}){
    switch (action.type){
        case ADD_BOX:
            console.log("Adding box to boxesById with id: " + action.payload.boxId + " to slide with id: " + action.payload.slideId);
            return Object.assign({}, state, {
                [action.payload.boxId]: boxCreator(state[action.boxId], action)
            });
        default:
            return state;
    }
}

function boxSelected(state = -1, action = {}) {
    switch (action.type) {
        case ADD_BOX:
            console.log("Selecting box with id: " + action.payload.boxId);
            return action.payload.boxId;
        case SELECT_BOX:
            console.log("Selecting box");
            return action.id;
        default:
            return state;
    }
}

function boxes(state = [], action = {}){
    switch (action.type){
        case ADD_BOX:
            console.log("Adding box to boxes with id: " + action.payload.boxId);
            return [...state, action.payload.boxId];
        default:
            return state;
    }
}

const GlobalState = combineReducers({
    slideSelected: slideSelected, //0
    slides: slides, //[0, 1]
    slidesById: slidesById, //{0: slide0, 1: slide1}
    boxesById: boxesById, //{0: box0, 1: box1}
    boxSelected: boxSelected, //0
    boxes: boxes //[0, 1]
});

export default GlobalState;