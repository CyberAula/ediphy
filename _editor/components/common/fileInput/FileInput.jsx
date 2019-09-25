import React from 'react';
import PropTypes from 'prop-types';

/**
 * FileInput component for dragging and dropping files
 */
export default class FileInput extends React.Component {

    /**
     * Render React Component
     * @returns {code}
     */
    render() {
        const { name = 'file', disabled, accept, onChange = function() { return null; },
            style = {}, className = '', children } = this.props;

        style.position = "relative";
        style.display = 'inline-block';
        return (
            <div style={ style } className={className}>
                <input ref = "fileInput" type="file" name={name} onChange={onChange} disabled={disabled} accept={accept}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        opacity: 0,
                        width: '100%',
                        height: '100%',
                        zIndex: 1,
                    }}
                />
                {children}
            </div>);
    }
}

FileInput.propTypes = {
    /**
     * Form input name
     */
    name: PropTypes.string,
    /**
     * Input disabled
     */
    disabled: PropTypes.bool,
    /**
     * Mimetypes accepted
     */
    accept: PropTypes.string,
    /**
     * Changes the input value
     */
    onChange: PropTypes.func.isRequired,
    /**
     * Component style
     */
    style: PropTypes.object,
    /**
     * CSS class
     */
    className: PropTypes.string,
    /**
     * Child components
     */
    children: PropTypes.any,
};
