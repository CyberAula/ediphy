import { UPDATE_UI } from '../common/actions';
import { changeProp } from '../common/utils';

const defaultUI = {
    alert: null,
    pluginTab: '',
    hideTab: 'show',
    visorVisible: false,
    richMarksVisible: false,
    markCreatorVisible: false,
    currentRichMark: null,
    carouselShow: true,
    carouselFull: false,
    serverModal: false,
    catalogModal: false,
    grid: false,
    pluginConfigModal: false,
    publishing: false,
    showGlobalConfig: false, // cookies.get("ediphy_visitor"),
    showStyleConfig: false,
    blockDrag: false,
    showFileUpload: false,
    fileUploadTab: 0,
    showExitModal: false,
    showTour: false,
    showHelpButton: false,
    showExportModal: false,
    fileModalResult: { id: undefined, value: undefined },
};
export default function(state = defaultUI, action = {}) {
    switch (action.type) {
    case UPDATE_UI:
        if(action.payload.prop === 'STATE') {
            return action.payload.value;
        }
        if(typeof action.payload.prop === 'object' && action.payload.prop !== null) {
            let temp = { ...state };
            Object.keys(action.payload.prop).map((key) => {
                temp = changeProp(temp, key, action.payload.prop[key]);
            });
            return temp;
        }
        return changeProp(state, action.payload.prop, action.payload.value);

    default:
        return state;
    }
}
