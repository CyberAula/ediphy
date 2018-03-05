import React from 'react';
import PropTypes from 'prop-types';

export default class TemplateThumbnail extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        return <img className={this.props.className} style={this.props.style} src={this.props.image} onClick={this.props.onClick} />;
        // Thumbnail generated via HTML instead of SVG
        /*
        return (<div className={this.props.className} style={this.props.style} onClick={this.props.onClick}>

            this.props.boxes.map((plugin, index)=>{
                let {box, toolbar} = plugin;
                let name = toolbar.name
                let config = Ediphy.Plugins.get(name).getConfig();
                let icon = config.icon;
                let iconFromUrl = config.iconFromUrl;
                let lineHeight = (parseFloat(box.height)/100*80)+'px';

                 return ( <div  key={index} style={{position: 'absolute',
                    backgroundColor: 'grey',
                    top: box.y,
                    left: box.x,
                    width: box.width,
                    height: box.height}}>
                    <span style={{ verticalAlign: 'middle', lineHeight: lineHeight, display: 'inherit', textAlign: 'center'}}>
                    {iconFromUrl ? <img src={icon} alt={name} />:<i className="material-icons"  >{icon}</i> }
                    </span>
                </div>)
            })
        </div>) */
    }

}

TemplateThumbnail.propTypes = {
    /**
     * CSS Class to apply
     */
    className: PropTypes.string,
    /**
     * Thumbnail image
     */
    image: PropTypes.any,
    /**
     * Style object
     */
    style: PropTypes.object,
    /**
     * Click callback
     */
    onClick: PropTypes.func,
    /**
     * Array of boxes
     */
    // boxes: PropTypes.array,

};
