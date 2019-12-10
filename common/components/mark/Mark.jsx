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
        let text = this.props.text ? this.props.text : "room";
        let size = (this.props.size / 10) + 'em' || '1em';
        let img = this.props.image.url;
        let color = this.props.color || "black";
        let kind = this.props.kind || 'icon';
        let width;
        let height;
        if(this.props.image !== false) {
            let isHotspotImage = this.props.isImage === true;
            height = isHotspotImage ? "100%" : String(this.props.image.size.height) + "em";
            width = isHotspotImage ? "100%" : String(this.props.image.size.width) + "em";
        }

        return (
            <OverlayTrigger key={this.props.idKey}
                text={this.props.title}
                placement="top"
                container={document.getElementById('app')}
                overlay={this.props.isPopUp ? PopoverMark : ToolTipDefault }
                trigger={triggerType} rootClose>

                <a id={'mark-' + this.props.idKey} className="mapMarker" style={{ pointerEvents: 'all', height: "100%", width: "100%" }} href="#" onClick={(this.props.isVisor && !this.props.noTrigger) ? ()=>{this.props.onMarkClicked(this.props.boxID, this.props.markValue);} : null}>
                    {this.returnMark(kind, text, size, color, img, height, width)}
                </a>
            </OverlayTrigger>
        );
    }

    returnMark(kind, text, size, color, image, height, width) {
        switch (kind) {
        case 'image':
            return <img height={height} width={width} onLoad={this.onImgLoad} src={image}/>;
        case 'svg':
            return (<svg viewBox={`0 0 ${this.props.svg.canvasSize.width} ${this.props.svg.canvasSize.height}`}
                style={{ position: 'absolute' }}
                height={'100%'} width={'100%'}
                preserveAspectRatio="none">
                <path d={this.props.svg.svgPath} fill={color}/>
            </svg>);
        case 'icon':
            return <i key="i" style={{ color: color, fontSize: size }} className="material-icons">{text}</i>;
        }
    }

}

Mark.propTypes = {
    /**
     * Box mark id
     */
    boxID: PropTypes.any,
    /**
     * Mark color
     */
    color: PropTypes.any,
    /**
     * Text of the mark to determine type of material-icon
     */
    text: PropTypes.string,
    /**
     * Size of the mark
     */
    size: PropTypes.any,
    /**
     * Mark comes from HotspotImageComponent
     */
    isImage: PropTypes.any,
    /**
     * Object with the url and size of the image
     */
    image: PropTypes.any,
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
