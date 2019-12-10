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
                let markType = marks[e].markType;
                let width = markType === "image" ? String(marks[e].payload.size.width) + "%" : null;
                let isPopUp = marks[e].connectMode === "popup";
                let isVisor = true;
                return(
                    <div key={e} style={{ position: 'absolute', top: position[0] + "%", left: position[1] + "%", width, height: "auto" }}>
                        <Mark
                            markType={markType}
                            payload={payload}
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
