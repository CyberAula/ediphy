import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, ListGroupItem, ListGroup } from 'react-bootstrap';
import './_fileModal.scss';
import '../_external.scss';
import { isContainedView } from '../../../../common/utils';
import FileHandlers from './FileHandlers/FileHandlers';
import APIProviders from './APIProviders/APIProviders';
import PDFHandler from "./FileHandlers/PDFHandler";
import MoodleHandler from "./FileHandlers/MoodleHandler";

import { connect } from "react-redux";
import i18n from 'i18next';
import { updateUI } from "../../../../common/actions";

const initialState = {
    menu: 0,
    name: undefined,
    index: undefined,
    id: undefined,
    element: undefined,
    type: undefined,
    pdfSelected: false,
    moodleSelected: false,
    options: {},
};

class FileModal extends React.Component {

    state = {
        menu: 0,
        name: undefined,
        index: undefined,
        id: undefined,
        element: undefined,
        type: undefined,
        pdfSelected: false,
        moodleSelected: false,
        options: {},
    };

    render() {

        let menus = APIProviders(this); // Retrieves all API providers
        let handler = FileHandlers(this); // Retrieves all file-handling actions
        return(
            <Modal className="pageModal fileModal"
                backdrop bsSize="large"
                show={!!this.props.visible}
                onHide={this.close}>
                <Modal.Header closeButton>
                    <Modal.Title>{i18n.t("FileModal.Title")}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div className="row-eq-height">
                        <div id="menuColumn">
                            <ListGroup>
                                {menus.map((cat, i)=>{
                                    if (cat && cat.show) {
                                        return <ListGroupItem active={this.state.menu === i} key={i}
                                            onClick={()=>this.clickHandler(i)}
                                            className={"listGroupItem"}>
                                            {cat.icon ? <img className="fileMenuIcon" src={cat.icon} alt=""/> : <span className="fileMenuName">{cat.name}</span> }
                                        </ListGroupItem>;
                                    }
                                    return null;
                                })}
                            </ListGroup>
                        </div>
                        <div id="contentColumn">
                            {React.createElement(menus[this.state.menu].component,
                                { ...(menus[this.state.menu].props || {}), icon: menus[this.state.menu].icon, name: menus[this.state.menu].name, show: menus[this.state.menu].show }, null)}
                            <div id="sideBar" className={(this.state.pdfSelected || this.state.moodleSelected) ? "showBar" : ""}>
                                {this.state.pdfSelected ? (<div id="wrapper">
                                    <div id="sideArrow">
                                        <button onClick={()=>{this.closeSideBar(false);}}><i className="material-icons">keyboard_arrow_right</i></button>
                                    </div>
                                    <div id="drawerContent">
                                        <PDFHandler navItemSelected={this.props.navItemSelected}
                                            boxes={this.props.boxes}
                                            onBoxAdded={this.props.onBoxAdded}
                                            onNavItemAdded={this.props.handleNavItems.onNavItemAdded}
                                            onNavItemsAdded={this.props.handleNavItems.onNavItemsAdded}
                                            onIndexSelected={this.props.onIndexSelected}
                                            onNavItemSelected={this.props.handleNavItems.onNavItemSelected}
                                            navItemsIds={this.props.navItemsIds}
                                            navItems={this.props.navItems}
                                            containedViews={this.props.containedViews}
                                            containedViewSelected={this.props.containedViewSelected}
                                            show
                                            url={this.state.element}
                                            close={this.closeSideBar}
                                        /></div>
                                </div>) : null }
                                {this.state.moodleSelected ? (<div id="wrapper">
                                    <div id="sideArrow">
                                        <button onClick={()=>{this.closeSideBar(false);}}><i className="material-icons">keyboard_arrow_right</i></button>
                                    </div>
                                    <div id="drawerContent">
                                        <MoodleHandler navItemSelected={this.props.navItemSelected}
                                            self={this}
                                            boxes={this.props.boxes}
                                            onBoxAdded={this.props.onBoxAdded}
                                            onNavItemAdded={this.props.handleNavItems.onNavItemAdded}
                                            onNavItemsAdded={this.props.handleNavItems.onNavItemsAdded}
                                            onIndexSelected={this.props.onIndexSelected}
                                            onNavItemSelected={this.props.handleNavItems.onNavItemSelected}
                                            navItemsIds={this.props.navItemsIds}
                                            navItems={this.props.navItems}
                                            containedViews={this.props.containedViews}
                                            containedViewSelected={this.props.containedViewSelected}
                                            show
                                            element={this.state.element}
                                            close={this.closeSideBar}
                                        /></div>
                                </div>) : null }
                            </div>
                            <hr className="fileModalFooter"/>
                            <Modal.Footer>
                                {this.state.element &&
                                    <div key={-2} className="footerFile">
                                        <i className="material-icons">{handler.icon || "attach_file"}</i>{this.state.name}</div>
                                }
                                <div className={"fileModalButtonsFooter"}>
                                    <Button key={-1} onClick={this.close}>
                                        {i18n.t("FileModal.FileHandlers.cancel")}
                                    </Button>
                                    {(this.state.element && handler && handler.buttons) && handler.buttons.map((button, key)=>{
                                        return (
                                            <Button bsStyle="primary" key={key}
                                                disabled={button.disabled}
                                                onClick={button.action}
                                            >
                                                {button.title}
                                            </Button>);
                                    })}
                                </div>
                            </Modal.Footer>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>);
    }

