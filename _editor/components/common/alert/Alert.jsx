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
                            name='cancelButton'
                            className="popupFooterButton"
                            onClick={e=>{this.props.onClose(false);}}>
                            { this.props.cancelButtonText || i18n.t('messages.Cancel') }
                        </Button>) : null }
                    <Button bsStyle={this.props.bsStyle || 'primary'}
                        name='okButton'
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
     * Whether the alert should be shown
     */
    show: PropTypes.bool,
    /**
     * CSS classes applied to the alert
     */
    className: PropTypes.string,
    /**
     * Bootstrap style for the alert buttons
     */
    bsStyle: PropTypes.oneOf(["success", "warning", "danger", "info", "default", "primary", "link"]),
    /**
     * Whether the alert should have a header
     */
    hasHeader: PropTypes.bool,
    /**
     * Whether the alert needs a backdrop overlay
     */
    backdrop: PropTypes.oneOf(['static', true, false]),
    /**
     * Alert title
     */
    title: PropTypes.any,
    /**
     * Whether the alert needs a close button
     */
    closeButton: PropTypes.bool,
    /**
     * Accept button text
     */
    acceptButtonText: PropTypes.string,
    /**
     * Whether the alert has a cancel button
     */
    cancelButton: PropTypes.bool,
    /**
     * Cancel button text
     */
    cancelButtonText: PropTypes.string,
    /**
     * Closes the alertta
     */
    onClose: PropTypes.func.isRequired,
    /**
     * Components inside the alert
     */
    children: PropTypes.any,
};
