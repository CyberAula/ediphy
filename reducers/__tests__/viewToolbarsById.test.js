import { testState } from '../../core/store/state.tests.js';
import view_toolbars_by_id from '../toolbars/viewToolbarsById';
import * as ActionTypes from '../../common/actions';
import i18n from "i18next";

const state = testState.undoGroup.present.viewToolbarsById;

describe('# view_toolbars_by_id reducer', ()=>{
    describe('DEFAULT', () => {
        test('Should return test.state as default', () => {
            expect(view_toolbars_by_id(state, {})).toEqual(state);
        });
    });
    describe('handle ADD_NAV_ITEM', ()=>{
        test('If nav item added', () => {
            const action = { type: ActionTypes.ADD_NAV_ITEM,
                payload: { id: 'pa-1511252985429', type: 'document', name: i18n.t('Title') + i18n.t('document') } };
            let newState = { ...state,
                "pa-1511252985429": {
                    "aspectRatio": true,
                    "background": "#FFFFFF",
                    "backgroundAttr": "full",
                    "breadcrumb": "reduced",
                    "colors": {},
                    "courseTitle": "hidden",
                    "customBackground": false,
                    "customSize": 0,
                    "numPage": "hidden",
                    "doc_type": 'document',
                    "themeBackground": 0,
                    "viewName": i18n.t('Title') + i18n.t('document'),
                    "numPageContent": "",
                    "documentSubtitle": "hidden",
                    "documentSubtitleContent": i18n.t("subtitle"),
                    "documentTitle": "expanded",
                    "documentTitleContent": "",
                    "id": "pa-1511252985429",
                },
            };
            expect(view_toolbars_by_id(state, action)).toEqual(newState);
        });
    });
    describe('handle DELETE_CONTAINED_VIEW', ()=>{
        test('If contained view deleted', () => {
            let action = {
                type: ActionTypes.DELETE_CONTAINED_VIEW,
                payload: {
                    ids: ['cv-1511252975055'],
                    boxes: [''],
                    parent: { "bo-1511252957954": ["rm-1511252975055"] },
                },
            };
            let newState = { ...state };
            delete newState['cv-1511252975055'];
            expect(view_toolbars_by_id(state, action)).toEqual(newState);
        });
    });
    describe('handle UPDATE_VIEW_TOOLBAR', ()=>{
        test('If update view toolbar', () => {
            let action = {
                type: ActionTypes.UPDATE_VIEW_TOOLBAR,
                payload: {
                    id: "pa-1511252955865",
                    breadcrumb: 'expanded',
                    displayableTitle: "Beautiful element",
                    courseTitle: 'shown',
                    documentSubtitle: 'hidden',
                    documentSubtitleContent: 'Beautiful subtitle',
                    documentTitle: 'expanded',
                    documentTitleContent: 'Beautiful content',
                    numPage: '32',
                },
            };

            let newState = {
                ...state,
                [action.payload.id]: action.payload,
            };
            expect(view_toolbars_by_id(state, action)).toEqual(newState);
        });

        test('If update name', () => {
            let action = {
                type: ActionTypes.UPDATE_VIEW_TOOLBAR,
                payload: {
                    id: "pa-1497983247795",
                    viewName: "NewName",
                },
            };

            let newState = {
                "pa-1497983247795": {
                    aspectRatio: "",
                    background: "#ffffff",
                    backgroundAttr: "",
                    id: "pa-1497983247795",
                    viewName: "NewName",
                    breadcrumb: 'reduced',
                    courseTitle: 'hidden',
                    documentSubtitle: 'hidden',
                    documentSubtitleContent: 'Subtítulo',
                    documentTitle: 'expanded',
                    documentTitleContent: "Título Documento",
                    numPage: 'hidden',
                    numPageContent: '',
                },
                'cv-1524225239825': {
                    id: "cv-1524225239825",
                    customSize: 0,
                    aspectRatio: true,
                    background: "#ffffff",
                    backgroundAttr: "",
                    doc_type: "document",
                    documentSubtitle: "hidden",
                    documentSubtitleContent: "Subtítulo",
                    documentTitle: "expanded",
                    documentTitleContent: "Título Documento",
                    viewName: "Vista Contenida 1",
                    breadcrumb: 'reduced',
                    courseTitle: 'hidden',
                    numPage: 'hidden',
                },
                "se-1467887497411": {
                    aspectRatio: "",
                    background: "#ffffff",
                    backgroundAttr: "",
                    breadcrumb: "reduced",
                    courseTitle: "hidden",
                    documentSubtitle: "hidden",
                    documentSubtitleContent: "Subtítulo",
                    documentTitle: "expanded",
                    documentTitleContent: "Section",
                    id: "se-1467887497411",
                    numPage: "hidden",
                    numPageContent: "1",
                    viewName: "Section",
                },
            };

            expect(view_toolbars_by_id(state, action)).toEqual(newState);
        });
    });
    describe('handle PASTE_BOX', ()=>{
        test('If box pasted', () => {
            // let action = {};
            // expect(view_toolbars_by_id(state, action)).toEqual(newState);
        });
    });
    describe('handle IMPORT_STATE', ()=>{
        test('If state imported', () => {
            let action = {
                type: ActionTypes.IMPORT_STATE,
                payload: {
                    present: {
                        viewToolbarsById: {
                            "se-1467887497411": {
                                "id": "se-1467887497411",
                                "viewName": "Section",
                                "breadcrumb": "reduced",
                                "courseTitle": "hidden",
                                "documentSubtitle": "hidden",
                                "documentSubtitleContent": "Subtítulo",
                                "documentTitle": "expanded",
                                "documentTitleContent": "Section",
                                "numPage": "hidden",
                                "numPageContent": "1",
                                "background": "#ffffff",
                                "backgroundAttr": "",
                                "aspectRatio": "",
                            },
                            "pa-1497983247795": {
                                "id": "pa-1497983247795",
                                "viewName": "Página",
                                "breadcrumb": "reduced",
                                "courseTitle": "hidden",
                                "documentSubtitle": "hidden",
                                "documentSubtitleContent": "Subtítulo",
                                "documentTitle": "expanded",
                                "documentTitleContent": "Título Documento",
                                "numPage": "hidden",
                                "numPageContent": "",
                                "background": "#ffffff",
                                "backgroundAttr": "",
                                "aspectRatio": "",
                            },
                            "cv-1524225239825": {
                                "id": "cv-1524225239825",
                                "breadcrumb": "reduced",
                                "doc_type": "document",
                                "viewName": "Vista Contenida 1",
                                "courseTitle": "hidden",
                                "documentSubtitle": "hidden",
                                "documentSubtitleContent": "Subtítulo",
                                "documentTitle": "expanded",
                                "documentTitleContent": "Título Documento",
                                "numPage": "hidden",
                                "customSize": 0,
                                "aspectRatio": true,
                                "background": "#ffffff",
                                "backgroundAttr": "",
                            },
                        },
                    },
                },
            };
            let newState = action.payload.present.viewToolbarsById;
            expect(view_toolbars_by_id(state, action)).toEqual(newState);
        });
    });
});

