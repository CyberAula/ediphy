import {
    deleteRemoteFileEdiphyAsync, deleteRemoteFileVishAsync, exportStateAsync, importEdi, importState,
    uploadEdiphyResourceAsync, uploadVishResourceAsync,
} from "../../common/actions";
import Ediphy from "../../core/editor/main";
import printToPDF from "../../core/editor/print";
import toMoodleXML from "../../core/editor/moodleXML.es6.js";
import { serialize } from "../../reducers/serializer";

export default (self) => ({
    deleteFileFromServer: (id, url, callback) => {
        let inProduction = (process.env.NODE_ENV === 'production' && process.env.DOC !== 'doc');
        let deleteFunction = inProduction ? deleteRemoteFileVishAsync : deleteRemoteFileEdiphyAsync;
        self.props.dispatch(deleteFunction(id, url, callback));
    },

    exportResource: (format, callback, options) => {
        let currentState = self.props.store.getState();
        switch (format) {
        case 'PDF':
            printToPDF(currentState.undoGroup.present, callback, options);
            break;
        case 'MoodleXML':
            toMoodleXML(currentState.undoGroup.present, callback, options);
            break;
        case 'edi':
            Ediphy.Visor.exportsEDI({ ...currentState.undoGroup.present, filesUploaded: currentState.filesUploaded }, callback);
            break;
        default:
            Ediphy.Visor.exportsHTML({ ...currentState.undoGroup.present, filesUploaded: currentState.filesUploaded }, callback, options);
            break;
        }
    },

    exportToScorm: () => (is2004, callback, selfContained = false) => {
        let currentState = self.props.store.getState();
        Ediphy.Visor.exportScorm({
            ...currentState.undoGroup.present,
            filesUploaded: currentState.filesUploaded,
            status: currentState.status }, is2004, callback, selfContained);
    },

    importEdi: (state) => self.props.dispatch(serialize(importEdi(state))),

    uploadFunction: (query, keywords, callback) => {
        let inProduction = (process.env.NODE_ENV === 'production' && process.env.DOC !== 'doc');
        let uploadFunction = inProduction ? uploadVishResourceAsync : uploadEdiphyResourceAsync;
        self.props.dispatch(uploadFunction(query, keywords, callback));
    },

    importState: ediphy_editor_json => self.props.dispatch(importState(serialize(JSON.parse(ediphy_editor_json)))),

    save: (win) => self.props.dispatch(exportStateAsync({ ...self.props.store.getState() }, win)),
});
