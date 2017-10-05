import { ID_PREFIX_BOX, ID_PREFIX_PAGE, ID_PREFIX_SECTION, ID_PREFIX_SORTABLE_BOX,
    ID_PREFIX_CONTAINED_VIEW, ID_PREFIX_SORTABLE_CONTAINER, PAGE_TYPES } from './constants';

export default {
    // This would be a good post to explore if we don't want to use JSON Stringify: http://stackoverflow.com/questions/728360/how-do-i-correctly-clone-a-javascript-object
    deepClone: function(myObj) {
        return myObj ? JSON.parse(JSON.stringify(myObj)) : myObj;
    },
};

export function isView(id) {
    return isPage(id) || isSection(id);
}

export function isPage(id) {
    return id.length && id.indexOf(ID_PREFIX_PAGE) !== -1;
}

export function isSlide(type) {
    return type === PAGE_TYPES.SLIDE;
}

export function isDocument(type) {
    return type === PAGE_TYPES.DOCUMENT;
}

export function isSection(id) {
    return id.length && id.indexOf(ID_PREFIX_SECTION) !== -1;
}

export function isCanvasElement(id, config) {
    return isPage(id) || (isSection(id) && config) || isContainedView(id);
}

export function isBox(id) {
    return id.length && id.indexOf(ID_PREFIX_BOX) !== -1;
}

export function isSortableBox(id) {
    return id.length && id.indexOf(ID_PREFIX_SORTABLE_BOX) !== -1;
}

export function isContainedView(id) {
    return id.length && id.indexOf(ID_PREFIX_CONTAINED_VIEW) !== -1;
}

export function isSortableContainer(id) {
    return id.length && id.indexOf(ID_PREFIX_SORTABLE_CONTAINER) !== -1;
}

export function changeProps(object, keys, values) {
    if (Array.isArray(keys) && Array.isArray(values) && keys.length === values.length) {
        let temp = { ...object };
        for (let i = 0; i < keys.length; i++) {
            temp = changeProp(temp, keys[i], values[i]);
        }
        return temp;
    }

    console.error("Incorrect parameters");
    return undefined;
}

export function changeProp(object, key, value) {
    // This is based in object spread notation
    // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
    // ...object -> add rest of properties (in this case, all of them)
    // If property "keys" is found in object, replace value with "values"; otherwise, add it
    // return new object -> state is not mutated!!

    // ---------------------------------------------------------------------------
    // ORDER IS IMPORTANT!!
    // return {...object, [keys]: values}; !== return {[keys]: values, ...object};
    // First one works, second does not!
    // ---------------------------------------------------------------------------

    return {
        ...object,
        [key]: value,
    };
}

export function deleteProps(object, keys) {
    if (Array.isArray(keys)) {
        let temp = { ...object };
        for (let i = 0; i < keys.length; i++) {
            temp = deleteProp(temp, keys[i]);
        }
        return temp;
    }
    console.error("Parameter is not an array");
    return undefined;
}

export function deleteProp(object, key) {
    // This is based in object spread notation
    // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
    // split object into new ones using it's properties
    // to the properties we're interesting in deleting, we assign whatever (omit is nothing)
    // rest of properties are stored in a new object (rest) -> state is not mutated!!

    let {
        [key]: omit,
        ...rest
    } = object;
    return rest;
}

export function findDescendantNavItems(state, element) {
    let family = [element];
    state[element].children.forEach(child => {
        family = family.concat(findDescendantNavItems(state, child));
    });
    return family;
}

export function findNavItemContainingBox(state, element) {
    let containerNav;
    Object.keys(state).forEach(child => {
        if(state[child].boxes.indexOf(element) !== -1) {
            containerNav = state[child];
        }
    });
    return containerNav;
}

export function calculateNewIdOrder(oldArray, newChildren, newParent, itemMoved, navItems) {
    let itemsToChange = findDescendantNavItems(navItems, itemMoved);
    let oldArrayFiltered = oldArray.filter(id => itemsToChange.indexOf(id) === -1);

    // This is the index where we split the old array to add the items we're moving
    let splitIndex = oldArrayFiltered.length;

    let indexInNewChildren = newChildren.indexOf(itemMoved);
    // If we didn't move to last position of new children, we split by the position of the following one
    if (indexInNewChildren !== newChildren.length - 1) {
        splitIndex = oldArrayFiltered.indexOf(newChildren[indexInNewChildren + 1]);

    // We have to look for the next item that has a lower or equal level
    // If none is found, it means we were dragging to last position, so default value for splitIndex is not changed
    } else {
        for(let i = oldArrayFiltered.indexOf(newParent) + 1; i < oldArrayFiltered.length; i++) {
            if(navItems[oldArrayFiltered[i]].level <= navItems[newParent].level) {
                splitIndex = i;
                break;
            }
        }
    }

    let newArray = oldArrayFiltered.slice(0, splitIndex);
    newArray = newArray.concat(itemsToChange);
    newArray = newArray.concat(oldArrayFiltered.slice(splitIndex));

    return newArray;
}

