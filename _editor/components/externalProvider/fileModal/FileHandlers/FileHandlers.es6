import React from 'react';
import { createBox } from '../../../../../common/commonTools';
import { ID_PREFIX_BOX, ID_PREFIX_SORTABLE_CONTAINER } from '../../../../../common/constants';
import { randomPositionGenerator } from '../../../clipboard/clipboard.utils';
import {
    isSlide,
    isBox,
    isContainedView,
    isPage,
    isSortableBox,
    isDataURL,
    dataURItoBlob,
    isCanvasElement,
    getIndex,
} from '../../../../../common/utils';
import i18n from 'i18next';
import { importEdiphy, importExcursion } from '../APIProviders/providers/_edi';
import './_ImportFile.scss';

export const extensionHandlers = {
    'all': { label: i18n.t("vish_search_types.All"), value: '', icon: 'attach_file' },
    'image': { label: i18n.t("vish_search_types.Picture"), value: 'image', icon: 'image' },
    'audio': { label: i18n.t("vish_search_types.Audio"), value: 'audio', icon: 'audiotrack' },
    'video': { label: i18n.t("vish_search_types.Video"), value: 'video', icon: 'play_arrow' },
    'csv': { label: i18n.t("vish_search_types.CSV"), value: 'csv', icon: 'view_agenda' },
    'pdf': { label: i18n.t("vish_search_types.Officedoc"), value: 'pdf', icon: 'picture_as_pdf' },
    'scormpackage': { label: i18n.t("vish_search_types.Scormfile"), value: 'scormpackage', icon: 'extension' },
    'webapp': { label: i18n.t("vish_search_types.Link"), value: 'webapp', icon: 'link' },
    'swf': { label: i18n.t("vish_search_types.Swf"), value: 'swf', icon: 'flash_on' },
    'xml': { label: i18n.t("vish_search_types.XML"), value: 'xml', icon: 'code' },
    'obj': { label: i18n.t("vish_search_types.OBJ"), value: 'obj', icon: '3d_rotation' },
    'edi': { label: i18n.t("vish_search_types.Ediphy"), value: 'edi', icon: 'widgets' },
    'vish': { label: i18n.t("vish_search_types.VISH"), value: 'vish', icon: 'list' },
    // 'json': { label: i18n.t("vish_search_types.JSON"), value: 'json', icon: 'view_agenda' }
    // 'sla': { label: "Objeto 3D", value: 'sla', icon: 'devices_other' },
    // { label: "Objeto 3D", value: 'octet-stream', icon: 'devices_other' },
    // { label: "Objeto 3D", value: 'stl', icon: 'devices_other' },
    // { label: "Otro", value: 'application', icon: 'devices_other' },
};

