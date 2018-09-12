import React from "react";
import img from './../../../dist/images/broken_link.png';
import Mark from '../../../common/components/mark/Mark';
/* eslint-disable react/prop-types */

export function HotspotImages(base) {
    return {
        getRenderTemplate: function(state, props) {
            let marks = props.marks || {};
            let box_id = props.id;

            // Checks if link is provided. If so, it formats it to 'http://www...' in case it was 'www...'. Returns false if no link is provided.
            function checkHyperlink() {
                let hyperlink = state.hyperlink;
                if (hyperlink === null || hyperlink === undefined) {
                    return false;
                }

                hyperlink = state.hyperlink.replace(/\s/g, "");

                if (hyperlink === "") {
                    return false;
                }

                if (hyperlink.substring(0, 4) === "www.") {
                    state.hyperlink = "http://" + hyperlink;
                }
                return true;

            }

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
                    <a href={state.hyperlink} target="_blank" style={{ pointerEvents: checkHyperlink() ? "auto" : "none" }}>
                        <img style={{ height: "100%", width: "100%" }} src={state.url} onError={(e)=>{
                            e.target.onError = null;
                            e.target.src = img; // Ediphy.Config.broken_link;
                        }}/>
                        {markElements}
                    </a>
                </div>);
        },

    };
}
/* eslint-enable react/prop-types */
