import React from 'react';

export default class FileInput extends React.Component {
    render() {
        let { name = 'file', disabled, accept, onChange = function() { return null; }, style = {}, className = '', children } = this.props;
        style.position = "relative";
        style.display = 'inline-block';
        return (
            <div style={ style } className={className}>
                <input
                    type="file"
                    name={name}
                    onChange={onChange}
                    disabled={disabled}
                    accept={accept}
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
