import React, { Component } from 'react';
import { OverlayTrigger, Tooltip, Popover } from 'react-bootstrap';
import PropTypes from 'prop-types';

export default class Mark extends Component {
    constructor(props) {
        super(props);
        this.returnMark = this.returnMark.bind(this);
        this.state = { dimensions: {} };
    }

    render() {
        let PopoverMark = (<Popover id="popover-trigger-click-root-close" >{this.props.markConnection}</Popover>);
        let ToolTipDefault = (<Tooltip positionLeft="-12" id={this.props.idKey}>{this.props.title}</Tooltip>);
        let triggerType = ['hover', 'focus'];
        if (this.props.isPopUp && !this.props.noTrigger) { triggerType = "click"; }
        if (this.props.noTrigger) { triggerType = "focus"; }
        let markType = this.props.markType || "icon";

        return (
            <OverlayTrigger key={this.props.idKey}
                text={this.props.title}
                placement="top"
                container={document.getElementById('app')}
                overlay={this.props.isPopUp ? PopoverMark : ToolTipDefault }
                trigger={triggerType} rootClose>

                <a id={'mark-' + this.props.idKey} className="mapMarker" style={{ pointerEvents: 'all', height: "100%", width: "100%" }} href="#" onClick={(this.props.isVisor && !this.props.noTrigger) ? ()=>{this.props.onMarkClicked(this.props.boxID, this.props.markValue);} : null}>
                    {this.returnMark(markType)}
                </a>
            </OverlayTrigger>
        );
    }

    returnMark(markType) {
        switch(markType) {
        case "icon":
            let color = this.props.color || "black";
            let size = (this.props.size / 10) + 'em' || '1em';
            let text = this.props.content.selectedIcon ? this.props.content.selectedIcon : "room";
            return <i key="i" style={{ color: color, fontSize: size }} className="material-icons">{text}</i>;
        case "image":
            let isHotspotImage = this.props.isImage === true;
            let height = isHotspotImage ? "100%" : String(this.props.content.imageDimensions.height) + "em";
            let width = isHotspotImage ? "100%" : String(this.props.content.imageDimensions.width) + "em";
            let img = this.props.content.url;
            return <img alt={"iconImage"} height={height} width={width} onLoad={this.onImgLoad} src={img}/>;
        case "area":
            return <h4>To-do</h4>;
        default:
            return <h4>Error</h4>;
        }
    }

}

Mark.propTypes = {
    /**
     * Box mark id
     */
    boxID: PropTypes.any,
    /**
     * Mark comes from HotspotImageComponent
     */
    isImage: PropTypes.any,
    /**
     * Mark information which varies with markType
     */
    content: PropTypes.any,
    /**
     * Type of the mark: image, icon or area
     */
    markType: PropTypes.string,
    /**
     * Id of the mark
     */
    idKey: PropTypes.any,
    /**
     * Check if mark type is a PopUp
     */
    isPopUp: PropTypes.bool,
    /**
     * Check if editor or visor mark
     */
    isVisor: PropTypes.bool,
    /**
     * Popover mark text
     */
    markConnection: PropTypes.string,
    /**
     * Mark Value to determine what click-mark do
     */
    markValue: PropTypes.any,
    /**
     * Check if noTrigger mark
     */
    noTrigger: PropTypes.bool,
    /**
     * Mark title
     */
    title: PropTypes.string,
    /**
     * Callback to dispach mark action
     */
    onMarkClicked: PropTypes.func,
};
