import {combineReducers} from 'redux';
import {SELECT_PAGE, ADD_PAGE, ADD_BOX, SELECT_BOX, MOVE_BOX, ADD_SECTION, SELECT_SECTION, EXPAND_SECTION, REMOVE_SECTION} from './actions';

function pageCreator(state = {}, action = {}){
    switch (action.type){
        case ADD_PAGE:
            return state;
        default:
            return state;
    }
}

function pages(state = [], action = {}){
    switch (action.type){
        case ADD_PAGE:
            return [...state, action.slideId];
        default:
            return state;
    }
}

function pagesById(state = {}, action = {}){
    switch (action.type){
        case ADD_PAGE:
            return Object.assign({}, state, {[action.slideId]: pageCreator(state[action.slideId], action)});
        default:
            return state;
    }
}

function pageSelected(state = -1, action = {}) {
    switch (action.type) {
        case ADD_PAGE:
            return action.slideId;
        case SELECT_PAGE:
            return action.index;
        default:
            return state;
    }
}

function boxCreator(state = {}, action = {}){
    switch (action.type){
        case ADD_BOX:
            let styleStr = "width: '100px'; height: '100px'; background-color: 'yellow'".split(';');
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
                position: {x: Math.floor(Math.random() * 500), y: Math.floor(Math.random() * 500)},
                width: parseInt(style['width']),
                height: parseInt(style['height']),
                style: style,
                content: "<h1>Hola</h1>",
                fragment: {}
            };
        case MOVE_BOX:
            return Object.assign({}, state, {position: {x: action.payload.x, y: action.payload.y}});
        default:
            return state;
    }
}

function boxesById(state = {}, action = {}){
    switch (action.type){
        case ADD_BOX:
            console.log("Adding box to boxesById with id: " + action.payload.boxId + " to slide with id: " + action.payload.slideId);
            return Object.assign({}, state, {
                [action.payload.boxId]: boxCreator(state[action.payload.boxId], action)
            });
        case MOVE_BOX:
            console.log("Moving box to " + action.payload.x);
            return Object.assign({}, state, {
                [action.payload.id]: boxCreator(state[action.payload.id], action)
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

function sectionsIds(state = [0], action = {}){
    switch(action.type){
        case ADD_SECTION:
            return [...state, action.payload.id];
        case REMOVE_SECTION:
            let newState = state.slice();
            action.payload.ids.forEach(index =>{
                newState.splice(newState.indexOf(index), 1);
            });
            return newState;
        default:
            return state;
    }
}

function sectionCreator(state = {}, action = {}){
    switch (action.type){
        case ADD_SECTION:
            return {id: action.payload.id, parent: action.payload.parent, name: action.payload.name, isExpanded: true, childrenNumber: action.payload.children};
        case EXPAND_SECTION:
            return Object.assign({}, state, {isExpanded: action.payload.newValue});
        default:
            return state;
    }
}

function sectionsById(state = {0: {id: 0, childrenNumber: 0}}, action = {}){
    switch(action.type){
        case ADD_SECTION:
        case EXPAND_SECTION:
            return Object.assign({}, state, {[action.payload.id]: sectionCreator(state[action.payload.id], action)});
        case REMOVE_SECTION:
            let newState = Object.assign({}, state);
            action.payload.ids.map(id =>{
                delete newState[id];
            });
            return newState;
        default:
            return state;
    }
}

function sectionSelected(state = -1, action = {}){
    switch(action.type){
        case SELECT_SECTION:
            return action.payload.id;
        case ADD_SECTION:
            return action.payload.id;
        case REMOVE_SECTION:
            return -1;
        default:
            return state;
    }
}

const GlobalState = combineReducers({
    pageSelected: pageSelected, //0
    pages: pages, //[0, 1]
    pagesById: pagesById, //{0: page0, 1: page1}
    boxesById: boxesById, //{0: box0, 1: box1}
    boxSelected: boxSelected, //0
    boxes: boxes, //[0, 1]
    sections: sectionsIds, //[0, 1]
    sectionsById: sectionsById, //{0: section0, 1: section1}
    sectionSelected: sectionSelected
});

export default GlobalState;