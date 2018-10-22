import {
    ID_PREFIX_BOX, ID_PREFIX_CONTAINED_VIEW, ID_PREFIX_FILE, ID_PREFIX_PAGE, ID_PREFIX_RICH_MARK,
    ID_PREFIX_SECTION, ID_PREFIX_SORTABLE_BOX,
} from '../../../../../../common/constants';
import { isBox, isSection } from '../../../../../../common/utils';

export function importEdiphy(url, props, callback) {
    let Url = "http://localhost:3000/ediphy_documents/4088";
    fetch(Url + ".json")
        .then(e => e.json())
        .then(data=>{
            let json = JSON.parse(data.json);
            callback(insertEdi(json, props));
        })
        .catch(e=> {
            // eslint-disable-next-line no-console
            console.error(e);
            callback(false);
        });
}

export function importExcursion(url, props, callback) {
    let Url = "http://localhost:3000/excursions/511";
    fetch(Url + "/transpile.json")
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

function insertEdi(resource, props) {
    let counter = 0;
    delete resource.present.globalConfig;
    let importedStateStringified = JSON.stringify(resource);
    let state = resource.present;
    importedStateStringified = replaceState(state.boxesById, props.boxes, importedStateStringified, (box) => isBox(box) ? ID_PREFIX_BOX : ID_PREFIX_SORTABLE_BOX);
    importedStateStringified = replaceState(state.navItemsById, props.navItems, importedStateStringified, (page) => isSection(page) ? ID_PREFIX_SECTION : ID_PREFIX_PAGE);
    importedStateStringified = replaceState(state.containedViewsById, props.containedViewsById, importedStateStringified, () => ID_PREFIX_CONTAINED_VIEW);
    importedStateStringified = replaceState(state.marksById, props.marksById, importedStateStringified, () => ID_PREFIX_RICH_MARK);
    importedStateStringified = replaceState(state.filesUploaded, props.filesUploaded, importedStateStringified, () => ID_PREFIX_FILE);
    return JSON.parse(importedStateStringified).present;
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
