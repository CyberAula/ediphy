/**
 * Copyright (c) 2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

const template = `
## \`{{componentName}}\`
 
{{#if srcLink }}From [\`{{srcLink}}\`]({{srcLink}}){{/if}}
 
 
prop | tipo | obligatoria | descripción
---- | :----: | :-----------: | -----------
{{#each props}}
**{{@key}}** | \`{{> (typePartial this) this}}\`  | {{#if this.required}}✔{{else}}✘{{/if}} | {{#if this.description}}{{{this.description}}}{{/if}}
{{/each}}
 
 
{{#each composes}}
#### {{this.componentName}}
 
prop | type | required | description
---- | :----: | :--------: | -----------
{{#each this.props}}
**{{@key}}** | \`{{> (typePartial this) this}}\` | {{#if this.required}}:white_check_mark:{{else}}:x:{{/if}} | {{#if this.description}}{{{this.description}}}{{/if}}
{{/each}}
 
{{/each}}
`;

function stringOfLength(string, length) {
    let newString = '';
    for (let i = 0; i < length; i++) {
        newString += string;
    }
    return newString;
}

function generateTitle(name) {
    let title = '## `' + name + '`';
    return title + '\n' + stringOfLength('=', title.length) + '\n';
}

function generateDesciption(description) {
    return description + '\n';
}

function generatePropType(type) {
    let values;
    if (Array.isArray(type.value)) {
        values = '(' +
      type.value.map(function(typeValue) {
          return typeValue.name || typeValue.value;
      }).join('|') +
      ')';
    } else {
        values = type.value;
    }

    return 'type: `' + type.name + (values ? values : '') + '`\n';
}

function generatePropDefaultValue(value) {
    return 'defaultValue: `' + value.value + '`\n';
}

function generateProp(propName, prop) {
    console.log(prop.description);
    return (
        '### `' + propName + '`' + (prop.required ? ' (required)' : '') + '\n' +
    '\n' +
    (prop.description ? prop.description + '\n\n' : '') +
    (prop.type ? generatePropType(prop.type) : '') +
    (prop.defaultValue ? generatePropDefaultValue(prop.defaultValue) : '') +
    '\n'
    );
}

function generateProps(props) {
    let title = 'Props';

    return (
        title + '\n' +
    stringOfLength('-', title.length) + '\n' +
    '\n' +
    Object.keys(props).sort().map(function(propName) {
        return generateProp(propName, props[propName]);
    }).join('\n')
    );
}

function generateMarkdown(name, reactAPI) {
    if (name.indexOf("AutoSave") !== -1) {
        console.log(name);
        console.log(reactAPI.props);
    }
    if(!reactAPI.props) {return "";}
    let markdownString =
    generateTitle(name) + '\n' +
    generateDesciption(reactAPI.description) + '\n' +
    generateProps(reactAPI.props);

    return markdownString;
}

module.exports = generateMarkdown;