    /**
     * Selects menu left
     * @param menu
     */
    clickHandler = (menu) => {
        this.setState({ ...initialState, menu });
    };

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.visible !== this.props.visible && this.props.fileModalResult.id !== nextProps.fileModalResult.id) {
            this.setState({ menu: 0, element: undefined, index: undefined, type: undefined });
        }
        if (this.props.fileUploadTab !== nextProps.fileUploadTab) {
            this.setState({ menu: nextProps.fileUploadTab });
        }
    }

    /**
     * Calculates current page (nav or cv)
     */
    currentPage = () => {
        return isContainedView(this.props.containedViewSelected) ?
            this.props.containedViews[this.props.containedViewSelected] :
            (this.props.navItemSelected !== 0 ? this.props.navItems[this.props.navItemSelected] : null);
    };

    close = (fileModalResult) => {
        this.setState({ ...initialState });
        this.props.dispatch((updateUI({
            showFileUpload: false,
            fileUploadTab: 0,
            fileModalResult: fileModalResult ? fileModalResult : { id: undefined, value: undefined },
        })));
    };

    closeSideBar = (closeAlsoModal) => {
        this.setState({ pdfSelected: false, moodleSelected: false });
        if (closeAlsoModal) {
            this.close();
        }
    };
}

function mapStateToProps(state) {
    return {
        visible: state.reactUI.showFileUpload,
        boxSelected: state.undoGroup.present.boxSelected,
        boxes: state.undoGroup.present.boxesById,
        isBusy: state.undoGroup.present.isBusy,
        fileModalResult: state.reactUI.fileModalResult,
        navItemsIds: state.undoGroup.present.navItemsIds,
        navItems: state.undoGroup.present.navItemsById,
        containedViews: state.undoGroup.present.containedViewsById,
        containedViewSelected: state.undoGroup.present.containedViewSelected,
        navItemSelected: state.undoGroup.present.navItemSelected,
        filesUploaded: state.filesUploaded,
        pluginToolbars: state.undoGroup.present.pluginToolbarsById,
        marks: state.undoGroup.present.marksById,
        fileUploadTab: state.reactUI.fileUploadTab,
    };
}

export default connect(mapStateToProps)(FileModal);

FileModal.propTypes = {
    /**
     * Redux actions dispatcher
     */
    dispatch: PropTypes.func.isRequired,
    /**
     * Whether the file modal is visible or not
     */
    visible: PropTypes.any.isRequired,
    /**
     * Current selected view (by ID)
     */
    navItemSelected: PropTypes.any.isRequired,
    /**
     * Callback for adding a new box
     */
    onBoxAdded: PropTypes.func.isRequired,
    /**
     * Function for selecting a view in the index
     */
    onIndexSelected: PropTypes.func.isRequired,
    /**
     * Array containing the ids of all the views
     */
    navItemsIds: PropTypes.array.isRequired,
    /**
     * Object containing all views (by id)
     */
    navItems: PropTypes.object.isRequired,
    /**
     * Object containing all contained views
     */
    containedViews: PropTypes.object.isRequired,
    /**
     * Selected contained view
     */
    containedViewSelected: PropTypes.any.isRequired,
    /**
     * Last files uploaded to server or searched in modal
     */
    fileModalResult: PropTypes.object,
    /**
     * Current open tab in File Modal
     */
    fileUploadTab: PropTypes.any,
    /**
     * Object containing all the boxes
     */
    boxes: PropTypes.object.isRequired,
    /**
     * Collection of callbacks for nav items handling
     */
    handleNavItems: PropTypes.object.isRequired,

};
