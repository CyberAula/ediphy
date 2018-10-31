import {
    ID_PREFIX_BOX, ID_PREFIX_CONTAINED_VIEW, ID_PREFIX_FILE, ID_PREFIX_PAGE, ID_PREFIX_RICH_MARK,
    ID_PREFIX_SECTION, ID_PREFIX_SORTABLE_BOX,
} from '../../../../../../common/constants';
import { isBox, isSection } from '../../../../../../common/utils';

export function importEdiphy(url, props, callback) {
    let isVish = (/ediphy_documents/).test(url);
    if (isVish) {
        url += ".json";
    }
    fetch(url)
        .then(e => e.json())
        .then(data=>{
            let json = isVish ? JSON.parse(data.json) : data;
            callback(insertEdi(json, props));
        })
        .catch(e=> {
            // eslint-disable-next-line no-console
            console.error(e);
            callback(false);
        });
}

export function importExcursion(url, props, callback) {
    let isVish = (/excursion/).test(url);
    if (isVish) {
        url += "/translate.json";
    }
    fetch(url)
        .then(e => e.json())
        .then(data=>{
            callback(insertEdi(data, props));
        })
        .catch(e=> {
            // eslint-disable-next-line no-console
            console.error(e);
            callback(false);
        });

}

function insertEdi(res, props) {
    let counter = 0;
    let resource = res.present ? res.present : res;
    delete resource.globalConfig;
    let importedStateStringified = JSON.stringify(resource);
    let state = resource;
    importedStateStringified = replaceState(state.boxesById, props.boxes, importedStateStringified, (box) => isBox(box) ? ID_PREFIX_BOX : ID_PREFIX_SORTABLE_BOX);
    importedStateStringified = replaceState(state.navItemsById, props.navItems, importedStateStringified, (page) => isSection(page) ? ID_PREFIX_SECTION : ID_PREFIX_PAGE);
    importedStateStringified = replaceState(state.containedViewsById, props.containedViews, importedStateStringified, () => ID_PREFIX_CONTAINED_VIEW);
    importedStateStringified = replaceState(state.marksById, props.marks, importedStateStringified, () => ID_PREFIX_RICH_MARK);
    importedStateStringified = replaceState(state.filesUploaded, props.filesUploaded, importedStateStringified, () => ID_PREFIX_FILE);
    return JSON.parse(importedStateStringified);
}

function replaceState(importedResources, currentResources, importedStateStringified, prefix) {
    let counter = 0;
    for (let el in importedResources) {
        // eslint-disable-next-line eqeqeq
        if (currentResources[el] && el != 0) {
            importedStateStringified = importedStateStringified.replace(new RegExp(el, 'g'), prefix(el) + Date.now() + '_i_' + counter++);
        }
    }
    return importedStateStringified;
}
