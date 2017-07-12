import fetch from 'isomorphic-fetch';
import Dali from './core/main';
import i18n from 'i18next';

export const ADD_BOX = 'ADD_BOX';
export const SELECT_BOX = 'SELECT_BOX';
export const MOVE_BOX = 'MOVE_BOX';
export const DUPLICATE_BOX = 'DUPLICATE_BOX';
export const RESIZE_BOX = 'RESIZE_BOX';
export const UPDATE_BOX = 'UPDATE_BOX';
export const DELETE_BOX = 'DELETE_BOX';
export const DROP_BOX = 'DROP_BOX';
export const VERTICALLY_ALIGN_BOX = 'VERTICALLY_ALIGN_BOX';
export const INCREASE_LEVEL = 'INCREASE_LEVEL';
//this is to move a box that has relative position inside a container
export const REORDER_BOXES = 'REORDER_BOXES';

export const RESIZE_SORTABLE_CONTAINER = 'RESIZE_SORTABLE_CONTAINER';
export const DELETE_SORTABLE_CONTAINER = 'DELETE_SORTABLE_CONTAINER';
export const REORDER_SORTABLE_CONTAINER = 'REORDER_SORTABLE_CONTAINER';
export const CHANGE_SORTABLE_PROPS = 'CHANGE_SORTABLE_PROPS';
export const CHANGE_COLS = 'CHANGE_COLS';
export const CHANGE_ROWS = 'CHANGE_ROWS';

export const ADD_NAV_ITEM = 'ADD_NAV_ITEM';
export const SELECT_NAV_ITEM = 'SELECT_NAV_ITEM';
export const EXPAND_NAV_ITEM = 'EXPAND_NAV_ITEM';
export const DELETE_NAV_ITEM = 'DELETE_NAV_ITEM';
export const REORDER_NAV_ITEM = 'REORDER_NAV_ITEM';
export const TOGGLE_NAV_ITEM = 'TOGGLE_NAV_ITEM';
export const UPDATE_NAV_ITEM_EXTRA_FILES = 'UPDATE_NAV_ITEM_EXTRA_FILES';
export const CHANGE_NAV_ITEM_NAME = 'CHANGE_NAV_ITEM_NAME';
export const CHANGE_UNIT_NUMBER = 'CHANGE_UNIT_NUMBER';
export const INDEX_SELECT = 'INDEX_SELECT';

export const TOGGLE_TEXT_EDITOR = 'TOGGLE_TEXT_EDITOR';
export const TOGGLE_TITLE_MODE = 'TOGGLE_TITLE_MODE';
export const CHANGE_DISPLAY_MODE = 'CHANGE_DISPLAY_MODE';
export const SET_BUSY = 'SET_BUSY';
export const UPDATE_TOOLBAR = 'UPDATE_TOOLBAR';

export const IMPORT_STATE = 'IMPORT_STATE';
export const CHANGE_GLOBAL_CONFIG = 'CHANGE_GLOBAL_CONFIG';

export const FETCH_VISH_RESOURCES_SUCCESS = "FETCH_VISH_RESOURCES_SUCCESS";

export const ADD_RICH_MARK = 'ADD_RICH_MARK';
export const EDIT_RICH_MARK = 'EDIT_RICH_MARK';

export const ADD_CONTAINED_VIEW = 'ADD_CONTAINED_VIEW';
export const SELECT_CONTAINED_VIEW = 'SELECT_CONTAINED_VIEW';
export const DELETE_CONTAINED_VIEW = 'DELETE_CONTAINED_VIEW';
export const CHANGE_CONTAINED_VIEW_NAME = 'CHANGE_CONTAINED_VIEW_NAME';

export const UPLOAD_IMAGE = 'UPLOAD_IMAGE';

// These are not real Redux actions but are use to specify plugin's render reason
export const DELETE_RICH_MARK = 'DELETE_RICH_MARK';
export const EDIT_PLUGIN_TEXT = 'EDIT_PLUGIN_TEXT';



export function selectIndex(id) {
    return {type: INDEX_SELECT, payload: {id}};
}

export function selectNavItem(id) {
    return {type: SELECT_NAV_ITEM, payload: {id}};
}

export function addContainedView(id, name, container){
    return {type: ADD_CONTAINED_VIEW, payload: {id, name, container}};
}

