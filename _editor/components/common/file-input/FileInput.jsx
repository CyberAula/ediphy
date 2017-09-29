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
        let { name = 'file',
            disabled,
            accept,
            onChange = function() { return null; },
            style = {},
            className = '',
            children } = this.props;

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

FileInput.propTypes = {
    /**
     * Nombre para el input en el formulario
     */
    name: PropTypes.string,
    /**
     * Input desactivado
     */
    disabled: PropTypes.bool,
    /**
     * Extensiones aceptadas para los ficheros elegidos
     */
    accept: PropTypes.string,
    /**
     * Cambia el valor del input
     */
    onChange: PropTypes.func.isRequired,
    /**
     * Estilo para el componente
     */
    style: PropTypes.object,
    /**
     * Clase CSS para el componente
     */
    className: PropTypes.string,
    /**
     * Componentes hijos
     */
    children: PropTypes.any,
};
