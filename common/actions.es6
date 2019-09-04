import fetch from 'isomorphic-fetch';
import Ediphy from '../core/editor/main';
import i18n from 'i18next';
import { ID_PREFIX_FILE, FILE_UPLOAD_ERROR, FILE_UPLOADING, FILE_DELETING, FILE_DELETE_ERROR } from './constants';
import { isDataURL } from './utils';
import { serialize } from '../reducers/serializer';
export const ADD_BOX = 'ADD_BOX';
export const SELECT_BOX = 'SELECT_BOX';
export const MOVE_BOX = 'MOVE_BOX';
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
export const ADD_NAV_ITEMS = 'ADD_NAV_ITEMS';
export const SELECT_NAV_ITEM = 'SELECT_NAV_ITEM';
export const EXPAND_NAV_ITEM = 'EXPAND_NAV_ITEM';
export const DELETE_NAV_ITEM = 'DELETE_NAV_ITEM';
export const REORDER_NAV_ITEM = 'REORDER_NAV_ITEM';
export const TOGGLE_NAV_ITEM = 'TOGGLE_NAV_ITEM';
export const CHANGE_BACKGROUND = 'CHANGE_BACKGROUND';

export const INDEX_SELECT = 'INDEX_SELECT';

export const TOGGLE_TEXT_EDITOR = 'TOGGLE_TEXT_EDITOR';
export const TOGGLE_TITLE_MODE = 'TOGGLE_TITLE_MODE';
// export const CHANGE_DISPLAY_MODE = 'CHANGE_DISPLAY_MODE';
export const SET_BUSY = 'SET_BUSY';
export const DUPLICATE_NAV_ITEM = 'DUPLICATE_NAV_ITEM';

export const CONFIG_SCORE = 'CONFIG_SCORE';
export const UPDATE_PLUGIN_TOOLBAR = 'UPDATE_PLUGIN_TOOLBAR';
export const UPDATE_VIEW_TOOLBAR = 'UPDATE_VIEW_TOOLBAR';

export const IMPORT_EDI = 'IMPORT_EDI';
export const IMPORT_STATE = 'IMPORT_STATE';
export const CHANGE_GLOBAL_CONFIG = 'CHANGE_GLOBAL_CONFIG';
export const CHANGE_STYLE_CONFIG = 'CHANGE_STYLE_CONFIG';

export const ADD_RICH_MARK = 'ADD_RICH_MARK';
export const EDIT_RICH_MARK = 'EDIT_RICH_MARK';
export const MOVE_RICH_MARK = 'MOVE_RICH_MARK';
export const DELETE_RICH_MARK = 'DELETE_RICH_MARK';

export const ADD_CONTAINED_VIEW = 'ADD_CONTAINED_VIEW';
export const SELECT_CONTAINED_VIEW = 'SELECT_CONTAINED_VIEW';
export const DELETE_CONTAINED_VIEW = 'DELETE_CONTAINED_VIEW';

export const UPLOAD_FILE = 'UPLOAD_FILE';
export const DELETE_FILE = 'DELETE_FILE';

export const EDIT_PLUGIN_TEXT = 'EDIT_PLUGIN_TEXT';

export const PASTE_BOX = 'PASTE_BOX';
export const CHANGE_BOX_LAYER = 'CHANGE_BOX_LAYER';

export const SET_CORRECT_ANSWER = 'SET_CORRECT_ANSWER';

export const UPDATE_UI = 'UPDATE_UI';

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

export function addNavItem(id, name, parent, type, position, background, customSize, hideTitles, hasContent, sortable_id) {
    return { type: ADD_NAV_ITEM, payload: { id, name, parent, type, position, background, customSize, hideTitles, hasContent, sortable_id } };
}

