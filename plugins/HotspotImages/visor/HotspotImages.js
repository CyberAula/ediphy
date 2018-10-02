import React from "react";
import img from './../../../dist/images/broken_link.png';
import Mark from '../../../common/components/mark/Mark';
import { isURL } from "../../../_editor/components/clipboard/clipboard.utils";

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
            let hyperlink = this.checkHyperlink(state.hyperlink);
            let scale = state.scale || 1;
            let translateX = (state.translate ? state.translate.x : 0) || 0;
            let translateY = (state.translate ? state.translate.y : 0) || 0;
            let transform = ` scale(${scale}) translate(${translateX}%,${translateY}%)`;
            return(
                <div style={{ overflow: "hidden", height: "100%" }}>
                    <a href={hyperlink} target="_blank" style={{ pointerEvents: hyperlink ? "initial" : "none" }}>
                        <img style={{ width: "100%", height: state.allowDeformed ? "100%" : "auto", transform }} src={state.url} onError={(e)=>{
                            e.target.onError = null;
                            e.target.src = img; // Ediphy.Config.broken_link;
                        }}/>
                        {markElements}
                    </a>
                </div>);
        },
        // Checks if link is provided. If so, it formats it to 'http://www...' in case it was 'www...'. Returns false if no link is provided.
        checkHyperlink: function(hyperlink) {
            if (hyperlink === null || hyperlink === undefined) {
                return false;
            }
            hyperlink = hyperlink.replace(/\s/g, "");
            if (hyperlink === "") {
                return false;
            }
            if (hyperlink.substring(0, 4) === "www.") {
                hyperlink = "http://" + hyperlink;
            }
            if (isURL(hyperlink)) {
                return hyperlink;
            }
            return false;
        },

    };
}
/* eslint-enable react/prop-types */
