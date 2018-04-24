import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Row, Col, ListGroupItem, ListGroup } from 'react-bootstrap';
import './_fileModal.scss';
import '../_external.scss';
import { isContainedView, isSortableContainer } from '../../../../common/utils';
import FileHandlers from './FileHandlers/FileHandlers';
import APIProviders from './APIProviders/APIProviders';
const initialState = {
    menu: 0,
    name: undefined,
    index: undefined,
    element: undefined,
    type: undefined,
    pdfSelected: false,
};
export default class FileModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = initialState;
        this.getIndex = this.getIndex.bind(this);
        this.currentPage = this.currentPage.bind(this);
        this.close = this.close.bind(this);
    }
    render() {
        let menus = APIProviders(this); // Retrieves all API providers
        let handler = FileHandlers(this); // Retrieves all file-handling actions
        return(
            <Modal className="pageModal fileModal" backdrop bsSize="large" show={this.props.visible} onHide={this.close}>
                <Modal.Header closeButton>
                    <Modal.Title><i style={{ fontSize: '18px' }} className="material-icons">attach_file</i> {"Importar contenido" }</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Row className="row-eq-height">
                        <Col xs={12} sm={4} md={3} lg={2} id="menuColumn">
                            <ListGroup>
                                {menus.map((cat, i)=>{
                                    if (cat.show) {
                                        return <ListGroupItem active={this.state.menu === i} key={i}
                                            onClick={()=>this.clickHandler(i)}
                                            className={"listGroupItem"}>
                                            {cat.icon ? <img className="fileMenuIcon" src={cat.icon} alt=""/> : <span className="fileMenuName">{cat.name}</span> }
                                        </ListGroupItem>;
                                    }
                                    return null;
                                })}
                            </ListGroup>
                        </Col>
                        <Col xs={12} sm={8} md={9} lg={10} id="contentColumn" >
                            {React.createElement(menus[this.state.menu].component,
                                { ...(menus[this.state.menu].props || {}), icon: menus[this.state.menu].icon, name: menus[this.state.menu].name }, null)}
                            <hr className="fileModalFooter"/>
                            <Modal.Footer>
                                {this.state.element ? (
                                    <div className="footerFile">
                                        <i className="material-icons">{handler.icon || "attach_file"}</i>{this.state.name && this.state.name.length > 30 ? ('...' + this.state.name.substr(this.state.name.length - 30, this.state.name.length)) : this.state.name}</div>
                                ) : null}
                                <Button onClick={e => {
                                    this.close();
                                }}>Cancel</Button>
                                {(this.state.element && handler && handler.buttons) ? handler.buttons.map(button=>{
                                    return <Button disabled={button.disabled} onClick={e => {
                                        button.action();
                                    }}>{button.title}</Button>;
                                }) : null}
                            </Modal.Footer>
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>);
    }

    /**
     * Selects menu left
     * @param i
     */
    clickHandler(menu) {
        this.setState({ menu, element: undefined, index: undefined, type: undefined });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.visible !== this.props.visible && this.props.fileModalResult.id !== nextProps.fileModalResult.id) {
            this.setState({ menu: 0, element: undefined, index: undefined, type: undefined });
        }
    }

    /**
     * Calculates current page (nav or cv)
     */
    currentPage() {
        return isContainedView(this.props.containedViewSelected) ?
            this.props.containedViews[this.props.containedViewSelected] :
            (this.props.navItemSelected !== 0 ? this.props.navItems[this.props.navItemSelected] : null);
    }

    getIndex(parent, container) {
        let newInd;
        if(isSortableContainer(container)) {
            let children = this.props.boxes[parent].sortableContainers[container].children;
            newInd = children.indexOf(this.props.boxSelected) + 1;
            newInd = newInd === 0 ? 1 : ((newInd === -1 || newInd >= children.length) ? (children.length) : newInd);
        }
        return newInd;
    }
    close(e) {
        this.setState({ ...initialState });
        this.props.close(e);
    }

}

FileModal.propTypes = {
    /**
   * Accepted MIME type for modal
   */
    showFileUploadModal: PropTypes.any,
};