export function addNavItems(navs, parent) {
    return { type: ADD_NAV_ITEMS, payload: { navs, parent } };
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

export function changeBackground(id, background) {
    return { type: CHANGE_BACKGROUND, payload: { id, background } };

}

export function addBox(ids, draggable, resizable, content, style, state, structure, initialParams) {
    return { type: ADD_BOX, payload: { ids, draggable, resizable, content, style, state, structure, initialParams } };
}

export function selectBox(id, box) {
    return { type: SELECT_BOX, payload: { id, box } };
}

export function moveBox(id, x, y, position, parent, container) {
    return { type: MOVE_BOX, payload: { id, x, y, position, parent, container } };
}

export function resizeBox(id, structure) {
    return { type: RESIZE_BOX, payload: { id, structure } };
}

export function updateBox(id, content, toolbar, state) {
    return { type: UPDATE_BOX, payload: { id, content, toolbar, state } };
}

export function deleteBox(id, parent, container, children, cvs, page) {
    return { type: DELETE_BOX, payload: { id, parent, container, children, cvs, page } };
}

export function reorderSortableContainer(ids, parent) {
    return { type: REORDER_SORTABLE_CONTAINER, payload: { ids, parent } };
}

export function dropBox(id, row, col, parent, container, oldParent, oldContainer, position, index) {
    return { type: DROP_BOX, payload: { id, row, col, parent, container, oldParent, oldContainer, position, index } };
}

export function verticallyAlignBox(id, verticalAlign) {
    return { type: VERTICALLY_ALIGN_BOX, payload: { id, verticalAlign } };
}

export function increaseBoxLevel() {
    return { type: INCREASE_LEVEL, payload: {} };
}

export function changeBoxLayer(id, parent, container, value, boxes_array) {
    return { type: CHANGE_BOX_LAYER, payload: { id, parent, container, value, boxes_array } };
}

export function resizeSortableContainer(id, parent, height) {
    return { type: RESIZE_SORTABLE_CONTAINER, payload: { id, parent, height } };
}

export function deleteSortableContainer(id, parent, children, cvs, page) {
    return { type: DELETE_SORTABLE_CONTAINER, payload: { id, parent, children, cvs, page } };
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

export function addRichMark(mark, view, toolbar) {
    return { type: ADD_RICH_MARK, payload: { mark, view, toolbar } };
}

export function moveRichMark(mark, value) {
    return { type: MOVE_RICH_MARK, payload: { mark, value } };
}

export function editRichMark(mark, view, toolbar) {
    return { type: EDIT_RICH_MARK, payload: { mark, view, toolbar } };
}

export function deleteRichMark(mark) {
    return { type: DELETE_RICH_MARK, payload: { mark } };
}

export function selectContainedView(id) {
    return { type: SELECT_CONTAINED_VIEW, payload: { id } };
}

export function toggleTextEditor(id, value, text, content) {
    return { type: TOGGLE_TEXT_EDITOR, payload: { id, value, text, content } };
}

export function duplicateNavItem(id, newId, boxes, suffix, linkedCvs) {
    return { type: DUPLICATE_NAV_ITEM, payload: { id, newId, boxes, suffix, linkedCvs } };
}

export function pasteBox(ids, box, toolbar, children, index, marks, score) {
    return { type: PASTE_BOX, payload: { ids, box, toolbar, children, index, marks, score } };
}

/* export function changeDisplayMode(mode) {
    return { type: CHANGE_DISPLAY_MODE, payload: { mode } };
}
*/
export function setBusy(value, msg, reason = null) {
    return { type: SET_BUSY, payload: { value, msg, reason } };
}

export function changeGlobalConfig(prop, value) {
    return { type: CHANGE_GLOBAL_CONFIG, payload: { prop, value } };
}

export function changeStyleConfig(prop, value) {
    return { type: CHANGE_STYLE_CONFIG, payload: { prop, value } };
}

export function updateUI(prop, value) {
    return { type: UPDATE_UI, payload: { prop, value } };
}
export function importState(state) {
    return { type: IMPORT_STATE, payload: state };
}

export function updatePluginToolbar(id, tab, accordion, name, value, deletedBoxes) {
    return { type: UPDATE_PLUGIN_TOOLBAR, payload: { id, tab, accordion, name, value, deletedBoxes } };
}

export function updateViewToolbar(id, elements) {
    return { type: UPDATE_VIEW_TOOLBAR, payload: { id, ...elements } };
}

export function configScore(id, button, value, page) {
    return { type: CONFIG_SCORE, payload: { id, button, value, page } };
}

export function uploadFile(id, url, name, keywords, mimetype) {
    return { type: UPLOAD_FILE, payload: { id, url, name, keywords, mimetype } };
}

export function deleteFile(id) {
    return { type: DELETE_FILE, payload: { id } };
}

export function setCorrectAnswer(id, correctAnswer, page) {
    return { type: SET_CORRECT_ANSWER, payload: { id, correctAnswer, page } };
}

export function importEdi(state) {
    return { type: IMPORT_EDI, payload: { state } };
}

export function deleteRemoteFileVishAsync(id, url, callback) {
    return dispatch => {
        dispatch(setBusy(true, FILE_DELETING));

        let form = new FormData();
        form.append("_method", "delete");
        if (typeof(ediphy_editor_params) !== 'undefined') {
            form.append("authenticity_token", ediphy_editor_params.authenticity_token);
        }

        return fetch(url, {
            method: 'POST',
            credentials: 'same-origin',
            body: form,
        }).then(response => {
            if (!response.ok) {
                if(response.status === 406) {
                    return 200;
                }
                throw Error(response.statusText);

            }

            return 200;
        }).then((result) => {
            dispatch(setBusy(false, id));

            dispatch(deleteFile(id));
            if (callback) {
                callback(result);
            }
        })
            .catch(e => {
                // eslint-disable-next-line no-console
                console.error(e);
                dispatch(setBusy(false, FILE_DELETE_ERROR));
                if (callback) {
                    callback();
                }
                return false;
            });
    };
}

export function deleteRemoteFileEdiphyAsync(id, url, callback) {
    return dispatch => {
        if (isDataURL(url)) {
            dispatch(deleteFile(id));
            if (callback) {
                callback(id);
            }

        } else {
            dispatch(setBusy(true, FILE_DELETING));
            let fileId = url.split('/').pop();
            let DELETE_FILE_EDIPHY_URL = encodeURI('http://localhost:8081/delete?file=' + fileId);

            return fetch(DELETE_FILE_EDIPHY_URL, {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ "id": fileId }),
            }).then(response => {
                if (!response.ok) {
                    throw Error(response.statusText);
                }

                return 200;
            }).then((result) => {
                dispatch(setBusy(false, id));

                dispatch(deleteFile(id));
                if (callback) {
                    callback(result);
                }
            })
                .catch(e => {
                    // eslint-disable-next-line no-console
                    console.error(e);
                    dispatch(setBusy(false, FILE_DELETE_ERROR));
                    if (callback) {
                        callback();
                    }
                    return false;
                });
        }
        return true;
    };

}

