import deepmerge from 'deepmerge';
import { PAGE_TYPES } from'../common/constants';
import i18n from 'i18next';
import { emptyState } from '../core/store/state.empty';

export function serialize(state) {
    if(state && state.present) {
        switch(state.present.version) {
        case 2: case "2":
            return multipleAnswerSerializer(state);
        default:
            return state;
        }
    }
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
export function globalConfig(state = { ...emptyState().undoGroup.present.globalConfig }) {
    let newState = { ...state };

    if (typeof newState.canvasRatio === "string") {
        newState.canvasRatio = parseFloat(newState.canvasRatio);
    }
    if (newState.age) {
        if (typeof newState.age.min === "string") {
            newState.age.min = parseInt(newState.age.min, 10);
        }
        if (typeof newState.age.max === "string") {
            newState.age.max = parseInt(newState.age.max, 10);
        }
    }
    newState = {
        allowComments: true,
        allowClone: true,
        allowDownload: true,
        ...newState,
    };

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

function multipleAnswerSerializer(state) {
    let boxesById = {};
    let pluginToolbarsById = {};
    let replaceAnswers = (inputDictionary, fieldToReplace) => {
        let outputDictionary = {};
        Object.keys(inputDictionary).map((scKey) => {
            if (scKey.includes('Answer')) {
                let ansN = parseInt(scKey.charAt(scKey.length - 1), 10);
                let newKey = (scKey.slice(0, -1) + (ansN - 1)).toString();
                outputDictionary[newKey] = JSON.parse(JSON.stringify({
                    ...inputDictionary[scKey],
                    [fieldToReplace]: newKey,
                }));
                return;
            }
            outputDictionary[scKey] = JSON.parse(JSON.stringify(inputDictionary[scKey]));
            return;

        });
        return outputDictionary;
    };
    Object.keys(state.present.boxesById).map((boxId) => {
        let currentBox = state.present.boxesById[boxId];
        let parent = currentBox.parent.toString();
        boxesById[boxId] = JSON.parse(JSON.stringify(currentBox));
        // Parent is page and box is exercise
        if(state.present.exercises[parent] && state.present.exercises[parent].exercises[boxId]) {
            if(state.present.exercises[parent].exercises[boxId].name === "MultipleAnswer") {
                boxesById[boxId] = JSON.parse(JSON.stringify({
                    ...state.present.boxesById[boxId],
                    children: state.present.boxesById[boxId].children.map((child, index) => {
                        if (child.includes('Answer')) {
                            return (child.slice(0, -1) + (index - 1)).toString();
                        }
                        return child;
                    }),
                    sortableContainers: replaceAnswers(state.present.boxesById[boxId].sortableContainers, 'key'),
                }));
                return;
            }
        }
        let boxPage = state.present.boxesById[parent];
        if (boxPage) {
            let page = boxPage.parent;
            if(state.present.exercises[page] && state.present.exercises[page].exercises[parent] && state.present.exercises[page].exercises[parent].name === "MultipleAnswer") {
                let container = state.present.boxesById[boxId].container.toString();
                let ansN = parseInt(container.charAt(container.length - 1), 10);
                boxesById[boxId] = JSON.parse(JSON.stringify({
                    ...state.present.boxesById[boxId],
                    container: container.includes('Answer') ? 'sc-Answer' + (ansN - 1).toString() : state.present.boxesById[boxId].container.toString(),
                }));
                return;
            }
        }
        return;
    });
    Object.keys(state.present.pluginToolbarsById).map((boxId) => {
        if(state.present.pluginToolbarsById[boxId] && state.present.pluginToolbarsById[boxId].pluginId === "MultipleAnswer") {
            pluginToolbarsById[boxId] = JSON.parse(JSON.stringify({
                ...state.present.pluginToolbarsById[boxId],
                state: {
                    ...state.present.pluginToolbarsById[boxId].state,
                    __pluginContainerIds: replaceAnswers(state.present.pluginToolbarsById[boxId].state.__pluginContainerIds, 'id'),
                },
            }));
            return;
        }
        pluginToolbarsById[boxId] = JSON.parse(JSON.stringify(state.present.pluginToolbarsById[boxId]));
        return;

    });
    return {
        ...state,
        present: {
            version: 3,
            ...state.present, boxesById, pluginToolbarsById,
        },
    };
}

