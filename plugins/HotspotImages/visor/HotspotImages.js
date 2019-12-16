import React from "react";
import Image from "./Image";
import Mark from '../../../common/components/mark/Mark';

/* eslint-disable react/prop-types */

export function HotspotImages() {
    return {
        getRenderTemplate: function(state, props) {
            let marks = props.marks || {};
            let boxId = props.id;
            let svgMarks = [];
            let markElements = Object.keys(marks).map((e) =>{
                let position = svg ? [0, 0] : marks[e].value.split(',');
                let title = marks[e].title;
                let text = marks[e].text;
                let color = marks[e].color;
                let size = marks[e].size;
                let image = marks[e].image;
                let svg = marks[e].svg;
                let kind = marks[e].kind;
                let height = image !== false ? String(image.size.height) + "%" : svg ? '100%' : null;
                let width = image !== false ? String(image.size.width) + "%" : svg ? '100%' : null;
                let isPopUp = marks[e].connectMode === "popup";
                let isVisor = true;
                if(svg) {
                    svgMarks.push(marks[e]);
                    return null;
                }
                return(
                    <div key={e} style={{ position: 'absolute', top: svg ? 0 : position[0] + "%", left: svg ? 0 : position[1] + "%", width, height }}>
                        <Mark color={color}
                            text={text}
                            size={size}
                            image={image}
                            svg={svg}
                            kind={kind}
                            isImage
                            idKey={e}
                            title={title}
                            isPopUp={isPopUp}
                            isVisor={isVisor}
                            markConnection={marks[e].connection}
                            markValue={marks[e].value}
                            boxID={boxId}
                            onMarkClicked={props.onMarkClicked}/></div>
                );
            });

            let svgElements = svgMarks.map(mark => (
                <svg viewBox={`0 0 ${mark.svg.canvasSize.width} ${mark.svg.canvasSize.height}`}
                    style={{ position: 'absolute', pointerEvents: 'none' }}
                    height={'100%'} width={'100%'}
                    preserveAspectRatio="none">
                    <path d={mark.svg.svgPath} fill={mark.color || '#000'} style={{ pointerEvents: 'all', cursor: 'pointer' }}
                        onClick={()=>props.onMarkClicked(props.id, mark.value)}
                    />
                </svg>
            ));

            let svgContainer = (<div id={Date.now().toString()} className={'svgContainer'} style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
                {svgElements}
            </div>);
            markElements.push(svgContainer);

            return <Image markElements={markElements} props={props} state={state}/>;
        },

    };
}
/* eslint-enable react/prop-types */