export default function handlers(self) {
    let type = self.state.type;
    let page = self.currentPage();
    let { initialParams, isTargetSlide } = getInitialParams(self, page);
    let currentPlugin = (self.props.fileModalResult && self.props.fileModalResult.id && self.props.pluginToolbars[self.props.fileModalResult.id]) ? self.props.pluginToolbars[self.props.fileModalResult.id].pluginId : null;
    let apiPlugin = currentPlugin ? Ediphy.Plugins.get(currentPlugin) : undefined;
    let pluginsAllowed = Ediphy.Config.pluginFileMap[(type === '') ? 'all' : type] || [];
    let ext = extensionHandlers[(type === '') ? 'all' : type];
    let icon = ext ? ext.icon : 'attach_file';

    let buttons = [];

    if (self.state.element) {
        if (self.props.fileModalResult && !self.props.fileModalResult.id) {
            Object.keys(pluginsAllowed).map(pluginName=>{
                let key = pluginsAllowed[pluginName];
                buttons.push({
                    title: type === 'pdf' ? (i18n.t('FileModal.FileHandlers.insert') + ' ...') : getInsertButtonTitle(pluginName),
                    disabled: !page || self.props.disabled || !self.state.element || !self.state.type || (self.props.fileModalResult && self.props.fileModalResult.id),
                    action: ()=>{
                        if (type === 'pdf') {
                            self.setState({ pdfSelected: true });
                        } else if (type === 'csv') {
                            let xhr = new XMLHttpRequest(),
                                fileReader = new FileReader();
                            fileReader.onload = (e)=>dataToState(e, self, type, initialParams, isTargetSlide, pluginName);
                            fileReader.onerror = (e)=>{alert(i18n.t('error.generic'));};
                            if(isDataURL(self.state.element)) {
                                fileReader.readAsBinaryString(dataURItoBlob(self.state.element));
                            } else {
                                xhr.open("GET", self.state.element, true);
                                xhr.responseType = "blob";

                                xhr.addEventListener("load", function() {
                                    if (xhr.status === 200) {
                                        fileReader.readAsBinaryString(xhr.response);
                                    } else {
                                        alert(i18n.t('error.generic'));
                                    }
                                }, false);
                                // Send XHR
                                xhr.send();
                            }
                        } else {
                            initialParams.initialState = { [key]: self.state.element };
                            createBox(initialParams, pluginName, isTargetSlide, self.props.onBoxAdded, self.props.boxes);
                            self.close();
                        }

                    },
                });
            });
            if (type === 'edi') {
                buttons.push({
                    title: i18n.t('FileModal.FileHandlers.embed'),
                    disabled: !page || self.props.disabled || !self.state.element || !self.state.type || self.state.name.match(/\.edi$/) || (self.props.fileModalResult && self.props.fileModalResult.id),
                    action: ()=>{
                        createBox({ ...initialParams, initialState: { url: self.state.element + ".full" } }, "Webpage", isTargetSlide, self.props.onBoxAdded, self.props.boxes);
                        self.close();
                        return;

                    },
                });
                buttons.push({
                    title: i18n.t('FileModal.FileHandlers.import'),
                    disabled: !page || self.props.disabled || !self.state.element || !self.state.type || (self.props.fileModalResult && self.props.fileModalResult.id) || self.state.options.allowClone === false,
                    action: ()=>{
                        importEdiphy(self.state.element, self.props, (res) => {
                            if (res) {
                                return self.props.handleExportImport.importEdi(res);
                            }
                            alert('Error');
                            return false;
                        });
                        self.close();
                        return;
                    },
                });
            } if (type === 'vish') {
                buttons.push({
                    title: i18n.t('FileModal.FileHandlers.embed'),
                    disabled: !page || self.props.disabled || !self.state.element || !self.state.type || (self.props.fileModalResult && self.props.fileModalResult.id),
                    action: () => {
                        createBox({ ...initialParams, initialState: { url: self.state.element + ".full" } }, "Webpage", isTargetSlide, self.props.onBoxAdded, self.props.boxes);
                        self.close();
                        return;
                    },
                });
                buttons.push({
                    title: i18n.t('FileModal.FileHandlers.import'),
                    disabled: !page || self.props.disabled || !self.state.element || !self.state.type || (self.props.fileModalResult && self.props.fileModalResult.id) || self.state.options.allowClone === false,
                    action: () => {
                        importExcursion(self.state.element, self.props, (res) => {
                            if (res) {
                                return self.props.handleExportImport.importEdi(res);
                            }
                            alert('Error');
                            return false;
                        });
                        self.close();
                        return;

                    },
                });
            } else if (type === 'xml') {
                buttons.push({
                    title: 'Insert MoodleXML', // (currentPlugin && apiPlugin.getConfig().category  === 'evaluation') ? i18n.t('FileModal.FileHandlers.replace') : (i18n.t('FileModal.FileHandlers.insert') + ' MoodleXML'),
                    disabled: !page || self.props.disabled || !self.state.element || !self.state.type || (self.props.fileModalResult && self.props.fileModalResult.id),
                    action: ()=>{ // Open side view
                        self.setState({ moodleSelected: true });
                    },
                });
            }
        } else {
            buttons.push({
                title: isCanvasElement(self.props.fileModalResult.id) ? i18n.t('FileModal.FileHandlers.replace_bckg') : i18n.t('FileModal.FileHandlers.replace'),
                action: ()=>{
                    self.close({ id: self.props.fileModalResult.id, value: self.state.element });
                },
            });
        }
    }
    return {
        icon,
        buttons,
    };
}
function getInitialParams(self, page) {
    let ids = {};
    let initialParams;
    let isTargetSlide = false;

    if (page) {
        let containerId = ID_PREFIX_SORTABLE_CONTAINER + Date.now();
        let id = ID_PREFIX_BOX + Date.now();
        isTargetSlide = isSlide(page.type);
        let parent = isTargetSlide ? page.id : page.boxes[0];
        let row = 0;
        let col = 0;
        let container = isTargetSlide ? 0 : containerId;
        let newInd;
        if (self.props.boxSelected && self.props.boxes[self.props.boxSelected] && isBox(self.props.boxSelected)) {
            parent = self.props.boxes[self.props.boxSelected].parent;
            container = self.props.boxes[self.props.boxSelected].container;
            isTargetSlide = container === 0;
            row = self.props.boxes[self.props.boxSelected].row;
            col = self.props.boxes[self.props.boxSelected].col;
            newInd = getIndex(parent, container, self.props);
        }

        ids = { id, parent, container, row, col, page: page ? page.id : 0 };
        initialParams = {
            id: ID_PREFIX_BOX + Date.now(),
            parent: parent, //
            container: container,
            row: row,
            col: col,
            index: newInd,
            page: page ? page.id : 0,
            position: isTargetSlide ? {
                type: "absolute",
                x: randomPositionGenerator(20, 40),
                y: randomPositionGenerator(20, 40),
            } : { type: 'relative', x: "0%", y: "0%" },
        };
    }

    return { initialParams, isTargetSlide };
}

