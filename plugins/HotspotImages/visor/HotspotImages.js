import React from "react";
import img from './../../../dist/images/broken_link.png';
import Mark from '../../../common/components/mark/Mark';
/* eslint-disable react/prop-types */

export function HotspotImages(base) {
    return {
        getRenderTemplate: function(state, props) {
            let marks = props.marks || {};
            let box_id = props.id;

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
                            boxID={box_id}
                            onMarkClicked={props.onMarkClicked}/></div>
                );
            });

            return(
                <div style={{ overflow: "hidden", height: "100%" }}>
                    <img style={{ height: "100%", width: "100%" }} src={state.url} onError={(e)=>{
                        e.target.onError = null;
                        e.target.src = img; // Ediphy.Config.broken_link;
                    }}/>
                    {markElements}
                </div>);
        },

    };
}
/* eslint-enable react/prop-types */
