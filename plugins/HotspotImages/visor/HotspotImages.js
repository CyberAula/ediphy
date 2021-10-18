import React from "react";
import Image from "./Image";
import Mark from '../../../common/components/mark/Mark';

/* eslint-disable react/prop-types */

export function HotspotImages() {
    return {
        getRenderTemplate: function(state, props) {
            let marks = props.marks || {};
            let boxId = props.id;
            let svgElements = [];
            let markElements = Object.keys(marks).map((e) =>{
                let mark = marks[e];
                let { value, title, markType, content, color, size } = mark;
                let position = (value && value.split(',').length === 2) ? value.split(',') : [0, 0];
                let width = markType === "image" ? String(mark.content.imageDimensions.width) + "%" : null;
                let isPopUp = mark.connectMode === "popup";
                let isVisor = true;

                if (markType === 'area') {
                    svgElements.push(<svg key={e} viewBox={`0 0 ${mark.content.svg.canvasSize.width} ${mark.content.svg.canvasSize.height}`}
                        style={{ position: 'absolute', pointerEvents: 'none' }}
                        height={'100%'} width={'100%'}
                        preserveAspectRatio="none">
                        <Mark
                            pluginType={'img'}
                            markType={markType}
                            content={content}
                            isImage
                            idKey={e}
                            title={title}
                            isPopUp={isPopUp}
                            isVisor={isVisor}
                            markConnection={mark.connection}
                            markValue={mark.value}
                            boxID={boxId}
                            size={size}
                            color={color}>
                            <path d={mark.content.svg.svgPath} fill={mark.color || '#000'} style={{ pointerEvents: 'all', cursor: mark.content?.changeCursor ? 'pointer' : 'default' }} onClick={() => {props.onMarkClicked(props.id, mark.value);}} />
                        </Mark>
                    </svg>);
                    return null;
                }
                return(
                    <div key={e} style={{ position: 'absolute', transform: "translate(-50%, -100%)", top: position[0] + "%", left: position[1] + "%", width: width, height: "auto" }}>
                        <Mark
                            pluginType={'img'}
                            markType={markType}
                            content={content}
                            isImage
                            idKey={e}
                            title={title}
                            isPopUp={isPopUp}
                            isVisor={isVisor}
                            markConnection={mark.connection}
                            markValue={mark.value}
                            boxID={boxId}
                            size={size}
                            color={color}
                            onMarkClicked={props.onMarkClicked}/></div>
                );
            });

            let svgContainer = (<div key={markElements.length + 1} className={'svgContainer'} style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
                {svgElements}
            </div>);
            markElements.push(svgContainer);
            return <Image markElements={markElements} props={props} state={state}/>;
        },

    };
}
/* eslint-enable react/prop-types */
