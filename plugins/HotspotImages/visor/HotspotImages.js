import React from "react";
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import img from './../../../dist/images/broken_link.png';
/* eslint-disable react/prop-types */

export function HotspotImages(base) {
    return {
        getRenderTemplate: function(state, props) {
            console.log(state, props);
            let marks = props.marks || {};
            let box_id = props.id;

            let markElements = Object.keys(marks).map((e) =>{

                let position = marks[e].value.split(',');
                let title = marks[e].title;
                let color = marks[e].color;

                return(
                    <a key={e} style={{ position: 'absolute', top: position[0] + "%", left: position[1] + "%", width: '24px', height: '26px' }} onClick={()=>{this.onMarkClicked(box_id, marks[e].value);}} href="#">
                        <OverlayTrigger placement="top" overlay={<Tooltip positionLeft="-12" id={e}>{title}</Tooltip>}>
                            <i key="i" style={{ width: "100%", height: "100%", position: 'absolute', top: '-26px', left: '-12px', color: color }} className="material-icons">room</i>
                        </OverlayTrigger>
                    </a>
                );
            });

            return(
                <div>
                    <img style={{ height: "100%", width: "100%" }} src={state.url} onError={(e)=>{
                        e.target.onError = null;
                        e.target.src = img; // Ediphy.Config.broken_link;
                    }}/>
                    {markElements}
                </div>);
        },
        onMarkClicked(element, value) {
            base.triggerMark(element, value, false);
        },
    };
}
/* eslint-enable react/prop-types */
