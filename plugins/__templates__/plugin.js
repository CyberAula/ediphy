export const pluginTemplate = options => `
import React from 'react';
import i18n from 'i18next';
${options.isRich ? `
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import MarkEditor from '../../_editor/components/richPlugins/markEditor/MarkEditor';
import Mark from '../../common/components/mark/Mark';
` : ''}
import { PluginContainer } from './Styles';

/* eslint-disable react/prop-types */
export function ${options.name}(base) {
    return {
        getConfig: () => ({
            name: '${options.name}',
            displayName: i18n.t('${options.name}.PluginName'),
            category: "${options.category}",
            flavor: "react",
            needsConfigModal: false,
            needsTextEdition: false,
            initialWidth: '480px',
            initialHeight: "270px",
            initialWidthSlide: '30%',
            initialHeightSlide: '30%',
            icon: 'label',
            ${options.isRich ? "isRich: true," : ""}
            ${options.isRich ? "marksType: { name: 'Mark', key: 'value', format: '[x,y]', default: '50,50', defaultColor: '#222222' }," : ""}
        }),
        getToolbar: (state) => ({
            main: {
                __name: "Main",
                accordions: {
                    basic: {
                        __name: 'Config',
                        icon: 'link',
                        buttons: {
                            name: {
                                __name: 'Config',
                                type: 'text',
                                value: state.name,
                            },
                        },
                    },
                },
            },
        }),
        getInitialState: () => ({
            name: "Ediphy",
        }),
        getRenderTemplate: (state, props) => {
        ${options.isRich ? `
            let marks = props.marks || {};
            let markElements = Object.keys(marks).map((id) =>{
                let value = marks[id].value;
                let title = marks[id].title;
                let color = marks[id].color;

                let position;
                if (value && value.split(',').length === 2) {
                    position = value.split(',');
                } else{
                    position = [0, 0];
                }
                return (
                    <MarkEditor key={id} style={{ position: 'absolute', top: position[0] + "%", left: position[1] + "%" }} time={1.5} onRichMarkMoved={props.onRichMarkMoved} mark={id} base={base} marks={marks} state={state}>
                        <Mark style={{ position: 'absolute', top: position[0] + "%", left: position[1] + "%" }} color={color} idKey={id} title={title} />
                    </MarkEditor>
                );
            });
           ` : ``}
            return (
            <PluginContainer>
                Hello {state.name} 
                ${options.isRich ? '{markElements}' : ''}
            </PluginContainer>);

        },
         
        ${options.isRich ? `
        parseRichMarkInput: function(x, y, width, height, toolbarState, boxId) {
            let xx = (x + 12) * 100 / width;
            let yy = (y + 26) * 100 / height;
            let finalValue = yy.toFixed(2) + "," + xx.toFixed(2);

            return finalValue;
        },
        getDefaultMarkValue(state) {
            return 50 + ',' + 50;
        },
        getRichMarkInput: (state, MarkInput) => {
            let div = <div><span>x,y</span><input onChange={(event)=>{MarkInput(event.target.value);}} /></div>;
            return div;
        },
        validateValueInput: (value) => {
            let regex = /(^-*\\d+(?:\\.\\d*)?),(-*\\d+(?:\\.\\d*)?$)/g;
            let match = regex.exec(value);
            if(match && match.length === 3) {
                let x = Math.round(parseFloat(match[1]) * 100) / 100;
                let y = Math.round(parseFloat(match[2]) * 100) / 100;
                if (isNaN(x) || isNaN(y)/* || x > 100 || y > 100 || x < -100 || y < -100*/) {
                    return { isWrong: true, message: "404" };
                }
                value = x + ',' + y;
            } else {
                return { isWrong: true, message: "404" };
            }
            return { isWrong: false, value: value };
        },
            ` : ``}
    };
}
/* eslint-enable react/prop-types */
`;