export function isAncestorOrSibling(searchingId, actualId, boxes) {
    if (searchingId === actualId) {
        return true;
    }
    let parentId = boxes[actualId].parent;
    if (parentId === searchingId) {
        return true;
    }
    if (isView(parentId)) {
        return false;
    }

    if (!isSortableBox(parentId)) {
        let parentContainers = boxes[parentId].children;
        if (parentContainers.length !== 0) {
            for (let i = 0; i < parentContainers.length; i++) {
                let containerChildren = boxes[parentId].sortableContainers[parentContainers[i]].children;
                for (let j = 0; j < containerChildren.length; j++) {
                    if (containerChildren[j] === searchingId) {
                        return true;
                    }
                }
            }
        }
    }

    return isAncestorOrSibling(searchingId, parentId, boxes);
}
/**
 * Calculates next available name for a view
 * @param key Common part of name to look for. Example: "Page ", "Contained view "..
 * @param views containedviewsbyid or navitemsbyid
 * @returns next name available. Example: "Contained view 7"
 */
export function nextAvailName(key, views, name = 'name') {
    let names = [];
    for (let view in views) {
        if (views[view][name] && views[view][name].indexOf(key) !== -1) {
            let replaced = views[view][name].replace(key /* + " "*/, "");
            let num = parseInt(replaced, 10);
            if (!isNaN(num)) {
                names.push(num);
            }
        }
    }
    if (names.length > 0) {
        return key + " " + (Math.max(...names) + 1);
    }
    return key + " " + 1;
}
/**
 * Same as previous but with toolbar
 * @param key Common part of name to look for. Example: "Page ", "Contained view "..
 * @param views toolbarsbyid
 * @returns next name available. Example: "Contained view 7"
 */
export function nextToolbarAvailName(key, views) {
    let names = [];
    for (let view in views) {
        if (views[view] &&
            views[view].controls &&
            views[view].controls.main &&
            views[view].controls.main.accordions &&
            views[view].controls.main.accordions.basic &&
            views[view].controls.main.accordions.basic.buttons &&
            views[view].controls.main.accordions.basic.buttons.navitem_name &&
            views[view].controls.main.accordions.basic.buttons.navitem_name.value &&
            views[view].controls.main.accordions.basic.buttons.navitem_name.value.indexOf(key) !== -1) {
            let replaced = views[view].controls.main.accordions.basic.buttons.navitem_name.value.replace(key /* + " "*/, "");
            let num = parseInt(replaced, 10);
            if (!isNaN(num)) {
                names.push(num);
            }
        }
    }
    if (names.length > 0) {
        return key + " " + (Math.max(...names) + 1);
    }
    return key + " " + 1;
}
/** **
 * Check if item is in collection
 * @param a: Collection
 * @param b: Item
 * @returns {boolean} true is it is, false if it is not
 */
function collectionHas(a, b) { // helper function (see below)
    for (let i = 0, len = a.length; i < len; i++) {
        if (a[i] === b) {
            return true;
        }
    }
    return false;
}
/** *
 * Find closest ancestor with a given selector
 * @param elm  Origin DOM element
 * @param selector  Selector to search
 * @returns {*|Node} DOM node found of null
 */
export function findParentBySelector(elm, selector) {
    const all = document.querySelectorAll(selector);
    let cur = elm.parentNode;
    while (cur && !collectionHas(all, cur)) {// keep going up until you find a match
        cur = cur.parentNode;// go up
    }
    return cur;// will return null if not found
}

/**
 * Replaces all occurences of needle (interpreted as a regular expression with replacement and returns the new object.
 *
 * @param entity The object on which the replacements should be applied to
 * @param needle The search phrase (as a regular expression)
 * @param replacement Replacement value
 * @param affectsKeys[optional=true] Whether keys should be replaced
 * @param affectsValues[optional=true] Whether values should be replaced
 */

Object.replaceAll = function(entity, needle, replacement, affectsKeys, affectsValues) {
    affectsKeys = typeof affectsKeys === "undefined" ? true : affectsKeys;
    affectsValues = typeof affectsValues === "undefined" ? true : affectsValues;

    let newEntity = {},
        regExp = new RegExp(needle, 'g');
    for (let property in entity) {
        if (!entity.hasOwnProperty(property)) {

        }

        let value = entity[property],
            newProperty = property;

        if (affectsKeys) {
            newProperty = property.replace(regExp, replacement);
        }

        if (affectsValues) {
            if (value === null || (value instanceof Array && value.length === 0) || (value instanceof Object && Object.keys(value).length === 0)) {
            } else if (value instanceof Array) {
                let obj = Object.replaceAll(value, needle, replacement, affectsKeys, affectsValues);
                value = Object.keys(obj).map(function(k) {
                    return obj[k];
                });

            } else if (typeof value === "object") {
                value = Object.replaceAll(value, needle, replacement, affectsKeys, affectsValues);
            } else if (typeof value === "string") {
                value = value.replace(regExp, replacement);
            }
        }

        newEntity[newProperty] = value;
    }

    return newEntity;
};