function getInsertButtonTitle(allowedPluginKey) {
    return i18n.t('FileModal.FileHandlers.insert') + ' ' + i18n.t(`${allowedPluginKey}.PluginName`).toLowerCase();
}

function sanitizeInitialParams(initialParams, boxes) {
    let parent = initialParams.parent;

    if(isSortableBox(parent) || isPage(parent) || isContainedView(parent)) {
        return initialParams;
    }

    if(isBox(parent)) {
        let box = boxes[parent];
        return { ...initialParams, parent: box.parent, container: box.container };
    }

    return initialParams;
}
function csvToState(csv) {
    let lines = csv.split("\n");

    let data = [];

    let headers = lines[0].split(",");

    for(let i = 1; i < lines.length; i++) {

        let obj = Array(headers.length);
        let currentline = lines[i].split(",");

        for (let j = 0; j < headers.length; j++) {
            obj[j] = "" + currentline[j];
        }
        data.push(obj);
    }

    return { headers, data };
}

function jsonToState(json) {
    json = JSON.parse(json);
    let headers = [];
    let data = [];
    if (validateJson(json)) {
        headers = Object.keys(json[0]);
        data = json.map(r=>Object.values(r));
        return { headers, data };
    }
    return {};
}

function validateJson(json) {
    let data = {};
    if(json.length === 0) {
        return false;
    }
    let cols = Object.keys(json[0]);
    if(cols.length === 0) {
        return false;
    }
    for(let row of json) {

        if(!compareKeys(cols, Object.keys(row))) {
            return false;
        }
        cols = Object.keys(row);
    }
    return true;
}

function compareKeys(a, b) {
    a = a.sort().toString();
    b = b.sort().toString();
    return a === b;
}

function dataToState(e, self, format, initialParams, isTargetSlide, plugin) {
    try{
        let data = e.currentTarget.result;
        let headers = (data[0]) ? new Array(data[0].length) : [];
        let processed = { data: [], headers: [] };

        if (format === 'csv') {
            processed = csvToState(data);
        } else if (format === 'json') {
            processed = jsonToState(data);
        }

        data = processed.data;
        headers = processed.headers;
        let value = { name: self.state.name, data, rows: data.length, cols: data[0].length, keys: headers };
        if (plugin === 'GraficaD3') {
            value.dataProvided = data;
            value.dataProcessed = data;
        }

        if (self.props.fileModalResult && !self.props.fileModalResult.id) {
            initialParams.initialState = value;
            createBox(initialParams, plugin, isTargetSlide, self.props.onBoxAdded, self.props.boxes);
        }else {
            self.close({ id: self.props.fileModalResult.id, value });
        }
        self.close();
    } catch(_e) {
        alert(i18n.t('error.generic'));
        return;
    }
}

