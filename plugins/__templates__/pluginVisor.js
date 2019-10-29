export const pluginVisorTemplate = options => `
import React from 'react';
${options.isRich ? `
import Mark from '../../../common/components/mark/Mark';
` : ''}
import { PluginContainer } from '../Styles';
/* eslint-disable react/prop-types */

export function ${options.name}(base) {

    return {
        getRenderTemplate: (state, props) => {
            ${options.isRich ? `
            let marks = props.marks || {};
            let boxId = props.id;
    
            let markElements = Object.keys(marks).map((e) =>{
            let position = marks[e].value.split(',');
            let title = marks[e].title;
            let color = marks[e].color;
            let isPopUp = marks[e].connectMode === "popup";
            let isVisor = true;
            return(
                <div key={e} style={{ position: 'absolute', top: position[0] + "%", left: position[1] + "%", width: '24px', height: '26px' }}>
                    <Mark color={color}
                        idKey={e}
                        title={title}
                        isPopUp={isPopUp}
                        isVisor={isVisor}
                        markConnection={marks[e].connection}
                        markValue={marks[e].value}
                        boxID={boxId}
                        onMarkClicked={props.onMarkClicked}/></div>
            );
        });` : ''}
            return <PluginContainer>Hello {state.name}
            ${options.isRich ? `{markElements}` : ``}
            </PluginContainer>
        }
    };
}
/* eslint-enable react/prop-types */
`;
