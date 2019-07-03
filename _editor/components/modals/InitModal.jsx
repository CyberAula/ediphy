import React from 'react';
import PropTypes from 'prop-types';
import i18n from "i18next";
import screen from "../joyride/pantalla.svg";
import Alert from "../common/alert/Alert";
import Cookies from 'universal-cookie';

const cookies = new Cookies();

export default class InitModal extends React.Component {

    state = {
        initModal: cookies.get("ediphy_visitor") === undefined,
    };

    render() {
        return(
            <Alert className="pageModal welcomeModal"
                show={this.state.initModal}
                hasHeader={false}
                title={<span><i style={{ fontSize: '14px', marginRight: '5px' }} className="material-icons">delete</i>{i18n.t("messages.confirm_delete_cv")}</span>}
                cancelButton
                acceptButtonText={i18n.t("joyride.start")}
                onClose={(bool)=>{
                    bool && this.props.showTour();
                    this.setState({ initModal: false });
                }}>
                <div className="welcomeModalDiv">
                    <img src={screen} alt="" style={{ width: '100%' }}/>
                    <h1>{i18n.t('joyride.welcome')}<strong style={{ color: '#17CFC8' }}>Ediphy</strong>!</h1>
                    <p>{i18n.t('joyride.ediphy_description')}</p>
                    <p><strong>{i18n.t('joyride.need_help')}</strong></p>
                </div>
            </Alert>
        );
    }
}

InitModal.propTypes = {
    /**
     * Show init tour
     */
    showTour: PropTypes.func,
};