export function deleteContainedView(ids, boxes) {
    return {type: DELETE_CONTAINED_VIEW, payload: {ids, boxes}};
}

export function addNavItem(id, name, parent, type, position, hasContent) {
    return {type: ADD_NAV_ITEM, payload: {id, name, parent, type, position, hasContent}};
}

export function expandNavItem(id, value) {
    return {type: EXPAND_NAV_ITEM, payload: {id, value}};
}

export function deleteNavItem(ids, parent, boxes, containedViews) {
    return {type: DELETE_NAV_ITEM, payload: {ids, parent, boxes, containedViews}};
}

export function reorderNavItem(id, newParent, oldParent, idsInOrder, childrenInOrder) {
    return {type: REORDER_NAV_ITEM, payload: {id, newParent, oldParent, idsInOrder, childrenInOrder}};
}

export function toggleNavItem(id) {
    return {type: TOGGLE_NAV_ITEM, payload: {id}};
}

export function updateNavItemExtraFiles(id, box, xml_path) {
    return {type: UPDATE_NAV_ITEM_EXTRA_FILES, payload: {id, box, xml_path}};
}

export function changeNavItemName(id, title) {
    return {type: CHANGE_NAV_ITEM_NAME, payload: {id, title}};
}

export function changeContainedViewName(id, title) {
    return {type: CHANGE_CONTAINED_VIEW_NAME, payload: {id, title}};
}

export function changeUnitNumber(id, value) {
    return {type: CHANGE_UNIT_NUMBER, payload: {id, value}};
}

export function addBox(ids, draggable, resizable, content, toolbar, config, state, initialParams) {
    return {type: ADD_BOX, payload: {ids, draggable, resizable, content, toolbar, config, state, initialParams}};
}

export function selectBox(id) {
    return {type: SELECT_BOX, payload: {id}};
}

export function moveBox(id, x, y, position) {
    return {type: MOVE_BOX, payload: {id, x, y, position}};
}

export function duplicateBox(id, parent, container, children, newIds, newId) {
    return {type: DUPLICATE_BOX, payload: {id, parent, container, children, newIds, newId}};
}

export function resizeBox(id, widthButton, heightButton) {
    return {type: RESIZE_BOX, payload: {id, widthButton, heightButton}};
}

export function updateBox(id, content, toolbar, state) {
    return {type: UPDATE_BOX, payload: {id, content, toolbar, state}};
}

export function deleteBox(id, parent, container, children) {
    return {type: DELETE_BOX, payload: {id, parent, container, children}};
}

export function reorderSortableContainer(ids, parent) {
    return {type: REORDER_SORTABLE_CONTAINER, payload: {ids, parent}};
}

export function dropBox(id, row, col) {
    return {type: DROP_BOX, payload: {id, row, col}};
}

export function verticallyAlignBox(id, verticalAlign) {
    return {type: VERTICALLY_ALIGN_BOX, payload: {id, verticalAlign}};
}

export function increaseBoxLevel() {
    return {type: INCREASE_LEVEL, payload: {}};
}

export function resizeSortableContainer(id, parent, height) {
    return {type: RESIZE_SORTABLE_CONTAINER, payload: {id, parent, height}};
}

export function deleteSortableContainer(id, parent, children) {
    return {type: DELETE_SORTABLE_CONTAINER, payload: {id, parent, children}};
}

export function changeSortableProps(id, parent, prop, value) {
    return {type: CHANGE_SORTABLE_PROPS, payload: {id, parent, prop, value}};
}
export function changeCols(id, parent, distribution, boxesAffected) {
    return {type: CHANGE_COLS, payload: {id, parent, distribution, boxesAffected}};
}

export function changeRows(id, parent, column, distribution, boxesAffected) {
    return {type: CHANGE_ROWS, payload: {id, parent, column, distribution, boxesAffected}};
}

export function reorderBoxes(parent, container, order) {
    return {type: REORDER_BOXES, payload: {parent, container, order}};
}

export function addRichMark(parent, mark, state) {
    return {type: ADD_RICH_MARK, payload: {parent, mark, state}};
}

export function editRichMark(parent, state) {
    return {type: EDIT_RICH_MARK, payload: {parent, state}};
}

export function selectContainedView(id) {
    return {type: SELECT_CONTAINED_VIEW, payload: {id}};
}

