import {ID_PREFIX_BOX, ID_PREFIX_PAGE, ID_PREFIX_SECTION, ID_PREFIX_SORTABLE_BOX} from './constants';

export default {
    //This would be a good post to explore if we don't want to use JSON Stringify: http://stackoverflow.com/questions/728360/how-do-i-correctly-clone-a-javascript-object
    deepClone: function (myObj) {
        return JSON.parse(JSON.stringify(myObj));
    }
};

export function isView(id) {
    return id.length && (id.indexOf(ID_PREFIX_PAGE) !== -1 || id.indexOf(ID_PREFIX_SECTION) !== -1);
}

export function isPage(id) {
    return id.length && id.indexOf(ID_PREFIX_PAGE) !== -1;
}

export function isSection(id) {
    return id.length && id.indexOf(ID_PREFIX_SECTION) !== -1;
}

export function isBox(id) {
    return id.length && id.indexOf(ID_PREFIX_BOX) !== -1;
}

export function isSortableBox(id) {
    return id.length && id.indexOf(ID_PREFIX_SORTABLE_BOX) !== -1;
}

export function changeProps(object, keys, values) {
    if (Array.isArray(keys) && Array.isArray(values) && keys.length === values.length) {
        /* jshint ignore:start */
        let temp = {...object};
        for (let i = 0; i < keys.length; i++) {
            temp = changeProp(temp, keys[i], values[i]);
        }
        return temp;
        /* jshint ignore:end */
    }

    console.error("Incorrect parameters");
    return;
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

    /* jshint ignore:start */
    return {
        ...object,
        [key]: value
    };
    /* jshint ignore:end */
}

export function deleteProps(object, keys) {
    if (Array.isArray(keys)) {
        /* jshint ignore:start */
        let temp = {...object};
        for (let i = 0; i < keys.length; i++) {
            temp = deleteProp(temp, keys[i]);
        }
        return temp;
        /* jshint ignore:end */
    }
    console.error("Parameter is not an array");
    return;
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
        family = family.concat(this.findDescendantNavItems(state, child));
    });
    return family;
}

export function calculateNewIdOrder(oldArray, newChildren, newParent, itemMoved, navItems) {
    let itemsToChange = findDescendantNavItems(navItems, itemMoved);
    let oldArrayFiltered = oldArray.filter(id => itemsToChange.indexOf(id) === -1);

    // This is the index where we split the old array to add the items we're moving
    let splitIndex;

    if (newChildren.length === 1 && newChildren[0] === itemMoved) {
        splitIndex = oldArrayFiltered.indexOf(newParent) + 1;
    } else {
        let indexInNewChildren = newChildren.indexOf(itemMoved);
        if (indexInNewChildren === 0) {
            splitIndex = oldArrayFiltered.indexOf(newParent) + 1;
        } else {
            splitIndex = oldArrayFiltered.indexOf(newChildren[indexInNewChildren - 1]) + 1;
        }
    }

    let newArray = oldArrayFiltered.slice(0, splitIndex);
    newArray = newArray.concat(itemsToChange);
    newArray = newArray.concat(oldArrayFiltered.slice(splitIndex));

    return newArray;
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

Object.replaceAll = function (entity, needle, replacement, affectsKeys, affectsValues) {
    affectsKeys = typeof affectsKeys === "undefined" ? true : affectsKeys;
    affectsValues = typeof affectsValues === "undefined" ? true : affectsValues;

    var newEntity = {},
        regExp = new RegExp(needle, 'g');
    for (var property in entity) {
        if (!entity.hasOwnProperty(property)) {
            continue;
        }

        var value = entity[property],
            newProperty = property;

        if (affectsKeys) {
            newProperty = property.replace(regExp, replacement);
        }

        if (affectsValues) {
            if (value === null || (value instanceof Array && value.length === 0) || ( value instanceof Object && Object.keys(value).length === 0)) {
            } else if (value instanceof Array) {
                var obj = Object.replaceAll(value, needle, replacement, affectsKeys, affectsValues);
                value = Object.keys(obj).map(function (k) {
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


