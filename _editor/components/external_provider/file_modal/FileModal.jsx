import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Row, Col, ListGroupItem, ListGroup } from 'react-bootstrap';
import './_fileModal.scss';
import { MyFilesComponent } from './MyFilesComponent';

export class FileModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            category: 0,
        };

    }
    render() {
        let allowedMIME = this.props.visible || "";
        let commonProps = {
            callback: (res)=>{console.log(res);},
        };
        const categories = [{
            name: 'My Files',
            icon: '',
            show: true,
            component: MyFilesComponent,
            props: {
                show: allowedMIME,
                filesUploaded: this.props.filesUploaded,
                onUploadVishResource: this.props.onUploadVishResource,
                onUploadEdiphyResource: this.props.onUploadEdiphyResource,
            },
        },
        {
            name: 'VISH',
            icon: '',
            show: (allowedMIME === "*" || allowedMIME.match('image')),
            component: MyFilesComponent,
            props: {},
        },
        {
            name: 'Youtube',
            icon: '',
            show: (allowedMIME === "*" || allowedMIME.match('video')),
            component: MyFilesComponent,
            props: {},
        }];

        return(
            <Modal className="pageModal fileModal" backdrop bsSize="large" show={this.props.visible} onHide={this.props.close}>
                <Modal.Header closeButton>
                    <Modal.Title><i style={{ fontSize: '18px' }} className="material-icons">attach_file</i> {"Insertar contenido" }</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Row className="row-eq-height">
                        <Col xs={12} md={3} id="categoryColumn">
                            <ListGroup>
                                {categories.filter(cat=>cat.show).map((cat, i)=>{ return <ListGroupItem active={this.state.category === i} key={i} onClick={()=>this.clickHandler(i)} className={"listGroupItem"}>{cat.name}</ListGroupItem>; })}
                            </ListGroup>
                        </Col>
                        <Col xs={12} md={9} id="contentColumn" >
                            <h5>{categories[this.state.category].name}</h5>
                            <hr/>
                            {React.createElement(categories[this.state.category].component, { ...commonProps, ...(categories[this.state.category].props || {}) }, null)}
                            <Modal.Footer>
                                <Button onClick={e => {
                                    this.props.close();
                                }}>Cancel</Button>
                            </Modal.Footer>
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>);
    }

    clickHandler(i) {
        this.setState({ category: i });
    }
}

FileModal.propTypes = {
    /**
   * Accepted MIME type for modal
   */
    showFileUploadModal: PropTypes.any,
};
