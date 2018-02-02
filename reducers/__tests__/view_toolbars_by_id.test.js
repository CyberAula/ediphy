import { testState } from '../../core/store/state.tests.js';
import view_toolbars_by_id from '../view_toolbars_by_id';
import * as ActionTypes from '../../common/actions';
import i18n from "i18next";

const state = testState.present.viewToolbarsById;

describe('# plugin_toolbars_by_id reducer', ()=>{
    describe('DEFAULT', ()=>{
        test('Should return test.state as default', () => {
            expect(view_toolbars_by_id(state, {})).toEqual(state);
        });
    });

    describe('handle ADD_NAV_ITEM', ()=>{
        test('If nav item added', () => {
            const action = { type: ActionTypes.ADD_NAV_ITEM,
                payload: { id: 'pa-1511252985429', type: 'document' } };
            let newState = { ...state,
                "pa-1511252985429": {
                    "breadcrumb": "reduced",
                    "courseTitle": "hidden",
                    "doc_type": 'document',
                    "documentSubtitle": "hidden",
                    "documentSubtitleContent": "",
                    "documentTitle": "expanded",
                    "documentTitleContent": i18n.t('Title') + i18n.t('document'),
                    "id": "pa-1511252985429", "numPage": "",
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
    });

    describe('handle PASTE_BOX', ()=>{
        test('If box pasted', () => {
            let action = {};
            // expect(view_toolbars_by_id(state, action)).toEqual(newState);
        });
    });
    describe('handle IMPORT_STATE', ()=>{
        test('If state imported', () => {
            let action = {
                type: ActionTypes.IMPORT_STATE,
                payload: {
                    present: {
                        pluginToolbarsById: {
                            "pa-15112529552323": {
                                id: "pa-15112529552323",
                                breadcrumb: 'reduced',
                                displayableTitle: "Documento",
                                courseTitle: 'hidden',
                                documentSubtitle: 'hidden',
                                documentSubtitleContent: '',
                                documentTitle: 'expanded',
                                documentTitleContent: '',
                                numPage: '',
                            },
                            'cv-15112529523155': {
                                id: "cv-15112529523155",
                                breadcrumb: 'reduced',
                                displayableTitle: "Documento: vita contenida",
                                courseTitle: 'hidden',
                                pageSubtitle: 'hidden',
                                pageSubtitleContent: '',
                                pageTitle: 'expanded',
                                pageTitleContent: '',
                                numPage: '',
                            },
                        },
                    },
                },
            };
            let newState = action.payload.present.pluginToolbarsById;
            expect(view_toolbars_by_id(state, action)).toEqual(newState);
        });
    });
});

