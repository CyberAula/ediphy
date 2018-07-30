import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
export default class ImageComponent extends React.Component {

    render() {
        let { url, title, thumbnail } = this.props;
        let avatar = thumbnail || url;
        return url ? <img onError={(e)=>{
            e.target.style.display = 'none';
        }} src={avatar}
        className={'catalogImage ' + (this.props.isSelected ? 'catalogImageSelected' : '')}
        title={title}
        onClick={e => {
            this.props.onElementSelected(title, url, 'image');
        }}
        /> : null;

    }
}
ImageComponent.propTypes = {
    /**
     * Boolean that indicates whether the user has selected the image
     */
    isSelected: PropTypes.bool,
    /**
     * Function that is called when the user selects the image
     */
    onElementSelected: PropTypes.func.isRequired,
    /**
     * Image thumbnail
     */
    thumbnail: PropTypes.string,
    /**
     * Image url
     */
    url: PropTypes.string,
    /**
     * Image title
     */
    title: PropTypes.string,
};
