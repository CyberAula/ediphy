import {combineReducers} from 'redux';
import undoable, {excludeAction} from 'redux-undo';

import {ADD_BOX, SELECT_BOX, MOVE_BOX, RESIZE_BOX,
    ADD_NAV_ITEM, SELECT_NAV_ITEM, EXPAND_NAV_ITEM, REMOVE_NAV_ITEM,
    TOGGLE_PLUGIN_MODAL, TOGGLE_PAGE_MODAL
} from './actions';

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
                    width = 200;
                    height = 80;
                    break;
                default:
                    position = {x: Math.floor(Math.random() * 500), y: Math.floor(Math.random() * 500)}
                    width = 200;
                    height = 80;
                    break;
            }

            return {
                id: action.payload.id,
                parent: action.payload.parent,
                type: action.payload.type,
                position: position,
                width: width,
                height: height,
                content: content,
                draggable: action.payload.draggable,
                resizable: action.payload.resizable,
                fragment: {}
            };
        case MOVE_BOX:
            return Object.assign({}, state, {position: {x: action.payload.x, y: action.payload.y}});
        case RESIZE_BOX:
            return Object.assign({}, state, {width: action.payload.width, height: action.payload.height});
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
        case RESIZE_BOX:
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

function navItemCreator(state = {}, action = {}){
    switch (action.type){
        case ADD_NAV_ITEM:
            return {id: action.payload.id,
                name: action.payload.name,
                isExpanded: true,
                parent: action.payload.parent,
                children: action.payload.children,
                level: action.payload.level,
                type: action.payload.type
            };
        case EXPAND_NAV_ITEM:
            return Object.assign({}, state, {isExpanded: action.payload.value});
        default:
            return state;
    }
}

function navItemsIds(state = [], action = {}){
    switch(action.type){
        case ADD_NAV_ITEM:
            let nState = state.slice();
            nState.splice(action.payload.position, 0, action.payload.id);
            return nState;
        case REMOVE_NAV_ITEM:
            let newState = state.slice();
            action.payload.ids.forEach(id =>{
                newState.splice(newState.indexOf(id), 1);
            });
            return newState;
        default:
            return state;
    }
}

function navItemsById(state = {}, action = {}){
    switch(action.type){
        case ADD_NAV_ITEM:
            return Object.assign({}, state, {
                [action.payload.id]: navItemCreator(state[action.payload.id], action),
                [action.payload.parent]: Object.assign({}, state[action.payload.parent], {children: [...state[action.payload.parent].children, action.payload.id]})
            });
        case EXPAND_NAV_ITEM:
            return Object.assign({}, state, {[action.payload.id]: navItemCreator(state[action.payload.id], action)});
        case REMOVE_NAV_ITEM:
            let newState = Object.assign({}, state);
            action.payload.ids.map(id =>{
                delete newState[id];
            });
            let newChildren = newState[action.payload.parent].children.slice();
            newChildren.splice(newChildren.indexOf(action.payload.ids[0]), 1);

            return Object.assign({}, newState, {[action.payload.parent]: Object.assign({}, newState[action.payload.parent], {children: newChildren})});
        default:
            return state;
    }
}

function navItemSelected(state = 0, action = {}){
    switch(action.type){
        case SELECT_NAV_ITEM:
            return action.payload.id;
        case ADD_NAV_ITEM:
            return action.payload.id;
        case REMOVE_NAV_ITEM:
            return 0;
        default:
            return state;
    }
}

function togglePluginModal(state = {value: false, caller: 0, fromSortable: false}, action = {}){
    switch(action.type){
        case TOGGLE_PLUGIN_MODAL:
            return action.payload;
        case ADD_BOX:
            return {value: false, caller: 0};
        default:
            return state;
    }
}

function togglePageModal(state = {value: false, caller: 0}, action = {}){
    switch(action.type){
        case TOGGLE_PAGE_MODAL:
            return action.payload;
        case ADD_NAV_ITEM:
            return {value: false, caller: 0};
        default:
            return state;
    }
}

const GlobalState = undoable(combineReducers({
    boxModalToggled: togglePluginModal,
    pageModalToggled: togglePageModal,
    boxesById: boxesById, //{0: box0, 1: box1}
    boxSelected: boxSelected, //0
    boxes: boxes, //[0, 1]
    navItemsIds: navItemsIds, //[0, 1]
    navItemSelected: navItemSelected, // 0
    navItemsById: navItemsById // {0: navItem0, 1: navItem1}
}), {filter: excludeAction([EXPAND_NAV_ITEM, TOGGLE_PAGE_MODAL, TOGGLE_PLUGIN_MODAL])});

export default GlobalState;