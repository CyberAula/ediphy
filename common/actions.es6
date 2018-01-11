import fetch from 'isomorphic-fetch';
import Ediphy from '../core/editor/main';
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
// this is to move a box that has relative position inside a container
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

export const PASTE_BOX = 'PASTE_BOX';
export const CHANGE_BOX_LAYER = 'CHANGE_BOX_LAYER';

export function selectIndex(id) {
    return { type: INDEX_SELECT, payload: { id } };
}

export function selectNavItem(id) {
    return { type: SELECT_NAV_ITEM, payload: { id } };
}

export function addContainedView(id, name, container) {
    return { type: ADD_CONTAINED_VIEW, payload: { id, name, container } };
}

export function deleteContainedView(ids, boxes, parent) {
    return { type: DELETE_CONTAINED_VIEW, payload: { ids, boxes, parent } };
}

export function addNavItem(id, name, parent, type, position, hasContent) {
    return { type: ADD_NAV_ITEM, payload: { id, name, parent, type, position, hasContent } };
}

export function expandNavItem(id, value) {
    return { type: EXPAND_NAV_ITEM, payload: { id, value } };
}

export function deleteNavItem(ids, parent, boxes, containedViews, linkedBoxes) {
    return { type: DELETE_NAV_ITEM, payload: { ids, parent, boxes, containedViews, linkedBoxes } };
}

export function reorderNavItem(id, newParent, oldParent, idsInOrder, childrenInOrder) {
    return { type: REORDER_NAV_ITEM, payload: { id, newParent, oldParent, idsInOrder, childrenInOrder } };
}

export function toggleNavItem(id) {
    return { type: TOGGLE_NAV_ITEM, payload: { id } };
}

export function updateNavItemExtraFiles(id, box, xml_path) {
    return { type: UPDATE_NAV_ITEM_EXTRA_FILES, payload: { id, box, xml_path } };
}

export function changeNavItemName(id, title) {
    return { type: CHANGE_NAV_ITEM_NAME, payload: { id, title } };
}

export function changeContainedViewName(id, title) {
    return { type: CHANGE_CONTAINED_VIEW_NAME, payload: { id, title } };
}

export function addBox(ids, draggable, resizable, content, toolbar, config, state, initialParams) {
    return { type: ADD_BOX, payload: { ids, draggable, resizable, content, toolbar, config, state, initialParams } };
}

export function selectBox(id) {
    return { type: SELECT_BOX, payload: { id } };
}

export function moveBox(id, x, y, position, parent, container) {
    return { type: MOVE_BOX, payload: { id, x, y, position, parent, container } };
}

// @TODO
export function duplicateBox(id, parent, container, children, newIds, newId) {
    return { type: DUPLICATE_BOX, payload: { id, parent, container, children, newIds, newId } };
}

export function resizeBox(id, widthButton, heightButton) {
    return { type: RESIZE_BOX, payload: { id, widthButton, heightButton } };
}

export function updateBox(id, content, toolbar, state) {
    return { type: UPDATE_BOX, payload: { id, content, toolbar, state } };
}

export function deleteBox(id, parent, container, children, cvs) {
    return { type: DELETE_BOX, payload: { id, parent, container, children, cvs } };
}

export function reorderSortableContainer(ids, parent) {
    return { type: REORDER_SORTABLE_CONTAINER, payload: { ids, parent } };
}

export function dropBox(id, row, col, parent, container) {
    return { type: DROP_BOX, payload: { id, row, col, parent, container } };
}

export function verticallyAlignBox(id, verticalAlign) {
    return { type: VERTICALLY_ALIGN_BOX, payload: { id, verticalAlign } };
}

export function increaseBoxLevel() {
    return { type: INCREASE_LEVEL, payload: {} };
}

export function changeBoxLayer(id, parent, container, value) {
    return { type: CHANGE_BOX_LAYER, payload: { id, parent, container, value } };
}

export function resizeSortableContainer(id, parent, height) {
    return { type: RESIZE_SORTABLE_CONTAINER, payload: { id, parent, height } };
}

export function deleteSortableContainer(id, parent, children, cvs) {
    return { type: DELETE_SORTABLE_CONTAINER, payload: { id, parent, children, cvs } };
}

export function changeSortableProps(id, parent, prop, value) {
    return { type: CHANGE_SORTABLE_PROPS, payload: { id, parent, prop, value } };
}
export function changeCols(id, parent, distribution, boxesAffected) {
    return { type: CHANGE_COLS, payload: { id, parent, distribution, boxesAffected } };
}

export function changeRows(id, parent, column, distribution, boxesAffected) {
    return { type: CHANGE_ROWS, payload: { id, parent, column, distribution, boxesAffected } };
}

export function reorderBoxes(parent, container, order) {
    return { type: REORDER_BOXES, payload: { parent, container, order } };
}

export function addRichMark(parent, mark, state) {
    return { type: ADD_RICH_MARK, payload: { parent, mark, state } };
}

export function editRichMark(parent, state, mark, oldConnection, newConnection) {
    return { type: EDIT_RICH_MARK, payload: { parent, state, mark, oldConnection, newConnection } };
}