export function toggleTextEditor(caller, value) {
    return {type: TOGGLE_TEXT_EDITOR, payload: {caller, value}};
}

export function toggleTitleMode(id, titles) {
    return {type: TOGGLE_TITLE_MODE, payload: {id, titles}};
}

export function changeDisplayMode(mode) {
    return {type: CHANGE_DISPLAY_MODE, payload: {mode}};
}

export function setBusy(value, msg) {
    return {type: SET_BUSY, payload: {value, msg}};
}

export function changeGlobalConfig(prop, value) {
    return  {type: CHANGE_GLOBAL_CONFIG, payload: {prop, value}};
}


export function importState(state) {
    return {type: IMPORT_STATE, payload: state};
}

export function updateToolbar(id, tab, accordions, name, value) {
    return {type: UPDATE_TOOLBAR, payload: {id, tab, accordions, name, value}};
}

export function fetchVishResourcesSuccess(result) {
    return {type: FETCH_VISH_RESOURCES_SUCCESS, payload: {result}};
}

export function uploadImage(url){
    return {type: UPLOAD_IMAGE, payload: {url}};
}

//Async actions
export function exportStateAsync(state) {
    return dispatch => {

        // First dispatch: the app state is updated to inform
        // that the API call is starting.
        dispatch(setBusy(true, i18n.t("Exporting")));

        // The function called by the thunk middleware can return a value,
        // that is passed on as the return value of the dispatch method.

        // In this case, we return a promise to wait for.
        // This is not required by thunk middleware, but it is convenient for us.
        return fetch(Dali.Config.export_url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(state)
        })
            .then(response => {
                if (response.status >= 400) {
                    throw new Error(i18n.t("error.exporting"));
                }
                return true;
            })
            .then(() => {
                dispatch(setBusy(false, i18n.t("success_transaction")));
            })
            .catch(e => {
                dispatch(setBusy(false, e.message));
            });
    };
}

export function importStateAsync() {
    return dispatch => {
        dispatch(setBusy(true, i18n.t("Importing")));

        return fetch(Dali.Config.import_url)
            .then(response => {
                if (response.status >= 400) {
                    throw new Error(i18n.t("error.importing"));
                }
                return response.text();
            })
            .then(result => {
                dispatch(importState(JSON.parse(result)));
                return true;
            })
            .then(() => {
                dispatch(setBusy(false, i18n.t("success_transaction")));
            })
            .catch(e => {
                dispatch(setBusy(false, e.message));
            });
    };
}

export function fetchVishResourcesAsync(query) {
    return dispatch => {
        dispatch(setBusy(true, i18n.t("Searching")));

        return fetch(query)
            .then(response => {
                if (response.status >= 400) {
                    throw new Error(i18n.t("error.searching"));
                }
                return response.text();
            })
            .then(result => {
                dispatch(fetchVishResourcesSuccess(JSON.parse(result)));
                return true;
            })
            .then(() => {
                dispatch(setBusy(false, i18n.t("no_results")));
            })
            .catch(e => {
                dispatch(setBusy(false, e.message));
            });
    };
}


export function uploadVishResourceAsync(query) {
    return dispatch => {

        if (query.title !== null && query.title.length > 0) {
            if (query.file !== null){
                if (query.file.name.match(/\.(jpeg|jpg|gif|png)$/) !== null) {
                    dispatch(setBusy(true, i18n.t("Uploading")));

                    var form = new FormData();
                    form.append("title", query.title);
                    form.append("description", query.description);
                    form.append("file", query.file);

                    return fetch(Dali.Config.upload_vish_url, {
                        method: 'POST',
                        credentials: 'same-origin',
                        body: form
                    }).then(response => {
                            if (response.status >= 400) {
                                throw new Error(i18n.t("error.generic"));
                            }
                            return response.text();
                        })
                        .then((result) => {
                            dispatch(setBusy(false, result));
                            dispatch(uploadImage(result));
                        })
                        .catch(e => {
                            alert(i18n.t("error.generic"));
                            dispatch(setBusy(false, 'http://nemanjakovacevic.net/wp-content/uploads/2013/07/placeholder.png'));
                        });
                
                } else {
                    alert( i18n.t("error.file_extension_invalid"));
                }
            } else {
                alert(i18n.t("error.file_not_selected"));
            }
        }else {

            alert( i18n.t("error.file_title_not_defined"));
            return false;
        }
    };
}
