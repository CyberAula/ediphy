import React from 'react';
import { createBox } from '../../../../../common/common_tools';
import { ID_PREFIX_BOX, ID_PREFIX_SORTABLE_CONTAINER } from '../../../../../common/constants';
import { randomPositionGenerator } from '../../../clipboard/clipboard.utils';
import { isSlide, isBox, isDataURL, dataURItoBlob } from '../../../../../common/utils';
import parseMoodleXML from '../../../../../core/editor/moodleXML';
import i18n from 'i18next';

export let extensions = [
    { label: "Todos", value: '', icon: 'attach_file' },
    { label: "Image", value: 'image', icon: 'image' },
    { label: "Audio", value: 'audio', icon: 'audiotrack' },
    { label: "Video", value: 'video', icon: 'play_arrow' },
    { label: "CSV", value: 'csv', icon: 'view_agenda' },
    // { label: "JSON", value: 'json', icon: 'view_agenda' },
    { label: "PDF", value: 'pdf', icon: 'picture_as_pdf' },
    { label: "XML", value: 'xml', icon: 'code' },
    { label: "Objeto 3D", value: 'sla', icon: 'devices_other' },
    { label: "Objeto 3D", value: 'octet-stream', icon: 'devices_other' },
    { label: "Objeto 3D", value: 'stl', icon: 'devices_other' },
    // { label: "Otro", value: 'application', icon: 'devices_other' },
];
export default function handlers(self) {
    let type = self.state.type;
    let page = self.currentPage();
    let { initialParams, isTargetSlide } = getInitialParams(self, page);
    let currentPlugin = (self.props.fileModalResult && self.props.fileModalResult.id && self.props.pluginToolbars[self.props.fileModalResult.id]) ? self.props.pluginToolbars[self.props.fileModalResult.id].pluginId : null;
    let apiPlugin = currentPlugin ? Ediphy.Plugins.get(currentPlugin) : undefined;
    console.log(type);
    switch(type) {
    case 'image' :
        return{
            icon: 'image',
            buttons: [
                {
                    title: (currentPlugin && currentPlugin === 'HotspotImages') ? i18n.t('FileModal.FileHandlers.replace') : (i18n.t('FileModal.FileHandlers.insert') + ' ' + i18n.t('FileModal.FileHandlers.image')),
                    disabled: !page || self.props.disabled || !self.state.element || !self.state.type,
                    action: ()=>{
                        if (self.state.element) {
                            if (self.props.fileModalResult && !self.props.fileModalResult.id) {
                                initialParams.url = self.state.element;
                                createBox(initialParams, "HotspotImages", isTargetSlide, self.props.onBoxAdded, self.props.boxes);
                                self.close();
                            } else {
                                self.close({ id: self.props.fileModalResult.id, value: self.state.element });
                            }
                        }

                    },
                },
                // download,
            ],
        };
    case 'video' :
        return {
            icon: 'play_arrow',
            buttons: [
                {
                    title: (currentPlugin && currentPlugin === 'EnrichedPlayer') ? i18n.t('FileModal.FileHandlers.replace') : (i18n.t('FileModal.FileHandlers.insert') + ' ' + i18n.t('FileModal.FileHandlers.video')),
                    disabled: !page || self.props.disabled || !self.state.element || !self.state.type,
                    action: ()=>{
                        if (self.props.fileModalResult && !self.props.fileModalResult.id) {
                            initialParams.url = self.state.element;
                            createBox(initialParams, "EnrichedPlayer", isTargetSlide, self.props.onBoxAdded, self.props.boxes);
                            self.close();
                        } else {
                            self.close({ id: self.props.fileModalResult.id, value: self.state.element });
                        }
                    },
                },
                // download,
            ] };
    case 'audio' :
        return {
            icon: 'audiotrack',
            buttons: [
                {
                    title: (currentPlugin && currentPlugin === 'BasicAudio') ? i18n.t('FileModal.FileHandlers.replace') : (i18n.t('FileModal.FileHandlers.insert') + ' ' + i18n.t('FileModal.FileHandlers.audio')),
                    disabled: !page || self.props.disabled || !self.state.element || !self.state.type || (currentPlugin && currentPlugin !== 'BasicAudio'),
                    action: ()=>{
                        if (self.props.fileModalResult && !self.props.fileModalResult.id) {
                            initialParams.url = self.state.element;
                            createBox(initialParams, "BasicAudio", isTargetSlide, self.props.onBoxAdded, self.props.boxes);
                            self.close();
                        } else {
                            self.close({ id: self.props.fileModalResult.id, value: self.state.element });
                        }
                    },
                },
                // download,
            ] };
    case 'pdf' :
        console.log('ss');
        return {
            icon: 'picture_as_pdf',
            buttons: [
                {
                    title: (currentPlugin && currentPlugin === 'BasicPDF') ? i18n.t('FileModal.FileHandlers.replace') : (i18n.t('FileModal.FileHandlers.insert') + ' pdf'),
                    disabled: !page || self.props.disabled || !self.state.element || !self.state.type || (currentPlugin && currentPlugin !== 'BasicPDF') /* || (self.props.fileModalResult && self.props.fileModalResult.id)*/,
                    action: ()=>{ // Open side view
                        if (self.state.element) {
                            if (self.props.fileModalResult && !self.props.fileModalResult.id) {
                                self.setState({ pdfSelected: true });
                            } else {
                                self.close({ id: self.props.fileModalResult.id, value: self.state.element });
                            }
                        }
                    },
                },
                // download,
            ] };
    case 'csv' :
        /* case 'json':*/
        return {
            icon: 'view_agenda',
            buttons: [
                {
                    title: (currentPlugin && currentPlugin === 'DataTable') ? i18n.t('FileModal.FileHandlers.replace') : (i18n.t('FileModal.FileHandlers.insert') + ' ' + i18n.t('FileModal.FileHandlers.table')),
                    disabled: !page || self.props.disabled || !self.state.element || !self.state.type || (currentPlugin && currentPlugin !== 'DataTable'),
                    action: () => {
                        if (self.state.element) {
                            let xhr = new XMLHttpRequest(),
                                fileReader = new FileReader();
                            fileReader.onload = (e)=>dataToState(e, self, type, initialParams, isTargetSlide, 'DataTable');
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

                        }

                    },
                },
                {
                    title: (currentPlugin && currentPlugin === 'GraficaD3') ? i18n.t('FileModal.FileHandlers.replace') : (i18n.t('FileModal.FileHandlers.insert') + ' ' + i18n.t('FileModal.FileHandlers.graph')),
                    disabled: !page || self.props.disabled || !self.state.element || !self.state.type || (currentPlugin && currentPlugin !== 'GraficaD3'),
                    action: () => {
                        if (self.state.element) {
                            let xhr = new XMLHttpRequest(),
                                fileReader = new FileReader();
                            fileReader.onload = (e)=>dataToState(e, self, type, initialParams, isTargetSlide, 'GraficaD3');
                            if(isDataURL(self.state.element)) {
                                fileReader.readAsBinaryString(dataURItoBlob(self.state.element));
                                fileReader.onerror = (e)=>{alert(i18n.t('error.generic'));};
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

                        }

                    },
                },
                // download,
            ] };
    case 'xml' :
        return {
            icon: 'link',
            buttons: [
                {
                    title: 'Insert MoodleXML', // (currentPlugin && apiPlugin.getConfig().category  === 'evaluation') ? i18n.t('FileModal.FileHandlers.replace') : (i18n.t('FileModal.FileHandlers.insert') + ' MoodleXML'),
                    disabled: !page || self.props.disabled || !self.state.element || !self.state.type || (self.props.fileModalResult && self.props.fileModalResult.id),
                    action: ()=>{ // Open side view
                        if (self.props.fileModalResult && !self.props.fileModalResult.id) {
                            parseMoodleXML(self.state.element, msg=>{
                                if (msg && msg.success && msg.question) {
                                    initialParams.exercises = msg.question;
                                    initialParams.initialState = msg.question.state;
                                    if (msg.question.id) {
                                        initialParams.id = msg.question.id;
                                    }

                                    createBox(initialParams, msg.question.name, isTargetSlide, self.props.onBoxAdded, self.props.boxes);
                                    self.close();
                                } else {
                                    alert(msg ? (msg.msg || 'ERROR') : 'ERROR');
                                }

                            });

                        } else {
                            // self.close({ id: self.props.fileModalResult.id, value: self.state.element });
                        }
                    },
                },
                // download,
            ] };
    case 'sla' :
    case 'octet-stream' :
    case 'stl':
        return {
            icon: 'devices_other',
            buttons: [
                {
                    title: (currentPlugin && currentPlugin === 'Visor3D') ? i18n.t('FileModal.FileHandlers.replace') : (i18n.t('FileModal.FileHandlers.insert') + ' ' + i18n.t('FileModal.FileHandlers.Object3D')),
                    disabled: !page || self.props.disabled || !self.state.element || !self.state.type || (!self.state.name.match('stl') && !self.state.element.match('thingiverse')) || (currentPlugin && currentPlugin !== 'Visor3D'),
                    action: ()=>{
                        if (self.props.fileModalResult && !self.props.fileModalResult.id) {
                            initialParams.url = self.state.element;
                            createBox(initialParams, "Visor3D", isTargetSlide, self.props.onBoxAdded, self.props.boxes);
                            self.close();
                        } else {
                            self.close({ id: self.props.fileModalResult.id, value: self.state.element });
                        }
                    },
                },
                // download,
            ] };
    default :
        return {
            icon: 'attach_file',
            buttons: [
                // download,
            ] };
    }
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
            newInd = self.getIndex(parent, container);
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
    } catch(e) {
        alert(i18n.t('error.generic'));
        return;
    }
}

