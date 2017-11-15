import React, { Component } from 'react';
import { Provider } from 'react-redux';
import DevTools from './DevTools';
import GlobalState from '../../reducers/reducers';
import DaliApp from './DaliApp';
import i18n from 'i18next';
import { createStore, compose, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import Dali from '../../core/editor/main';

export default class ReduxProvider extends Component {
    constructor(props) {
        super(props);

        this.initialState = Dali.Config.sections_have_content ?
            ({ present: {
                globalConfig: { title: i18n.t('course_title'), canvasRatio: 16 / 9, visorNav: { player: true, sidebar: true, keyBindings: true }, trackProgess: true, age: { min: 0, max: 100 }, context: 'school', rights: "Public Domain", keywords: [], typicalLearningTime: { h: 0, m: 0, s: 0 }, version: '1.0.0', thumbnail: '', status: 'draft', structure: 'linear', difficulty: 'easy' },
                displayMode: "list",
                imagesUploaded: [],
                indexSelected: "se-1467887497411",
                navItemsById: {
                    0: { id: 0, children: ["se-1467887497411"], boxes: [], level: 0, type: '', hidden: false },
                    "se-1467887497411": {
                        id: "se-1467887497411",
                        name: i18n.t('section'),
                        isExpanded: true,
                        parent: 0,
                        children: [],
                        unitNumber: 1,
                        hidden: false,
                        linkedBoxes: {},
                        boxes: Dali.Config.sections_have_content ? ['bs-1467887497412'] : [],
                        level: 1,
                        type: "section",
                        extraFiles: {},
                        header: {
                            elementContent: {
                                documentTitle: '',
                                documentSubTitle: '',
                                numPage: '',
                            },
                            display: {
                                courseTitle: 'hidden',
                                documentTitle: 'expanded',
                                documentSubTitle: 'hidden',
                                breadcrumb: "reduced",
                                pageNumber: "hidden",
                            },
                        },
                    },
                },
                navItemsIds: ['se-1467887497411'],
                navItemSelected: 'se-1467887497411',
                boxesById: Dali.Config.sections_have_content ? {
                    'bs-1467887497412': {
                        id: "bs-1467887497412",
                        parent: "se-1467887497411",
                        container: 0,
                        content: null,
                        type: "sortable",
                        level: -1,
                        col: 0,
                        row: 0,
                        position: { x: 0, y: 0 },
                        width: "100%",
                        height: null,
                        text: null,
                        draggable: false,
                        resizable: false,
                        showTextEditor: false,
                        fragment: {},
                        children: [],
                        sortableContainers: {},
                        containedViews: [],
                    },
                } : {},
                toolbarsById: Dali.Config.sections_have_content ? ({
                    'bs-1467887497412': {
                        id: "bs-1467887497412",
                        state: {},
                        controls: {
                            main: {
                                __name: "Main",
                                accordions: {},
                            },
                        },
                        config: { displayName: i18n.t('Container_') },
                        showTextEditor: false,
                    },
                    "se-1467887497411": {
                        "id": "se-1467887497411",
                        "controls": {
                            "main": {
                                "__name": "Main",
                                "accordions": {
                                    "basic": {
                                        "__name": "Generales",
                                        "icon": "settings",
                                        "buttons": {
                                            "page_display": {
                                                "__name": i18n.t('display_page'),
                                                "type": "checkbox",
                                                "checked": true,
                                                "autoManaged": false,
                                            },
                                            "navitem_name": {
                                                "__name": i18n.t('NavItem_name'),
                                                "type": "text",
                                                "autoManaged": false,
                                                "value": i18n.t('page'),
                                            },
                                        },
                                    },
                                    "header": {
                                        "__name": i18n.t('Header'),
                                        "icon": "format_color_text",
                                        "buttons": {
                                            "display_title": {
                                                "__name": i18n.t('course_title'),
                                                "type": "checkbox",
                                                "checked": false,
                                                "autoManaged": false,
                                            },
                                            "display_pagetitle": {
                                                "__name": i18n.t('page'),
                                                "type": "checkbox",
                                                "checked": true,
                                                "autoManaged": false,
                                            },
                                            "pagetitle_name": {
                                                "__name": "custom_title",
                                                "type": "conditionalText",
                                                "associatedKey": "display_pagetitle",
                                                "value": "",
                                                "autoManaged": false,
                                                "display": true,
                                            },
                                            "display_pagesubtitle": {
                                                "__name": i18n.t('subtitle'),
                                                "type": "checkbox",
                                                "checked": false,
                                                "autoManaged": false,
                                            },
                                            "pagesubtitle_name": {
                                                "__name": "custom_subtitle",
                                                "type": "conditionalText",
                                                "associatedKey": "display_pagesubtitle",
                                                "value": "",
                                                "autoManaged": false,
                                                "display": true,
                                            },
                                            "display_breadcrumb": {
                                                "__name": i18n.t('Breadcrumb'),
                                                "type": "checkbox",
                                                "checked": true,
                                                "autoManaged": false,
                                            },
                                            "display_pagenumber": {
                                                "__name": i18n.t('pagenumber'),
                                                "type": "checkbox",
                                                "checked": false,
                                                "autoManaged": false,
                                            },
                                            "pagenumber_name": {
                                                "__name": "custom_pagenum",
                                                "type": "conditionalText",
                                                "associatedKey": "display_pagenumber",
                                                "value": "",
                                                "autoManaged": false,
                                                "display": true,
                                            },
                                        },
                                    },
                                    "z__extra": {
                                        "__name": "Alias",
                                        "icon": "rate_review",
                                        "buttons": {
                                            "alias": {
                                                "__name": "Alias",
                                                "type": "text",
                                                "value": "",
                                                "autoManaged": true,
                                                "isAttribute": true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        "config": { displayName: i18n.t('section') },
                        "state": {},
                    },
                }) : ({}),
                isBusy: "",
                fetchVishResults: { "results": [] },
            } }) :
            ({ present: {
                globalConfig: { title: i18n.t('course_title'), canvasRatio: 16 / 9, visorNav: { player: true, sidebar: true, keyBindings: true }, trackProgress: true, age: { min: 0, max: 100 }, context: 'school', keywords: [], rights: "Public Domain", status: 'draft', structure: 'linear', version: '1.0.0', thumbnail: '', typicalLearningTime: { h: 0, m: 0, s: 0 }, difficulty: 'easy' },
                imagesUploaded: [],
                indexSelected: 'pa-1497983247795',
                boxesById: {
                    "bs-1497983247797":
                        { id: "bs-1497983247797",
                            parent: "pa-1497983247795",
                            container: 0,
                            level: -1,
                            col: 0,
                            row: 0,
                            position: { x: 0, y: 0, type: "relative" },
                            draggable: false,
                            resizable: false,
                            showTextEditor: false,
                            fragment: {},
                            children: [],
                            sortableContainers: {},
                            containedViews: [] },
                },
                boxSelected: -1,
                boxLevelSelected: 0,
                navItemsIds: ["se-1467887497411", "pa-1497983247795"],
                navItemSelected: "pa-1497983247795",
                navItemsById: {
                    "0": {
                        id: 0,
                        children: ["se-1467887497411"],
                        boxes: [],
                        level: 0,
                        type: "",
                        hidden: false },
                    "se-1467887497411": {
                        id: "se-1467887497411",
                        name: i18n.t('section'),
                        isExpanded: true,
                        parent: 0,
                        linkedBoxes: {},
                        children: ["pa-1497983247795"],
                        unitNumber: 1,
                        hidden: false,
                        boxes: [],
                        level: 1,
                        type: "section",
                        extraFiles: {},
                        header: {
                            elementContent: {
                                documentTitle: "",
                                documentSubTitle: "",
                                numPage: "" },
                            display: {
                                courseTitle: "hidden",
                                documentTitle: "expanded",
                                documentSubTitle: "hidden",
                                breadcrumb: "reduced",
                                pageNumber: "hidden" },
                        },
                    },
                    "pa-1497983247795": {
                        id: "pa-1497983247795",
                        name: i18n.t('page'),
                        isExpanded: true,
                        parent: "se-1467887497411",
                        linkedBoxes: {},
                        children: [],
                        boxes: ["bs-1497983247797"],
                        level: 2,
                        type: "document",
                        unitNumber: 1,
                        hidden: false,
                        extraFiles: {},
                        header: {
                            elementContent: {
                                documentTitle: "",
                                documentSubTitle: "",
                                numPage: "",
                            },
                            display: {
                                courseTitle: "hidden",
                                documentTitle: "expanded",
                                documentSubTitle: "hidden",
                                breadcrumb: "reduced",
                                pageNumber: "hidden",
                            },
                        },
                    },
                },
                containedViewsById: {},
                containedViewSelected: 0,
                displayMode: "list",
                toolbarsById: {
                    "se-1467887497411": {
                        "id": "se-1467887497411",
                        "controls": {
                            "main": {
                                "__name": "Main",
                                "accordions": {
                                    "basic": {
                                        "__name": "Generales",
                                        "icon": "settings",
                                        "buttons": {
                                            "page_display": {
                                                "__name": i18n.t('display_page'),
                                                "type": "checkbox",
                                                "checked": true,
                                                "autoManaged": false,
                                            },
                                            "navitem_name": {
                                                "__name": i18n.t('NavItem_name'),
                                                "type": "text",
                                                "autoManaged": false,
                                                "value": i18n.t('page'),
                                            },
                                        },
                                    },
                                    "header": {
                                        "__name": i18n.t('Header'),
                                        "icon": "format_color_text",
                                        "buttons": {
                                            "display_title": {
                                                "__name": i18n.t('course_title'),
                                                "type": "checkbox",
                                                "checked": false,
                                                "autoManaged": false,
                                            },
                                            "display_pagetitle": {
                                                "__name": i18n.t('page'),
                                                "type": "checkbox",
                                                "checked": true,
                                                "autoManaged": false,
                                            },
                                            "pagetitle_name": {
                                                "__name": "custom_title",
                                                "type": "conditionalText",
                                                "associatedKey": "display_pagetitle",
                                                "value": "",
                                                "autoManaged": false,
                                                "display": true,
                                            },
                                            "display_pagesubtitle": {
                                                "__name": i18n.t('subtitle'),
                                                "type": "checkbox",
                                                "checked": false,
                                                "autoManaged": false,
                                            },
                                            "pagesubtitle_name": {
                                                "__name": "custom_subtitle",
                                                "type": "conditionalText",
                                                "associatedKey": "display_pagesubtitle",
                                                "value": "",
                                                "autoManaged": false,
                                                "display": true,
                                            },
                                            "display_breadcrumb": {
                                                "__name": i18n.t('Breadcrumb'),
                                                "type": "checkbox",
                                                "checked": true,
                                                "autoManaged": false,
                                            },
                                            "display_pagenumber": {
                                                "__name": i18n.t('pagenumber'),
                                                "type": "checkbox",
                                                "checked": false,
                                                "autoManaged": false,
                                            },
                                            "pagenumber_name": {
                                                "__name": "custom_pagenum",
                                                "type": "conditionalText",
                                                "associatedKey": "display_pagenumber",
                                                "value": "",
                                                "autoManaged": false,
                                                "display": true,
                                            },
                                        },
                                    },
                                    "z__extra": {
                                        "__name": "Alias",
                                        "icon": "rate_review",
                                        "buttons": {
                                            "alias": {
                                                "__name": "Alias",
                                                "type": "text",
                                                "value": "",
                                                "autoManaged": true,
                                                "isAttribute": true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        "config": { displayName: i18n.t('section') },
                        "state": {},
                    },
                    "pa-1497983247795": {
                        id: "pa-1497983247795",
                        controls: {
                            main: {
                                "__name": "Main",
                                "accordions": {
                                    "basic": {
                                        "__name": "Generales",
                                        "icon": "settings",
                                        "buttons": {
                                            "page_display": {
                                                "__name": i18n.t('display_page'),
                                                "type": "checkbox",
                                                "checked": true,
                                                "autoManaged": false,
                                            },
                                            "navitem_name": {
                                                "__name": i18n.t('NavItem_name'),
                                                "value": i18n.t('page'),
                                                "type": "text",
                                                "autoManaged": false,
                                            },
                                        },
                                    },
                                    "header": {
                                        "__name": i18n.t('Header'),
                                        "icon": "format_color_text",
                                        "buttons": {
                                            "display_title": {
                                                "__name": i18n.t('course_title'),
                                                "type": "checkbox",
                                                "checked": false,
                                                "autoManaged": false,
                                            },
                                            "display_pagetitle": {
                                                "__name": i18n.t('Title') + i18n.t('document'),
                                                "type": "checkbox",
                                                "checked": true,
                                                "autoManaged": false,
                                            },
                                            "pagetitle_name": {
                                                "__name": "custom_title",
                                                "type": "conditionalText",
                                                "associatedKey": "display_pagetitle",
                                                "value": "",
                                                "autoManaged": false,
                                                "display": true,
                                            },
                                            "display_pagesubtitle": {
                                                "__name": i18n.t('subtitle'),
                                                "type": "checkbox",
                                                "checked": false,
                                                "autoManaged": false,
                                            },
                                            "pagesubtitle_name": {
                                                "__name": "custom_subtitle",
                                                "type": "conditionalText",
                                                "associatedKey": "display_pagesubtitle",
                                                "value": "",
                                                "autoManaged": false,
                                                "display": true,
                                            },
                                            "display_breadcrumb": {
                                                "__name": i18n.t('Breadcrumb'),
                                                "type": "checkbox",
                                                "checked": true,
                                                "autoManaged": false,
                                            },
                                            "display_pagenumber": {
                                                "__name": i18n.t('pagenumber'),
                                                "type": "checkbox",
                                                "checked": false,
                                                "autoManaged": false,
                                            },
                                            "pagenumber_name": {
                                                "__name": "custom_pagenum",
                                                "type": "conditionalText",
                                                "associatedKey": "display_pagenumber",
                                                "value": "",
                                                "autoManaged": false,
                                                "display": true,
                                            },
                                        },
                                    },
                                    "z__extra": {
                                        "__name": "Alias",
                                        "icon": "rate_review",
                                        "buttons": {
                                            "alias": {
                                                "__name": "Alias",
                                                "type": "text",
                                                "value": "",
                                                "autoManaged": true,
                                                "isAttribute": true },
                                        },
                                    },

                                },
                            },
                        },
                        config: { "displayName": i18n.t('document') },
                        state: {},
                    },
                    "bs-1497983247797": {
                        id: "bs-1497983247797",
                        controls: {
                            main: {
                                "__name": "Main",
                                "accordions": {},
                            },
                        },
                        config: {
                            displayName: "Contenedor",
                        },
                        state: {},
                        showTextEditor: false },
                },
                isBusy: "",
                fetchVishResults: { "results": [] },
            } });

        this.store = this.configureStore();
    }

    render() {
        return (
            <Provider store={this.store}>
                <div style={{ height: '100%' }}>
                    <DaliApp id="app" store={this.store}/>
                    <DevTools/>
                </div>
            </Provider>
        );
    }

    configureStore() {
        const store = createStore(GlobalState, this.initialState, compose(applyMiddleware(thunkMiddleware), DevTools.instrument()));

        if (module.hot) {
            // Enable Webpack hot module replacement for reducers
            module.hot.accept('../../reducers/reducers', () => {
                const nextRootReducer = require('../../reducers/reducers').default;
                store.replaceReducer(nextRootReducer);
            });
        }

        return store;
    }
}

