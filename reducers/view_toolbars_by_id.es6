import {
    DELETE_CONTAINED_VIEW, ADD_NAV_ITEM,
    ADD_RICH_MARK, EDIT_RICH_MARK,
    DELETE_NAV_ITEM, UPDATE_VIEW_TOOLBAR,
    IMPORT_STATE, ADD_CONTAINED_VIEW, ADD_NAV_ITEMS, DUPLICATE_NAV_ITEM, IMPORT_EDI,
} from '../common/actions';
import i18n from 'i18next';
import {
    changeProp, deleteProps, isDocument, isPage, isSection, isSlide, isContainedView,
    nextAvailName,
} from '../common/utils';
import Utils from "../common/utils";

function toolbarElementCreator(state, action, containedView = false) {
    let doc_type;
    let id = containedView ? action.payload.mark.connection : action.payload.id;
    let type = containedView ? action.payload.view.type : action.payload.type;

    if (isPage(id)) {
        doc_type = i18n.t('page');
    }
    if(isSlide(type)) {
        doc_type = i18n.t('slide');
    }

    /* if(isDocument(type)) {
        doc_type = i18n.t('document');
    }*/

    if(isSection(id)) {
        doc_type = i18n.t('section');
    }

    if(isDocument(type)) {
        doc_type = i18n.t('Page');
    }

    let pagetitle = "";// /*i18n.t('Title') +*/ doc_type;

    let name = action.payload.name ? action.payload.name : containedView ? action.payload.toolbar.viewName : doc_type;
    // name =nextAvailName(name, state, 'viewName');
    let background = action.payload.background ? action.payload.background.background : "#ffffff";
    let backgroundAttr = action.payload.background ? action.payload.background.backgroundAttr : "";
    let toolbar = {
        id: id,
        breadcrumb: isSlide(type) ? 'hidden' : 'reduced',
        doc_type: type,
        viewName: name,
        courseTitle: 'hidden',
        documentSubtitle: 'hidden',
        documentSubtitleContent: i18n.t("subtitle"),
        documentTitle: (action.payload.hideTitles || (action.payload.toolbar && action.payload.toolbar.hideTitles)) ? 'hidden' : 'expanded',
        documentTitleContent: pagetitle,
        numPage: 'hidden',
        numPageContent: action.payload.position || "",
        customSize: 0,
        aspectRatio: true,
        background: background || "#ffffff",
        backgroundAttr: backgroundAttr || "",
    };

    return toolbar;
}

export default function(state = {}, action = {}) {
    let newState;
    switch (action.type) {
    case ADD_NAV_ITEM:

        return changeProp(state, action.payload.id, toolbarElementCreator(state, action));
    case ADD_NAV_ITEMS:
        let nav_items = {};
        action.payload.navs.forEach(nav => {
            nav_items[nav.id] = toolbarElementCreator(state, { type: ADD_NAV_ITEM, payload: nav });
        });
        return { ...state, ...nav_items };
    case ADD_RICH_MARK:
    case EDIT_RICH_MARK:
        if(action.payload.mark.connectMode === "new") {
            return changeProp(state, action.payload.view.id, toolbarElementCreator(state, action, isContainedView(action.payload.mark.connection)));
        }
        return state;
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
        return action.payload.present.viewToolbarsById || state;
    case IMPORT_EDI:
        return { ...state, ...action.payload.state.viewToolbarsById };
    case DUPLICATE_NAV_ITEM:
        return { ...state,
            [action.payload.newId]: { ...state[action.payload.id], id: action.payload.newId, viewName: state[action.payload.id].viewName + " " + i18n.t("repeatedItemCopied") },
        };
    default:
        return state;
    }
}
