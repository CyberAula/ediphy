import {combineReducers} from 'redux';
import {SELECT_PAGE, ADD_PAGE, ADD_BOX, SELECT_BOX, MOVE_BOX,
    ADD_SECTION, SELECT_SECTION, EXPAND_SECTION, REMOVE_SECTION,
    TOGGLE_PLUGIN_MODAL, TOGGLE_PAGE_MODAL
} from './actions';

function pageCreator(state = {}, action = {}){
    switch (action.type){
        case ADD_PAGE:
            return {id: action.payload.id, name: action.payload.name, parent: action.payload.parent, level: action.payload.level};
        default:
            return state;
    }
}

function pages(state = [], action = {}){
    switch (action.type){
        case ADD_PAGE:
            return [...state, action.payload.id];
        default:
            return state;
    }
}

function pagesById(state = {}, action = {}){
    switch (action.type){
        case ADD_PAGE:
            return Object.assign({}, state, {[action.payload.id]: pageCreator(state[action.payload.id], action)});
        default:
            return state;
    }
}

function pageSelected(state = -1, action = {}) {
    switch (action.type) {
        case ADD_PAGE:
            return action.payload.id;
        case SELECT_PAGE:
            return action.payload.id;
        default:
            return state;
    }
}

function boxCreator(state = {}, action = {}){
    switch (action.type){
        case ADD_BOX:
            /*
            let styleStr = "min-width: '100px'; min-height: '100px'; background-color: 'yellow'".split(';');
            let style = {};
            styleStr.forEach(item =>{
                let keyValue = item.split(':');
                //We camelCase style keys
                let key = keyValue[0].trim().replace(/-./g,function(char){return char.toUpperCase()[1]});
                style[key] = keyValue[1].trim().replace(/'/g, "");
            });
            */
            let content = "<h1>Placeholder</h1>";

            let position, width, height;
            switch(action.payload.type){
                case 'sortable':
                    position = {x: 0, y: 0};
                    width = '100%';
                    break;
                case 'inner-sortable':
                    position = {x: Math.floor(Math.random() * 500), y: 0};
                    width = 100;
                    height = 100;
                    break;
                default:
                    position = {x: Math.floor(Math.random() * 500), y: Math.floor(Math.random() * 500)}
                    width = 100;
                    height = 100;
                    break;
            }

            return {
                parent: action.payload.parent,
                type: action.payload.type,
                position: position,
                width: width,
                height: height,
                style: {width: width, height: height},
                content: content,
                draggable: action.payload.draggable,
                resizable: action.payload.resizable,
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
            return Object.assign({}, state, {
                [action.payload.id]: boxCreator(state[action.payload.id], action)
            });
        case MOVE_BOX:
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
            return action.payload.id;
        case SELECT_BOX:
            return action.payload.id;
        default:
            return state;
    }
}

function boxes(state = [], action = {}){
    switch (action.type){
        case ADD_BOX:
            return [...state, action.payload.id];
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
            return {id: action.payload.id, parent: action.payload.parent, name: action.payload.name, isExpanded: true, childrenNumber: action.payload.children, level: action.payload.level};
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

function navigationIds(state = [], action = {}){
    switch(action.type){
        case ADD_PAGE:
        case ADD_SECTION:
            return [...state, action.payload.id];
        default:
            return state;
    }
}

function navItemSelected(state = -1, action = {}){
    switch(action.type){
        case SELECT_SECTION:
        case SELECT_PAGE:
            console.log(action);
            return action.payload.id;
        default:
            return state;
    }
}

function togglePluginModal(state = {value: false, caller: -1, fromSortable: false}, action = {}){
    switch(action.type){
        case TOGGLE_PLUGIN_MODAL:
            return action.payload;
        case ADD_BOX:
            return false;
        default:
            return state;
    }
}

function togglePageModal(state = {value: false, caller: -1}, action = {}){
    switch(action.type){
        case TOGGLE_PAGE_MODAL:
            return action.payload;
        default:
            return true;
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
    sectionSelected: sectionSelected, //0
    navigationIds: navigationIds, //[0, 1]
    navItemSelected: navItemSelected,
    boxModalToggled: togglePluginModal,
    pageModalToggled: togglePageModal
});

export default GlobalState;