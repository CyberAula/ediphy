import React, { Component } from 'react';
import { Modal, Form, FormGroup, Button } from 'react-bootstrap';
import i18n from 'i18next';
import PropTypes from 'prop-types';
import './_external.scss';
/**
 * VISH Catalog Modal
 */
export default class ExternalCatalogModal extends Component {
    /**
     * Constructor
     * @param props
     */
    constructor(props) {
        super(props);
    }

    /**
     * Render React Component
     * @returns {code}
     */
    render() {
        return (
            <Modal className="pageModal" backdrop bsSize="large" show={this.props.visible}>
                <Modal.Header>
                    <Modal.Title>{i18n.t("Uploaded_Images")}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form style={{ minHeight: 250 }} action="javascript:void(0);">
                        <FormGroup>
                            {(this.props.state || this.props.images.length !== 0) ? this.props.images.map((item, index) => {
                                return (
                                    <img key={index} src={item.url} className={'catalogImage'} />
                                );
                            }) : <div className="alert alert-info">{i18n.t("Uploaded_Images_No")}</div>}
                        </FormGroup>
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button onClick={e => {
                        this.props.onExternalCatalogToggled();
                    }}>{i18n.t("OK")}</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

ExternalCatalogModal.propTypes = {
    /**
     * Muestra el Modal
     */
    visible: PropTypes.bool,
    /**
      * Imágenes
      */
    images: PropTypes.object,
    /**
       * Estado
       */
    state: PropTypes.object,
    /**
      * Toggle function
      */
    onExternalCatalogToggled: PropTypes.func,
};