export function deleteRichMark(id, parent, cvid, state) {
    return { type: DELETE_RICH_MARK, payload: { id, parent, cvid, state } };
}

export function selectContainedView(id) {
    return { type: SELECT_CONTAINED_VIEW, payload: { id } };
}

export function toggleTextEditor(caller, value) {
    return { type: TOGGLE_TEXT_EDITOR, payload: { caller, value } };
}

export function pasteBox(ids, box, toolbar) {
    return { type: PASTE_BOX, payload: { ids, box, toolbar } };
}

export function toggleTitleMode(id, titles) {
    return { type: TOGGLE_TITLE_MODE, payload: { id, titles } };
}

export function changeDisplayMode(mode) {
    return { type: CHANGE_DISPLAY_MODE, payload: { mode } };
}

export function setBusy(value, msg) {
    return { type: SET_BUSY, payload: { value, msg } };
}

export function changeGlobalConfig(prop, value) {
    return { type: CHANGE_GLOBAL_CONFIG, payload: { prop, value } };
}

export function importState(state) {
    return { type: IMPORT_STATE, payload: state };
}

export function updateToolbar(id, tab, accordions, name, value) {
    return { type: UPDATE_TOOLBAR, payload: { id, tab, accordions, name, value } };
}

export function fetchVishResourcesSuccess(result) {
    return { type: FETCH_VISH_RESOURCES_SUCCESS, payload: { result } };
}

export function uploadImage(url) {
    return { type: UPLOAD_IMAGE, payload: { url } };
}

// Async actions
export function exportStateAsync(state) {
    return dispatch => {

        // First dispatch: the app state is updated to inform
        // that the API call is starting.
        dispatch(setBusy(true, i18n.t("Exporting")));

        // The function called by the thunk middleware can return a value,
        // that is passed on as the return value of the dispatch method.

        // In this case, we return a promise to wait for.
        // This is not required by thunk middleware, but it is convenient for us.
        if (process.env.NODE_ENV !== 'production' || ediphy_editor_params === undefined) {
            return fetch(Ediphy.Config.export_url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(state),
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
        }

        let data = {
            authenticity_token: ediphy_editor_params.authenticity_token,
            ediphy_document: { user: { name: ediphy_editor_params.name, id: ediphy_editor_params.id }, json: state },
        };

        return fetch(ediphy_editor_params.export_url, { // return fetch(Ediphy.Config.export_url, {
            credentials: 'same-origin',
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(response => {
                if (response.status >= 400) {
                    throw new Error(i18n.t("error.exporting"));
                }
                return response.text();
            })
            .then(result => {
                let ediphy_resource_id = JSON.parse(result).ediphy_id;

                if (Ediphy.Config.api_editor_url_change) {
                    window.parent.history.replaceState("", "", Ediphy.Config.export_url + ediphy_resource_id + ediphy_editor_params.edit_prefix);
                    ediphy_editor_params.export_url = Ediphy.Config.export_url + ediphy_resource_id;
                    ediphy_editor_params.ediphy_resource_id = ediphy_resource_id;
                }
                dispatch(setBusy(false, i18n.t("success_transaction")));
            })
            .catch(e =>{
                dispatch(setBusy(false, e.message));
            });

    };
}

export function importStateAsync() {
    return dispatch => {
        dispatch(setBusy(true, i18n.t("Importing")));

        return fetch(Ediphy.Config.import_url)
            .then(response => {
                if (response.status >= 400) {
                    throw new Error(i18n.t("error.importing"));
                }
                return response.text();
            })
            .then(result => {
                console.log(result);
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
            if (query.file !== null) {
                if (query.file.name.match(/\.(jpeg|jpg|gif|png)$/) !== null) {
                    dispatch(setBusy(true, i18n.t("Uploading")));

                    let form = new FormData();
                    form.append("document[title]", query.title);
                    form.append("document[description]", "Uploaded using Ediphy Editor");
                    if (typeof(ediphy_editor_params) !== 'undefined') {
                        form.append("document[owner_id]", ediphy_editor_params.id);
                        form.append("authenticity_token", ediphy_editor_params.authenticity_token);
                    }
                    form.append("document[file]", query.file);

                    return fetch(Ediphy.Config.upload_vish_url, {
                        method: 'POST',
                        credentials: 'same-origin',
                        body: form,
                    }).then(response => {
                        if (!response.ok) {
                            throw Error(response.statusText);
                        }

                        return response.text().then((text)=>{
                            return JSON.parse(text).src;
                        });
                    })
                        .then((result) => {
                            dispatch(setBusy(false, result));
                            dispatch(uploadImage(result));
                        })
                        .catch(e => {
                            alert(i18n.t("error.reaching_server"));
                            dispatch(setBusy(false, 'data:image/png;base64,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'));
                        });

                }
                alert(i18n.t("error.file_extension_invalid"));

            } else {
                alert(i18n.t("error.file_not_selected"));
            }
        }else {

            alert(i18n.t("error.file_title_not_defined"));
            return false;
        }
        return false;
    };
}