// Async actions
export function exportStateAsync(state, win = null, url = null) {
    return dispatch => {
        let exportedState = { present: { ...state.undoGroup.present,
            filesUploaded: state.filesUploaded, status: state.status, everPublished: state.everPublished } };
        // First dispatch: the app state is updated to inform
        // that the API call is starting.
        dispatch(setBusy(true, i18n.t("messages.operation_in_progress"), "saving_state"));

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
                body: JSON.stringify(exportedState),
            })
                .then(response => {
                    if (response.status >= 400) {
                        throw new Error(i18n.t("error.exporting"));
                    }
                    return true;
                })
                .then(() => {
                    dispatch(setBusy(false, i18n.t("success_transaction"), "saving_state"));
                })
                .catch(e => {
                    // eslint-disable-next-line no-console
                    console.error(e);
                    dispatch(setBusy(false, i18n.t("error.exporting")));
                });
        }

        let data = {
            authenticity_token: ediphy_editor_params.authenticity_token,
            ediphy_document: { user: { name: ediphy_editor_params.name, id: ediphy_editor_params.id }, json: exportedState },
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
                if(win !== null) {
                    win.parent.location.href = url || ediphy_editor_params.export_url;
                    win.focus();
                }
                dispatch(setBusy(false, i18n.t("success_transaction"), "saving_state"));
            })
            .catch(e =>{
                // eslint-disable-next-line no-console
                console.error(e);
                dispatch(setBusy(false, i18n.t("error.exporting")));
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
                // eslint-disable-next-line no-console
                dispatch(importState(serialize(JSON.parse(result))));
                return true;
            })
            .then(() => {
                dispatch(setBusy(false, i18n.t("success_transaction")));
            })
            .catch(e => {
                // eslint-disable-next-line no-console
                console.error(e);
                dispatch(setBusy(false, i18n.t("error.importing")));
            });
    };
}

