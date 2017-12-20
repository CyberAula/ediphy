import deepmerge from 'deepmerge';
import { PAGE_TYPES } from'../common/constants';
import i18n from 'i18next';
/**
 * Function to make sure navView state is properly built
 * @param recieved state
 * @returns fixed state with new fields that didn't exist before
 */
export function navView(state) {
    let navItemDefault = {
        isExpanded: true,
        children: [],
        boxes: [],
        linkedBoxes: {},
        level: 1,
        type: action.payload.type,
        unitNumber: 1,
        hidden: false,
        extraFiles: {},
        header: {
            elementContent: {
                documentTitle: '',
                documentSubTitle: '',
                numPage: '' },
            display: {
                courseTitle: 'hidden',
                documentTitle: 'expanded',
                documentSubTitle: 'hidden',
                breadcrumb: "reduced",
                pageNumber: "hidden" },
        },
    };

    let newState = {};
    state.forEach((element) => { newState.push(deepmerge(element, state));});
    return newState;
}

/**
 * Function to make sure boxes state is properly built
 * @param recieved state
 * @returns fixed state with new fields that didn't exist before
 */
export function boxes(state) {
    let boxesDefault = {
        level: level,
        col: 0,
        row: 0,
        position: {
            type: 'relative',
            x: 0,
            y: 0,
        },
        // width: width,
        // height: height,
        content: "",
        draggable: true,
        resizable: true,
        showTextEditor: false,
        fragment: {},
        children: [],
        sortableContainers: {},
        containedViews: [],
    };

    let newState = {};
    state.forEach((element) => { newState.push(deepmerge(element, state));});
    return newState;
}

/**
 * Function to make sure navView is properly built
 * @param recieved state
 * @returns fixed state with new fields that didn't exist before
 */
export function containedView(state) {
    let containedViewsDefault = {
        name: i18n.t('contained_view'),
        boxes: [],
        type: PAGE_TYPES.SLIDE,
        extraFiles: {},
        header: {
            elementContent: {
                documentTitle: i18n.t('contained_view'),
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
    };

    let newState = {};
    state.forEach((element) => { newState.push(deepmerge(element, state));});
    return newState;
}

/**
 * Function to make sure navView is properly built
 * @param recieved state
 * @returns fixed state with new fields that didn't exist before
 */
export function globalConfig(state) {
    let globalConfigDefault = { title: "Ediphy",
        canvasRatio: 16 / 9,
        visorNav: {
            player: true,
            sidebar: true,
            keyBindings: true,
        },
        trackProgress: true,
        age: { min: 0, max: 100 },
        context: 'school',
        rights: "Public Domain",
        keywords: [],
        typicalLearningTime: { h: 0, m: 0, s: 0 },
        version: '1.0.0',
        thumbnail: '',
        status: 'draft',
        structure: 'linear',
        difficulty: 'easy',
    };
    let newState = {};
    state.forEach((element) => { newState.push(deepmerge(element, state));});
    return newState;
}

/**
 * Function to make sure navView is properly built
 * @param recieved state
 * @returns fixed state with new fields that didn't exist before
 */
export function toolbarPlugin(state) {
    let toolbarPluginDefault = {
        config: {
            allowFloatingBox: true,
            aspectRatioButtonConfig: {},
            flavor: "react",
            icon: "image",
            iconFromUrl: false,
            initialHeight: "25",
            initialHeightSlide: "25",
            initialWidth: "25",
            initialWidthSlide: "25",
            isRich: false,
            limitToOneInstance: false,
            needsConfigModal: false,
            needsConfirmation: false,
            needsPointerEventsAllowed: false,
            needsTextEdition: false,
            needsXMLEdition: false,
        },
        tabs: ['main'],
        values: {},
    };
    let newState = {};
    state.forEach((element) => { newState.push(deepmerge(element, state));});
    return newState;
}

/**
 * Function to make sure navView is properly built
 * @param recieved state
 * @returns fixed state with new fields that didn't exist before
 */
export function toolbarView(state) {
    let toolbarViewDefault = {
        tabs: ['main'],
        values: {
            header: i18n.t('document'),
            display_title: false,
            display_pagetitle: true,
            pagetitle_name: { value: "", display: true },
            display_pagesubtitle: { value: "", display: true },
            pagesubtitle_name: { value: "", display: true },
        },
    };

    let newState = {};
    state.forEach((element) => { newState.push(deepmerge(element, state));});
    return newState;
}

