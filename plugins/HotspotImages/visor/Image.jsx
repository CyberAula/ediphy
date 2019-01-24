import React from 'react';
import img from './../../../dist/images/broken_link.png';
import { isURL } from "../../../_editor/components/clipboard/clipboard.utils";
/* eslint-disable react/prop-types */

export default class Image extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        let { state, props, markElements } = this.props;
        let hyperlink = this.checkHyperlink(state.hyperlink);
        let scale = state.scale || 1;
        let translateX = (state.translate ? state.translate.x : 0) || 0;
        let translateY = (state.translate ? state.translate.y : 0) || 0;
        let transform = `translate(${translateX}%,${translateY}%) scale(${scale})`;
        return(
            <div style={{ overflow: "hidden", height: "100%", width: "100%" }} className="draggableImageVisor" ref="draggableImageVisor">
                <a href={hyperlink} target="_blank" style={{ pointerEvents: hyperlink ? "initial" : "none", overflow: "hidden", height: "100%", width: "100%" }}>
                    <img ref="img"
                        className="basicImageClass"
                        style={{ width: state.allowDeformed ? "100%" : "100%", height: state.allowDeformed ? "" : "auto", transform, WebkitTransform: transform, MozTransform: transform }}
                        src={state.url}
                        onError={(e)=>{
                            e.target.onError = null;
                            e.target.src = img; // Ediphy.Config.broken_link;
                        }}/>
                    {markElements}
                </a>
            </div>);
    }

    componentDidMount() {
        let scale = this.props.state.scale || 1;

    }

    // Checks if link is provided. If so, it formats it to 'http://www...' in case it was 'www...'. Returns false if no link is provided.
    checkHyperlink(hyperlink) {
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
    }
}
/* eslint-enable react/prop-types */