export function uploadEdiphyResourceAsync(file, keywords = "", callback) {
    return dispatch => {
        dispatch(setBusy(true, FILE_UPLOADING));

        let form = new FormData();
        form.append("file", file);
        let id = ID_PREFIX_FILE + Date.now();
        fetch("http://localhost:8081/upload", {
            method: 'POST',
            credentials: 'same-origin',
            body: form,
        }).then(response => {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response.text().then((text)=>{
                return JSON.parse(text);
            });
        }).then((result) => {
            let { url, name, mimetype } = result;

            dispatch(uploadFile(id, url, name, keywords, mimetype));
            if (callback) {
                callback(url);
            }
            dispatch(setBusy(false, id));
        })
            .catch(e => {
                // eslint-disable-next-line no-console
                console.error(e);
                let reader = new FileReader();
                reader.readAsDataURL(file);
                let filenameDeconstructed = file.name.split('.');
                let mimetype = file.type && file.type !== "" ? file.type : filenameDeconstructed[filenameDeconstructed.length - 1];
                if (mimetype === 'application/vnd.ms-excel') {
                    mimetype = 'csv';
                }
                reader.onload = () =>{
                    dispatch(uploadFile(id, reader.result, file.name, keywords, mimetype));
                    if (callback) {
                        callback(reader.result);
                    }
                    dispatch(setBusy(false, id));
                };
                reader.onerror = () => {
                    dispatch(setBusy(false, FILE_UPLOAD_ERROR));
                    if (callback) {
                        callback();
                    }
                };

            }).catch(e=>{
                // eslint-disable-next-line no-console
                console.error(e);
                dispatch(setBusy(false, FILE_UPLOAD_ERROR));
                if (callback) {
                    callback();
                }
            });
    };
}

export function uploadVishResourceAsync(query, keywords = "", callback) {
    return dispatch => {
        if (query && query.name && query.name.length > 0) {
            let filename = query.name;
            dispatch(setBusy(true, FILE_UPLOADING));

            let form = new FormData();
            form.append("document[title]", query.name);
            form.append("document[description]", "Uploaded using Ediphy Editor");
            // form.append("document[tag_list][]", keywords);
            if (typeof(ediphy_editor_params) !== 'undefined') {
                form.append("document[owner_id]", ediphy_editor_params.id);
                form.append("document[scope]", "1");
                form.append("authenticity_token", ediphy_editor_params.authenticity_token);
            }
            form.append("document[file]", query);
            let filenameDeconstructed = filename.split('.');
            let mimetype = (query.type && query.type !== "") ? query.type : filenameDeconstructed[filenameDeconstructed.length - 1];
            return fetch(Ediphy.Config.upload_vish_url, {
                method: 'POST',
                credentials: 'same-origin',
                body: form,
            }).then(response => {
                if (!response.ok) {
                    throw Error(response.statusText);
                }

                return response.text().then((text)=>{
                    return JSON.parse(text);
                });
            }).then((result) => {

                let id = ID_PREFIX_FILE + Date.now();
                mimetype = (result.type === 'scormpackage' || result.type === 'webapp') ? result.type : mimetype;
                if (mimetype === 'application/vnd.ms-excel') {
                    mimetype = 'csv';
                }
                dispatch(uploadFile(id, result.src, query.name, keywords, mimetype));
                if (callback) {
                    callback(result.src);
                }
                dispatch(setBusy(false, id));
            })
                .catch(e => {
                    // eslint-disable-next-line no-console
                    console.error(e);
                    dispatch(setBusy(false, FILE_UPLOAD_ERROR));
                    if (callback) {
                        callback();
                    }
                });

            // alert(i18n.t("error.file_extension_invalid"));

        }
        alert(i18n.t("error.file_not_selected"));

        return false;
    };
}
