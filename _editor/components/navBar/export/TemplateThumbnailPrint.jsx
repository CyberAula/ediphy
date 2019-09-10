import React from 'react';
import PropTypes from 'prop-types';

export default class TemplateThumbnailPrint extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        // return <img className={this.props.className} style={this.props.style} src={this.props.image} onClick={this.props.onClick} />;
        // Thumbnail generated via HTML instead of SVG

        return (<div className={this.props.className} style={this.props.style} onClick={this.props.onClick} onDoubleClick={this.props.onDoubleClick}>

            {this.props.boxes.map((plugin, index)=>{
                let { box, thumbnail } = plugin;
                // let name = toolbar.name;
                // let config = Ediphy.Plugins.get(name).getConfig();
                // let icon = config.icon;
                // let iconFromUrl = config.iconFromUrl;

                return (<div key={index} style={{ position: 'absolute',
                    backgroundColor: thumbnail.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    top: box.y,
                    left: box.x,
                    width: box.width,
                    height: box.heightTemplate || box.height }}>
                    <i className="material-icons" style={{ color: thumbnail.icon_color }} >{thumbnail.icon}</i>
                </div>);
            })}
        </div>);
    }

}

TemplateThumbnailPrint.propTypes = {
    /**
     * CSS Class to apply
     */
    className: PropTypes.string,
    /**
     * Object containing all created boxes (by id)
     */
    boxes: PropTypes.array,
    /**
     * Style object
     */
    style: PropTypes.object,
    /**
     * Click callback
     */
    onClick: PropTypes.func,
    /**
     * Double Click callback
     */
    onDoubleClick: PropTypes.func,
};
