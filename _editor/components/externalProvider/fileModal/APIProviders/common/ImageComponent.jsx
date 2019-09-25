import React from 'react';
import PropTypes from 'prop-types';
export default class ImageComponent extends React.Component {

    render() {
        let { isSelected, title, thumbnail, onElementSelected, url } = this.props;
        let avatar = thumbnail || url;
        return url ? <img onError={(e)=>{
            e.target.style.display = 'none';
        }} src={avatar}
        className={'catalogImage ' + (isSelected ? 'catalogImageSelected' : '')}
        title={title}
        onClick={() => {
            onElementSelected(title, url, 'image');
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
