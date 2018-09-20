import deepmerge from 'deepmerge';
import { PAGE_TYPES } from'../common/constants';
import i18n from 'i18next';

export function serialize(state) {
    return state;
}

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
        customSize: 0,
        linkedBoxes: {},
        level: 1,
        type: "document",
        unitNumber: 1,
        hidden: false,
        extraFiles: {},
    };

    let newState = {};
    state.forEach((element) => { newState.push(deepmerge(navItemDefault, element));});
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
    state.forEach((element) => { newState.push(deepmerge(boxesDefault, element));});
    return newState;
}

/**
 * Function to make sure containedView is properly built
 * @param recieved state
 * @returns fixed state with new fields that didn't exist before
 */
export function containedView(state) {
    let containedViewsDefault = {
        name: i18n.t('contained_view'),
        boxes: [],
        info: "new",
        type: PAGE_TYPES.SLIDE,
        extraFiles: {},
    };

    let newState = {};
    state.forEach((element) => { newState.push(deepmerge(containedViewsDefault, element));});
    return newState;
}

/**
 * Function to make sure globalConfig is properly built
 * @param recieved state
 * @returns fixed state with new fields that didn't exist before
 */
export function globalConfig(state) {
    let globalConfigDefault = {
        title: "Ediphy",
        canvasRatio: 16 / 9,
        visorNav: {
            player: true,
            sidebar: true,
            keyBindings: true,
        },
        trackProgress: true,
        age: { min: 0, max: 100 },
        context: 'school',
        rights: "public",
        keywords: [],
        typicalLearningTime: { h: 0, m: 0, s: 0 },
        version: '1.0.0',
        thumbnail: '',
        status: 'draft',
        structure: 'linear',
        difficulty: 'easy',
    };
    let newState = {};
    state.forEach((element) => { newState.push(deepmerge(globalConfigDefault, element));});
    return newState;
}

/**
 * Function to make sure toolbarPlugin is properly built
 * @param recieved state
 * @returns fixed state with new fields that didn't exist before
 */
export function pluginToolbars(state) {
    let toolbarPluginDefault = {
        showTextEditor: false,
        state: {},
        structure: {},
        style: {},
    };
    let newState = {};
    state.forEach((element) => { newState.push(deepmerge(toolbarPluginDefault, element));});

    return newState;
}

export function marksSerializer(state, version) {
    let newState = { ...state };

    if(version === "1") {
        [...state].forEach((element)=>{
            let regex = /(^\d+(?:\.\d*)?%$)/g;
            let match = regex.exec(element.value);
            if (match && match.length === 2) {
                newState[element.id].value = "0:00";
            }
        });
    }

    return newState;
}

/**
 * Function to make sure toolbarView is properly built
 * @param recieved state
 * @returns fixed state with new fields that didn't exist before
 */
export function viewToolbars(state) {
    let toolbarViewDefault = {
        aspectRatio: false,
        background: "#ffffff",
        backgroundAttr: "",
        breacrumb: "reduced",
        courseTitle: "hidden",
        documentSubtitle: "hidden",
        documentSubitleContent: i18n.t("subtitle"),
        documentTitle: "expanded",
        documentTitleContent: i18n.t("title"),
        numPage: "hidden",
        numPageContent: "",
        viewName: "Page",
    };

    let newState = {};
    state.forEach((element) => { newState.push(deepmerge(toolbarViewDefault, element));});
    return newState;
}

