import {
    DELETE_CONTAINED_VIEW, ADD_NAV_ITEM,
    ADD_RICH_MARK,
    DELETE_NAV_ITEM, UPDATE_VIEW_TOOLBAR,
    IMPORT_STATE, ADD_CONTAINED_VIEW, ADD_NAV_ITEMS,
} from '../common/actions';
import i18n from 'i18next';
import { changeProp, deleteProps, isDocument, isPage, isSection, isSlide, isContainedView } from "../common/utils";
import Utils from "../common/utils";

function toolbarElementCreator(state, action, isContainedView = false) {
    let doc_type;
    let id = isContainedView ? action.payload.mark.connection : action.payload.id;
    let type = isContainedView ? action.payload.mark.connectMode : action.payload.type;
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

    if(isDocument(type)) {
        doc_type = i18n.t('Page');
    }

    let toolbar = {
        id: id,
        breadcrumb: action.payload.hideTitles ? 'hidden' : 'reduced',
        doc_type: type,
        viewName: doc_type,
        courseTitle: 'hidden',
        documentSubtitle: 'hidden',
        documentSubtitleContent: '',
        documentTitle: action.payload.hideTitles ? 'hidden' : 'expanded',
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
    case ADD_NAV_ITEMS:
        let ids = action.payload.navs.map(nav=> { return nav.id; });
        let navs = action.payload.navs.map(nav=> { return toolbarElementCreator(state, { type: ADD_NAV_ITEM, payload: nav });});
        return changeProps(state, [...ids], [...navs]);
    case ADD_RICH_MARK:
        return changeProp(state, action.payload.view.id, toolbarElementCreator(state, action, isContainedView(action.payload.mark.connection)));
    case ADD_CONTAINED_VIEW:
        return changeProp(state, action.payload.id, toolbarElementCreator(state, action.view));
    case DELETE_CONTAINED_VIEW:
        return deleteProps(state, action.payload.ids);
    case DELETE_NAV_ITEM:
        return deleteProps(state, action.payload.ids);
    case UPDATE_VIEW_TOOLBAR:
        newState = {
            ...state,
            [action.payload.id]: {
                ...state[action.payload.id],
                ...action.payload,
            },
        };
        return newState;
    case IMPORT_STATE:
        return action.payload.present.pluginToolbarsById || state;
    default:
        return state;
    }
}
