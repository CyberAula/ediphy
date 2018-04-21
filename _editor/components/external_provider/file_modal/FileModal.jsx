import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Row, Col, ListGroupItem, ListGroup } from 'react-bootstrap';
import './_fileModal.scss';
import MyFilesComponent from './MyFilesComponent';
import SearchVishComponent from './SearchVishComponent';
import YoutubeComponent from './YoutubeComponent';
import { isContainedView, isSlide, isBox, isSortableBox, isView, isSortableContainer } from '../../../../common/utils';
import { instanceExists, scrollElement, findBox, createBox } from '../../../../common/common_tools';
import { ID_PREFIX_BOX, ID_PREFIX_SORTABLE_CONTAINER, ID_PREFIX_RICH_MARK } from '../../../../common/constants';
import { randomPositionGenerator } from '../../clipboard/clipboard.utils';

export default class FileModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            menu: 0,
            name: undefined,
            index: undefined,
            element: undefined,
            type: undefined,
            pdfSelected: false,
        };
        this.menus = this.menus.bind(this);
        this.handlers = this.handlers.bind(this);
        this.getIndex = this.getIndex.bind(this);
        this.currentPage = this.currentPage.bind(this);
    }
    render() {
        let menus = this.menus();
        let handler = this.handlers(this.state.type);
        return(
            <Modal className="pageModal fileModal" backdrop bsSize="large" show={this.props.visible} onHide={this.props.close}>
                <Modal.Header closeButton>
                    <Modal.Title><i style={{ fontSize: '18px' }} className="material-icons">attach_file</i> {"Insertar contenido" }</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Row className="row-eq-height">
                        <Col xs={12} md={2} id="menuColumn">
                            <ListGroup>
                                {
                                    menus.map((cat, i)=>{
                                        if (cat.show) {
                                            return <ListGroupItem active={this.state.menu === i} key={i}
                                                onClick={()=>this.clickHandler(i)}
                                                className={"listGroupItem"}>{cat.name}</ListGroupItem>;
                                        }
                                        return null;

                                    })
                                }
                            </ListGroup>
                        </Col>
                        <Col xs={12} md={10} id="contentColumn" >
                            <h5>{menus[this.state.menu].name}</h5>
                            <hr />
                            {React.createElement(menus[this.state.menu].component, menus[this.state.menu].props || {}, null)}
                            <hr className="fileModalFooter"/>
                            <Modal.Footer>
                                {this.state.element ? (
                                    <div className="footerFile">
                                        <i className="material-icons">{handler.icon || "attach_file"}</i>{this.state.name && this.state.name.length > 30 ? ('...' + this.state.name.substr(this.state.name.length - 30, this.state.name.length)) : this.state.name}</div>
                                ) : null}
                                <Button onClick={e => {
                                    this.props.close();
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
     * Left side options
     */
    menus() {
        let allowedMIME = this.props.visible || "";
        let commonProps = {
            onElementSelected: (name, element, type) => { this.setState({ name, element, type }); },
            elementSelected: this.state.element,
        };
        return [
            { // TODO Add icons
                name: 'My Files',
                icon: '',
                show: true,
                component: MyFilesComponent,
                props: {
                    ...commonProps,
                    show: allowedMIME,
                    pdfSelected: this.state.pdfSelected,
                    closeSideBar: (closeAlsoModal)=>{this.setState({ pdfSelected: false }); if (closeAlsoModal) {this.props.close();}},
                    filesUploaded: this.props.filesUploaded,
                    onUploadVishResource: this.props.onUploadVishResource,
                    onUploadEdiphyResource: this.props.onUploadEdiphyResource,
                    onNavItemsAdded: this.props.onNavItemsAdded,
                    onIndexSelected: this.props.onIndexSelected,
                    onNavItemSelected: this.props.onNavItemSelected,
                    navItemsIds: this.props.navItemsIds,
                    navItems: this.props.navItems,
                    navItemSelected: this.props.navItemSelected,
                    containedViews: this.props.containedViews,
                    containedViewSelected: this.props.containedViewSelected,
                    boxes: this.props.boxes,
                    onBoxAdded: this.props.onBoxAdded,
                },
            },
            {
                name: 'VISH',
                icon: '',
                show: (allowedMIME === "*" || allowedMIME.match('image')),
                component: SearchVishComponent,
                props: { ...commonProps,
                    onFetchVishResources: this.props.onFetchVishResources,
                    fetchResults: this.props.fetchResults,
                },
            },
            {
                name: 'Youtube',
                icon: '',
                show: (allowedMIME === "*" || allowedMIME.match('video')),
                component: YoutubeComponent,
                props: { ...commonProps },
            },
        ];
    }
    /**
     * Calculates current page (nav or cv)
     */
    currentPage() {
        return isContainedView(this.props.containedViewSelected) ?
            this.props.containedViews[this.props.containedViewSelected] :
            (this.props.navItemSelected !== 0 ? this.props.navItems[this.props.navItemSelected] : null);
    }

    handlers(type) {
        let download = { // Forces browser download
            title: 'Download',
            disabled: !this.state.element,
            action: ()=>{
                let anchor = document.createElement('a');
                anchor.href = this.state.element;
                anchor.target = '_blank';
                anchor.download = this.state.name;
                anchor.click();
            },
        };
        let page = this.currentPage();
        let { initialParams, isTargetSlide } = this.initialParams(page);
        switch(type) {
        case 'image' :
            return{
                icon: 'image',
                buttons: [
                    {
                        title: 'Insert',
                        disabled: !page || this.props.disabled || !this.state.element || !this.state.type,
                        action: ()=>{
                            if (this.state.element) {
                                if (this.props.fileModalResult && !this.props.fileModalResult.id) {
                                    initialParams.url = this.state.element;
                                    createBox(initialParams, "HotspotImages", isTargetSlide, this.props.onBoxAdded, this.props.boxes);
                                    this.props.close();
                                } else {
                                    this.props.close({ id: this.props.fileModalResult.id, value: this.state.element });
                                }
                            }

                        },
                    },
                    download,
                ],
            };
        case 'video' :
            return {
                icon: 'play_arrow',
                buttons: [
                    {
                        title: 'Insert',
                        disabled: !page || this.props.disabled || !this.state.element || !this.state.type,
                        action: ()=>{
                            if (this.props.fileModalResult && !this.props.fileModalResult.id) {
                                initialParams.url = this.state.element;
                                createBox(initialParams, "EnrchedPlayer", isTargetSlide, this.props.onBoxAdded, this.props.boxes);
                                this.props.close();
                            } else {
                                this.props.close({ id: this.props.fileModalResult.id, value: this.state.element });
                            }
                        },
                    },
                    download,
                ] };
        case 'audio' :
            return {
                icon: 'audiotrack',
                buttons: [
                    {
                        title: 'Insert',
                        disabled: !page || this.props.disabled || !this.state.element || !this.state.type,
                        action: ()=>{
                            if (this.props.fileModalResult && !this.props.fileModalResult.id) {
                                initialParams.url = this.state.element;
                                createBox(initialParams, "EnrchedPlayer", isTargetSlide, this.props.onBoxAdded, this.props.boxes);
                                this.props.close();
                            } else {
                                this.props.close({ id: this.props.fileModalResult.id, value: this.state.element });
                            }
                        },
                    },
                    download,
                ] };
        case 'pdf' :
            return {
                icon: 'picture_as_pdf',
                buttons: [
                    {
                        title: 'Insert',
                        disabled: !page || this.props.disabled || !this.state.element || !this.state.type || (this.props.fileModalResult && this.props.fileModalResult.id),
                        action: ()=>{ // Open side view
                            if (this.state.element) {
                                this.setState({ pdfSelected: true });
                            }
                        },
                    },
                    download,
                ] };
        case 'csvAUNNOFUNCIONA' :
            return {
                icon: 'view_agenda',
                buttons: [
                    {
                        title: 'Insert',
                        disabled: !page || this.props.disabled || !this.state.element || !this.state.type || (this.props.fileModalResult && this.props.fileModalResult.id),
                        action: ()=>{
                            if (this.state.element) {
                                // TODO Crear Gráfica/Datatable
                            }
                            this.props.close();
                        },
                    },
                    download,
                ] };
        default :
            return {
                icon: 'attach_file',
                buttons: [
                    download,
                ] };
        }
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

    initialParams(page) {
        let ids = {};
        let initialParams;
        let isTargetSlide = false;

        if (page) {
            let containerId = ID_PREFIX_SORTABLE_CONTAINER + Date.now();
            let id = ID_PREFIX_BOX + Date.now();
            isTargetSlide = isSlide(page.type);
            let parent = isTargetSlide ? page.id : page.boxes[0];
            let row = 0;
            let col = 0;
            let container = isTargetSlide ? 0 : containerId;
            let newInd;
            if (this.props.boxSelected && this.props.boxes[this.props.boxSelected] && isBox(this.props.boxSelected)) {
                parent = this.props.boxes[this.props.boxSelected].parent;
                container = this.props.boxes[this.props.boxSelected].container;
                isTargetSlide = container === 0;
                row = this.props.boxes[this.props.boxSelected].row;
                col = this.props.boxes[this.props.boxSelected].col;
                newInd = this.getIndex(parent, container);
            }

            ids = { id, parent, container, row, col, page: page ? page.id : 0 };
            // Copied data is an EditorBox
            initialParams = {
                id: ID_PREFIX_BOX + Date.now(),
                parent: parent, //
                container: container,
                row: row,
                col: col,
                index: newInd,
                page: page ? page.id : 0,
                position: isTargetSlide ? {
                    type: "absolute",
                    x: randomPositionGenerator(20, 40),
                    y: randomPositionGenerator(20, 40),
                } : { type: 'relative', x: "0%", y: "0%" },
            };
        }

        return { initialParams, isTargetSlide };
    }

}

FileModal.propTypes = {
    /**
   * Accepted MIME type for modal
   */
    showFileUploadModal: PropTypes.any,
};
