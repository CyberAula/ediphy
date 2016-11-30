import React, {Component} from 'react';
import {Modal, Row, Col, Grid, Button, ButtonGroup} from 'react-bootstrap';
import Dali from './../../core/main';
import i18n from 'i18next';

require('./_visor.scss');

export default class Visor extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        return this.props.visorVisible || nextProps.visorVisible;
    }

    render() {
        if (this.props.state.navItemSelected === 0) {
            return (
                /* jshint ignore:start */
                <div></div>
                /* jshint ignore:end */
            );
        }
        return (
            /* jshint ignore:start */
            <Modal className="visor modalVisorContainer"
                   show={this.props.visorVisible}
                   backdrop={true} bsSize="large"
                   aria-labelledby="contained-modal-title-lg"
                   onHide={e => {
                        this.props.onVisibilityToggled()
                        }}>
                <Modal.Header closeButton>
                    <Modal.Title><span id="previewTitle">{i18n.t('Preview')}</span></Modal.Title>
                </Modal.Header>

                <Modal.Body style={{position: 'absolute', top: '56px', padding: 0, bottom: 0, width: '100%'}}>
                    <iframe ref={el => {
                        if(el !== null && this.props.visorVisible){
                            el.contentWindow.document.open();
                            el.contentWindow.document.write(Dali.Visor.exportPage(this.props.state));
                            el.contentWindow.document.close();
                        }
                    }} style={{width: "100%", height: "100%", border: 0}} allowFullScreen frameBorder="0"></iframe>
                </Modal.Body>
            </Modal>
            /* jshint ignore:end */
        );
    }
}
