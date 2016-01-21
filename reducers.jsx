import {combineReducers} from 'redux';
import undoable, {excludeAction} from 'redux-undo';

import {ADD_BOX, SELECT_BOX, MOVE_BOX, RESIZE_BOX,
    ADD_NAV_ITEM, SELECT_NAV_ITEM, EXPAND_NAV_ITEM, REMOVE_NAV_ITEM,
    TOGGLE_PLUGIN_MODAL, TOGGLE_PAGE_MODAL, CHANGE_DISPLAY_MODE, SET_BUSY, IMPORT_STATE
} from './actions';
import {ID_PREFIX_SECTION, ID_PREFIX_PAGE, ID_PREFIX_SORTABLE_BOX} from './constants';

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
            let content = action.payload.content;

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
                children: [],
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
        case RESIZE_BOX:
            return Object.assign({}, state, {width: action.payload.width, height: action.payload.height});
        default:
            return state;
    }
}

function boxesById(state = {}, action = {}){
    switch (action.type){
        case ADD_BOX:
            if(action.payload.type === 'inner-sortable')
                return Object.assign({}, state, {
                    [action.payload.id]: boxCreator(state[action.payload.id], action),
                    [action.payload.parent]: Object.assign({}, state[action.payload.parent], {children: [...state[action.payload.parent].children, action.payload.id]})
                });
            return Object.assign({}, state, {
                [action.payload.id]: boxCreator(state[action.payload.id], action)
            });
        case MOVE_BOX:
            return Object.assign({}, state, {
                [action.payload.id]: Object.assign({}, state[action.payload.id], {position: {x: action.payload.x, y: action.payload.y}})
            });
        case RESIZE_BOX:
            return Object.assign({}, state, {
                [action.payload.id]: boxCreator(state[action.payload.id], action)
            });
        case IMPORT_STATE:
            return action.payload.present.boxesById;
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
        case IMPORT_STATE:
            return action.payload.present.boxSelected;
        default:
            return state;
    }
}

function boxesIds(state = [], action = {}){
    switch (action.type){
        case ADD_BOX:
            return [...state, action.payload.id];
        case IMPORT_STATE:
            return action.payload.present.boxes;
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
                boxes: [],
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
        case IMPORT_STATE:
            return action.payload.present.navItemsIds;
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
        case ADD_BOX:
            if(action.payload.parent.indexOf(ID_PREFIX_PAGE) !== -1 || action.payload.parent.indexOf(ID_PREFIX_SECTION) !== -1)
                return Object.assign({}, state, {
                    [action.payload.parent]: Object.assign({}, state[action.payload.parent], {
                        boxes: [...state[action.payload.parent].boxes, action.payload.id]})});
            return state;
        case IMPORT_STATE:
            return action.payload.present.navItemsById;
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
        case IMPORT_STATE:
            return action.payload.present.navItemSelected;
        default:
            return state;
    }
}

function togglePluginModal(state = {value: false, caller: 0, fromSortable: false}, action = {}){
    switch(action.type){
        case TOGGLE_PLUGIN_MODAL:
            return action.payload;
        case ADD_BOX:
            return {value: false, caller: 0, fromSortable: false};
        case IMPORT_STATE:
            return action.payload.present.boxModalToggled;
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
        case IMPORT_STATE:
            return action.payload.present.pageModalToggled;
        default:
            return state;
    }
}

function changeDisplayMode(state = "", action = {}){
    switch(action.type){
        case CHANGE_DISPLAY_MODE:
            return action.payload.mode;
        case IMPORT_STATE:
            return action.payload.present.displayMode;
        default:
            return state;
    }
}

function isBusy(state = "", action = {}){
    switch(action.type){
        case SET_BUSY:
            return action.payload.msg;
        case IMPORT_STATE:
            return action.payload.present.isBusy;
        default:
            return state;
    }
}

const GlobalState = undoable(combineReducers({
    boxModalToggled: togglePluginModal,
    pageModalToggled: togglePageModal,
    boxesById: boxesById, //{0: box0, 1: box1}
    boxSelected: boxSelected, //0
    boxes: boxesIds, //[0, 1]
    navItemsIds: navItemsIds, //[0, 1]
    navItemSelected: navItemSelected, // 0
    navItemsById: navItemsById, // {0: navItem0, 1: navItem1}
    displayMode: changeDisplayMode, //"list"
    isBusy: isBusy
}), { filter: (action, currentState, previousState) => {
    if(action.type === EXPAND_NAV_ITEM)
        return false;
    else if(action.type === TOGGLE_PAGE_MODAL)
        return false;
    else if(action.type === TOGGLE_PLUGIN_MODAL)
        return false;
    else if(action.type === CHANGE_DISPLAY_MODE)
        return false;
    else if(action.type === SET_BUSY)
        return false;
    return currentState !== previousState; // only add to history if state changed
    }});

export default GlobalState;