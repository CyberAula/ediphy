import React from "react";
import Image from "./Image";
import Mark from '../../../common/components/mark/Mark';

/* eslint-disable react/prop-types */

export function HotspotImages() {
    return {
        getRenderTemplate: function(state, props) {
            let marks = props.marks || {};
            let boxId = props.id;
            let markElements = Object.keys(marks).map((e) =>{
                let position = marks[e].value.split(',');
                let title = marks[e].title;
                let text = marks[e].text;
                let color = marks[e].color;
                let size = marks[e].size;
                let image = marks[e].image;
                let height = image !== false ? String(image.size.height) + "%" : null;
                let width = image !== false ? String(image.size.width) + "%" : null;
                let isPopUp = marks[e].connectMode === "popup";
                let isVisor = true;
                return(
                    <div key={e} style={{ position: 'absolute', top: position[0] + "%", left: position[1] + "%", width, height }}>
                        <Mark color={color}
                            text={text}
                            size={size}
                            image={image}
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
            return <Image markElements={markElements} props={props} state={state}/>;
        },

    };
}
/* eslint-enable react/prop-types */
