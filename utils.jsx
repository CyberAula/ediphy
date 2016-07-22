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


 