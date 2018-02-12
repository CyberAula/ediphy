import {
    DELETE_CONTAINED_VIEW, ADD_NAV_ITEM,
    DELETE_NAV_ITEM, UPDATE_VIEW_TOOLBAR,
    IMPORT_STATE, ADD_CONTAINED_VIEW,
} from '../common/actions';
import i18n from 'i18next';
import { changeProp, deleteProps, isDocument, isPage, isSection, isSlide } from "../common/utils";
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
        id: id,
        breadcrumb: 'reduced',
        doc_type: type,
        courseTitle: 'hidden',
        documentSubtitle: 'hidden',
        documentSubtitleContent: '',
        documentTitle: 'expanded',
        documentTitleContent: pagetitle,
        numPage: '',
        customSize: 0,
        background: "rgb(255,255,255)",
    };

    return toolbar;
}

export default function(state = {}, action = {}) {
    let newState;
    switch (action.type) {
    case ADD_NAV_ITEM:
        return changeProp(state, action.payload.id, toolbarElementCreator(state, action));
    case ADD_CONTAINED_VIEW:
        return changeProp(state, action.payload.id, toolbarElementCreator(state, action));
    case DELETE_CONTAINED_VIEW:
        return deleteProps(state, action.payload.ids);
    case DELETE_NAV_ITEM:
        return deleteProps(state, action.payload.ids);
    case UPDATE_VIEW_TOOLBAR:
        newState = {
            ...state,
            [action.payload.id]: action.payload,
        };
        return newState;
    case IMPORT_STATE:
        return action.payload.present.pluginToolbarsById || state;
    default:
        return state;
    }
}
