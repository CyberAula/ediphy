export const template = `
## \`{{componentName}}\`
 
{{#if srcLink }}From [\`{{srcLink}}\`]({{srcLink}}){{/if}}
 
 
prop | type | required | description
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
