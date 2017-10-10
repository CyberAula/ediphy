import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from 'react-bootstrap';
import i18n from 'i18next';
/** *
 * Custom alert component
 * @example  <Alert show={this.state.showAlert}      | true : displays alert / false: hides alert
 *                   className="myAlert"             | custom css class (default: popupAlert)
 *                   bsStyle="default"               | bootstrap style (default: default)
 *                   hasHeader                       | whether modal has a header (default: false)
 *                   backdrop                        | backdrop value (same as bootstrap modal) (default: true)
 *                   title="Alert"                   | title displayed in the header (if it has one) (default: empty)
 *                   closeButton                     | close button (x) in the header (if it has one) (default: false)
 *                   acceptButtonText="Accept"       | text displayed in the accept button (default: "OK")
 *                   cancelButton                    | whether there is a cancel button or not (default: false)
 *                   cancelButtonText="Cancel"       | text displayed in the cancel button (if it has one) (default: "Cancel")
 *                   onClose={(bool)=>{...}}>        | callback for when the alert is closed. bool is true when accept button is clicked, false otherwise
 *                        {children}                 | content of the alert. !!!!!! if there are controlled items (e.g. inputs) they need to be handled on the parent component
 *  </Alert>
 */
export default class Alert extends Component {
    /**
     * Constructor
     * @param props React Component props
     */
    constructor(props) {
        super(props);
    }

    /**
     * Renders React component
     * @returns {code}
     */
    render() {
        return(
            <Modal id="alertModal" className={this.props.className || 'popupAlert'}
                onKeyUp={(e)=>{
                    if (e.keyCode === 13) {
                        this.props.onClose(true);
                    }
                }}
                backdrop={this.props.backdrop === undefined ? true : this.props.backdrop}
                show={this.props.show}
                onHide={e=>{this.props.onClose(false);}}>
                { this.props.hasHeader ?
                    (<Modal.Header closeButton={this.props.closeButton}>
                        { this.props.title }
                    </Modal.Header>) :
                    (null)}
                <Modal.Body>
                    { this.props.children }
                </Modal.Body>
                <Modal.Footer>
                    { this.props.cancelButton ? (
                        <Button bsStyle={this.props.bsStyle || 'default'}
                            className="popupFooterButton"
                            onClick={e=>{this.props.onClose(false);}}>
                            { this.props.cancelButtonText || i18n.t('messages.Cancel') }
                        </Button>) : null }
                    <Button bsStyle={this.props.bsStyle || 'default'}
                        className="popupFooterButton"
                        onClick={e=>{this.props.onClose(true);}}>
                        { this.props.acceptButtonText || i18n.t('messages.OK') }
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }

}

Alert.propTypes = {
    /**
     * Indica si se muestra o se oculta la alerta
     */
    show: PropTypes.bool,
    /**
     * Clases CSS para aplicar al modal de la alerta
     */
    className: PropTypes.string,
    /**
     * Estilo de Bootstrap para los botones de la alerta
     */
    bsStyle: PropTypes.oneOf(["success", "warning", "danger", "info", "default", "primary", "link"]),
    /**
     * Indica si el modal de la alerta debe tener barra de encabezado
     */
    hasHeader: PropTypes.bool,
    /**
     * Indica si se debe incluir un fondo negro semitransparente detrás de la alerta (true). Si se especifica `static`, no se ocultará la alerta al hacer click.
     */
    backdrop: PropTypes.oneOf(['static', true, false]),
    /**
     * Título para el encabezado. Sólo se mostrará si la propedad `hasHeader` es `true`. Puede ser una cadena de texto o un componente de React.
     */
    title: PropTypes.any,
    /**
     * Indica si se debe incluir un botón de cerrar en el encabezado. Sólo se mostrará si la propedad `hasHeader` es `true`
     */
    closeButton: PropTypes.bool,
    /**
     * Texto del botón de aceptar
     */
    acceptButtonText: PropTypes.string,
    /**
     * Indica si se incluye un botón de cancelar
     */
    cancelButton: PropTypes.bool,
    /**
     * Texto del botón de cancelar (si lo hay)
     */
    cancelButtonText: PropTypes.string,
    /**
     * Cierra la alerta
     */
    onClose: PropTypes.func.isRequired,
    /**
     * Componentes que forman el interior de la alerta. Si son componentes controlados, debe gestionarse su estado desde el componente padre.
     */
    children: PropTypes.any,
};
