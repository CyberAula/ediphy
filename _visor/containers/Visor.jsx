import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';
import i18n from 'i18next';
import { updateUI } from "../../common/actions";

import { connect } from "react-redux";

require('./_visor.scss');

class Visor extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        return this.props.visorVisible || nextProps.visorVisible;
    }

    render() {

        return (
            <Modal className="visor modalVisorContainer"
                show={this.props.visorVisible}
                backdrop bsSize="large"
                aria-labelledby="contained-modal-title-lg"
                onHide={this.toggleVisor}>
                <Modal.Header closeButton>
                    <Modal.Title><span id="previewTitle">{i18n.t('Preview')}</span></Modal.Title>

                </Modal.Header>

                <Modal.Body style={{ position: 'relative', top: '-1px', width: '100%', height: '97%', padding: '0px', backgroundColor: '#555' }}>
                    <iframe id="visor_iframe" ref={el => {
                        if(el !== null && this.props.visorVisible) {
                            el.contentWindow.document.open();
                            el.contentWindow.document.write(Ediphy.Visor.exportPage({ ...this.props.state, preview: true }));
                            el.contentWindow.document.close();
                        }
                    }} style={{ width: "100%", height: "100%", border: 0 }} allowFullScreen frameBorder="0" />
                </Modal.Body>
            </Modal>
        );
    }

    toggleVisor = () => this.props.dispatch(updateUI({ visorVisible: !this.props.visorVisible }));
}

function mapStateToProps(state) {
    return {
        visorVisible: state.reactUI.visorVisible,
    };
}

export default connect(mapStateToProps)(Visor);

Visor.propTypes = {
    /**
     * Indica si se debe mostrar o no el visor
     */
    visorVisible: PropTypes.bool,
    /**
     * Estado de la aplicación que se pasa al visor
     */
    state: PropTypes.object.isRequired,
    /**
     * Redux actions dispatcher
     */
    dispatch: PropTypes.func.isRequired,

};
