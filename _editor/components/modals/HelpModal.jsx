import React from 'react';
import PropTypes from 'prop-types';
import i18n from "i18next";
import { Modal } from "react-bootstrap";
import help from "../joyride/help.svg";
import { updateUI } from "../../../common/actions";

import { connect } from "react-redux";
import handleModals from "../../handlers/handleModals";
import { HelpModalContainer } from "./Styles";

class HelpModal extends React.Component {

    render() {
        return(
            <HelpModalContainer className="pageModal welcomeModal helpModal"
                show={this.props.showHelpButton}
                cancelButton
                acceptButtonText={i18n.t("joyride.start")}
                onHide={this.closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{i18n.t("messages.help")}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div style={{ width: '100%' }}>
                        <h2>{i18n.t('messages.help_modal_text')}</h2>
                        <img src={help} alt="" style={{ width: '100%' }}/>
                    </div>
                    <div className={"help_options"}>
                        <button onClick={handleModals(this).showTour} className={"help_item"}>Paseo de bienvenida a EDiphy</button>
                        <a href="http://ging.github.io/ediphy/#/manual" target="_blank"><div className={"help_item"}>
                            Si después del paseo inicial te ha quedado alguna duda, consulta nuestro manual de usuario
                        </div></a>
                        <a href="http://ging.github.io/ediphy/#/docs" target="_blank"><div className={"help_item"}>
                            Si eres desarrollador, echa un ojo a la documentación
                        </div></a>
                    </div>
                </Modal.Body>
            </HelpModalContainer>
        );
    }

    closeModal = () => this.props.dispatch(updateUI({ showHelpButton: false }));
}

function mapStateToProps(state) {
    return {
        showHelpButton: state.reactUI.showHelpButton,
    };
}

export default connect(mapStateToProps)(HelpModal);

HelpModal.propTypes = {
    /**
     * Redux actions dispatcher
     */
    dispatch: PropTypes.func.isRequired,
    /**
     * Show help button
     */
    showHelpButton: PropTypes.any,
};
