import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Row, Col, ListGroupItem, ListGroup } from 'react-bootstrap';
import './_fileModal.scss';
import '../_external.scss';
import { isContainedView, isSortableContainer } from '../../../../common/utils';
import FileHandlers from './FileHandlers/FileHandlers';
import APIProviders from './APIProviders/APIProviders';
import PDFHandler from "./FileHandlers/PDFHandler";
import i18n from 'i18next';

const initialState = {
    menu: 0,
    name: undefined,
    index: undefined,
    id: undefined,
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
        this.closeSideBar = this.closeSideBar.bind(this);
        this.close = this.close.bind(this);
    }
    render() {
        let menus = APIProviders(this); // Retrieves all API providers
        let handler = FileHandlers(this); // Retrieves all file-handling actions
        return(
            <Modal className="pageModal fileModal" backdrop bsSize="large" show={this.props.visible} onHide={this.close}>
                <Modal.Header closeButton>
                    <Modal.Title>{i18n.t("FileModal.Title")}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Row className="row-eq-height">
                        <Col xs={12} sm={4} md={3} lg={3} id="menuColumn">
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
                        <Col xs={12} sm={8} md={9} lg={9} id="contentColumn" >
                            {React.createElement(menus[this.state.menu].component,
                                { ...(menus[this.state.menu].props || {}), icon: menus[this.state.menu].icon, name: menus[this.state.menu].name }, null)}
                            <div id="sideBar" className={this.state.pdfSelected ? "showBar" : ""}>
                                {this.state.pdfSelected ? (<div id="wrapper">
                                    <div id="sideArrow">
                                        <button onClick={()=>{this.closeSideBar(false);}}><i className="material-icons">keyboard_arrow_right</i></button>
                                    </div>
                                    <div id="pdfContent">
                                        <PDFHandler navItemSelected={this.props.navItemSelected}
                                            boxes={this.props.boxes}
                                            onBoxAdded={this.props.onBoxAdded}
                                            onNavItemAdded={this.props.onNavItemAdded}
                                            onNavItemsAdded={this.props.onNavItemsAdded}
                                            onIndexSelected={this.props.onIndexSelected}
                                            onNavItemSelected={this.props.onNavItemSelected}
                                            // onToolbarUpdated={this.props.onToolbarUpdated}
                                            navItemsIds={this.props.navItemsIds}
                                            navItems={this.props.navItems}
                                            containedViews={this.props.containedViews}
                                            containedViewSelected={this.props.containedViewSelected}
                                            show
                                            url={this.state.element}
                                            close={this.closeSideBar}
                                        /></div>
                                </div>) : null }

                            </div>
                            <hr className="fileModalFooter"/>
                            <Modal.Footer>
                                {this.state.element ? (
                                    <div className="footerFile">
                                        <i className="material-icons">{handler.icon || "attach_file"}</i>{this.state.name && this.state.name.length > 30 ? ('...' + this.state.name.substr(this.state.name.length - 30, this.state.name.length)) : this.state.name}</div>
                                ) : null}
                                <Button onClick={e => {
                                    this.close();
                                }}>{i18n.t("FileModal.FileHandlers.cancel")}</Button>
                                {(this.state.element && handler && handler.buttons) ? handler.buttons.map(button=>{
                                    return <Button bsStyle="primary" disabled={button.disabled} onClick={e => {
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
        this.setState({ ...initialState, menu });
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

    closeSideBar(closeAlsoModal) {
        this.setState({ pdfSelected: false });
        if (closeAlsoModal) {
            this.close();
        }
    }

}

FileModal.propTypes = {
    /**
   * Accepted MIME type for modal
   */
    showFileUploadModal: PropTypes.any,
};
