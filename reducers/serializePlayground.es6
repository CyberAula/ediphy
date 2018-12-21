let state = require('./stateJson');

let serialize = (state) => {

    if(state.present.version == 2) {
        let boxesById = {};
        let pluginToolbarsById = {};
        let replaceAnswers = (inputDictionary, fieldToReplace) => {
            let outputDictionary = {};
            Object.keys(inputDictionary).map((scKey) => {
                if (scKey.includes('Answer')) {
                    let ansN = parseInt(scKey.charAt(scKey.length - 1));
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
            let parent = state.present.boxesById[boxId].parent.toString();
            if(state.present.exercises[parent] && state.present.exercises[parent].exercises[boxId]) {
                if(state.present.exercises[parent].exercises[boxId].name !== "MultipleAnswer") {
                    boxesById[boxId] = JSON.parse(JSON.stringify(state.present.boxesById[boxId]));
                    return;
                }
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
            let page = state.present.boxesById[parent].parent;
            if(state.present.exercises[page] && state.present.exercises[page].exercises[parent] && state.present.exercises[page].exercises[parent].name === "MultipleAnswer") {
                let container = state.present.boxesById[boxId].container.toString();
                let ansN = parseInt(container.charAt(container.length - 1));
                boxesById[boxId] = JSON.parse(JSON.stringify({
                    ...state.present.boxesById[boxId],
                    container: container.includes('Answer') ? 'sc-Answer' + (ansN - 1).toString() : state.present.boxesById[boxId].container.toString(),
                }));
                return;
            }
            boxesById[boxId] = JSON.parse(JSON.stringify(state.present.boxesById[boxId]));
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
                ...state.present,
                boxesById: boxesById,
                pluginToolbarsById: pluginToolbarsById,
            },
        };
    }

    return state;

};

