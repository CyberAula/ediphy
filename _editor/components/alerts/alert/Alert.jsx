import React, { Component } from 'react';
import { Button, Modal } from 'react-bootstrap';

export default class Alert extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return(
            <Modal className={this.props.className || 'popupAlert pageModal'} backdrop={this.props.backdrop === undefined ? true : this.props.backdrop} show={this.props.show} onHide={e=>{this.props.onClose(e);}}>
                {this.props.hasHeader ?
                    (this.props.closeButton ?
                        (<Modal.Header closeButton>
                            {this.props.title}
                        </Modal.Header>) :
                        (<Modal.Header>
                            {this.props.title}
                        </Modal.Header>)) :
                    (null)}
                <Modal.Body>
                    { this.props.children }
                </Modal.Body>
                <Modal.Footer>
                    <Button bsStyle={this.props.bsStyle || 'default'} className="popupFooterButton" onClick={e=>{this.props.onClose(e);}}>
                        { this.props.acceptButtonText || 'OK' }
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}
