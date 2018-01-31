import {
    ADD_BOX, ADD_RICH_MARK, CHANGE_NAV_ITEM_NAME, DELETE_BOX, DELETE_RICH_MARK, DELETE_CONTAINED_VIEW, ADD_NAV_ITEM,
    DELETE_NAV_ITEM, DELETE_SORTABLE_CONTAINER, DUPLICATE_BOX,
    EDIT_RICH_MARK, RESIZE_BOX, RESIZE_SORTABLE_CONTAINER, TOGGLE_TEXT_EDITOR, UPDATE_BOX, UPDATE_TOOLBAR,
    CHANGE_CONTAINED_VIEW_NAME,
    VERTICALLY_ALIGN_BOX, IMPORT_STATE, PASTE_BOX, ADD_CONTAINED_VIEW,
} from '../common/actions';
import i18n from 'i18next';
import { changeProp, changeProps, deleteProps, isDocument, isPage, isSection, isSlide } from "../common/utils";
import Utils from "../common/utils";

function toolbarElementCreator(state, action, isContainedView = false) {
    let doc_type;
    let id = isContainedView ? action.payload.mark.connection.id : action.payload.id;
    let type = isContainedView ? action.payload.mark.connection.type : action.payload.type;
    if (isPage(id)) {
        doc_type = i18n.t('page');
    }
    if(isSlide(type)) {
        doc_type = i18n.t('slide');
    }

    if(isDocument(type)) {
        doc_type = i18n.t('document');
    }

    if(isSection(id)) {
        doc_type = i18n.t('section');
    }
    let pagetitle = i18n.t('Title') + doc_type;

    let toolbar = {
        id: "pa-1511252955865",
        breadcrumb: 'reduced',
        doc_type: "Documento",
        courseTitle: 'hidden',
        documentSubtitle: 'hidden',
        documentSubtitleContent: '',
        documentTitle: 'expanded',
        documentTitleContent: pagetitle,
        numPage: '',
    };

    return toolbar;
}

export default function(state = {}, action = {}) {
    let newState;
    switch (action.type) {
    case ADD_NAV_ITEM:
        return changeProp(state, action.payload.id, toolbarElementCreator(state, action));
    case ADD_CONTAINED_VIEW:
        return state;
    case DELETE_CONTAINED_VIEW:
        return deleteProps(newToolbarCV, boxesCV.concat(action.payload.ids[0]));
    case DELETE_NAV_ITEM:
        return deleteProps(newToolbar, boxes.concat(action.payload.ids));
    case UPDATE_PAGE_TOOLBAR:
        newState = {
            ...state, state:
            action.payload.value };
        return newState;
    case IMPORT_STATE:
        return action.payload.present.pluginToolbarsById || state;
    default:
        return state;
    }
}
