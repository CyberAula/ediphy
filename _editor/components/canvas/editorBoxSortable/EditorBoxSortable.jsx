import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { OverlayTrigger, Popover, Tooltip, Overlay } from 'react-bootstrap';
import interact from 'interactjs';
import Alert from './../../common/alert/Alert';
import EditorBox from '../editorBox/EditorBox';
import { ID_PREFIX_BOX, ID_PREFIX_SORTABLE_CONTAINER } from '../../../../common/constants';
import { getNewIndex, isSortableBox } from '../../../../common/utils';
import Ediphy from '../../../../core/editor/main';
import i18n from 'i18next';

import { instanceExists, createBox } from '../../../../common/commonTools';
import { connect } from "react-redux";
import _handlers from "../../../handlers/_handlers";
import { PopoverButton } from '../../carousel/Styles';
import {
    Container, DeleteButton,
    DnDZone,
    EditorBoxSortableContainer,
    SortableContainerBox,
    SwapButton,
} from "./Styles";
import SortableCell from "./SortableCell";

/**
 * EditorBoxSortable Component
 * @desc It is a special kind of EditorBox that is automatically added when a document is created. It cannot be moved or resized and it takes up the whole width of the page. It has different 'rows', named SortableContainers, where plugins are displayed, that can be sorted.
 */
class EditorBoxSortable extends Component {
    /**
     * Constructor
     * @param props React component props
     */
    state = { alert: null };

    h = _handlers(this);

    /**
     * Renders React Component
     * @returns {code} React rendered component
     */
    render() {

        let box = this.props.boxesById[this.props.id];
        return (
            <Container
                onMouseDown={e => {
                    if (e.target === e.currentTarget || e.target.classList.contains('colDist-j')) {
                        if (box.children.length !== 0) {
                            this.h.onBoxSelected(this.props.id);
                        }
                    }
                    e.stopPropagation();
                }}>
                <SortableContainerBox ref="sortableContainer"
                    className={(this.props.id === this.props.boxSelected && box.children.length > 0) ? ' selectedBox sortableContainerBox' : ' sortableContainerBox'}
                    style={{ position: 'relative', boxSizing: 'border-box' }}>
                    {this.state.alert}
                    {box.children.map((idContainer, index) => {
                        let container = box.sortableContainers[idContainer];
                        return (<EditorBoxSortableContainer key={'sortableContainer-' + index}
                            className={"editorBoxSortableContainer pos_relative " + container.style.className}
                            data-id={idContainer}
                            id={idContainer}
                            ref={idContainer}
                            style={
                                Object.assign({}, {
                                    height: container.height === 'auto' ? container.height : container.height + 'px',
                                }, container.style)
                            }>
                            <div className="disp_table width100 height100" style={{ minHeight: '100px' }}>
                                {container.colDistribution.map((col, i) => {
                                    if (container.cols[i]) {
                                        return (<div key={i}
                                            className={"colDist-i height100 disp_table_cell vert_al_top colNum" + i}
                                            style={{ width: col + "%" }}>
                                            {container.cols[i].map((row, j) => {
                                                return (<SortableCell key={j} row={j}
                                                    className={"colDist-j width100 pos_relative rowNum" + j}
                                                    cellStyle={{ height: row + "%", minHeight: parseInt(100 / (container.cols[i].length), 10) + 'px' }}
                                                    extraParams={{
                                                        idContainer: idContainer,
                                                        i: i,
                                                        j: j,
                                                    }}
                                                    parent={this.props.id}
                                                    onAlertClose={() => { this.setState({ alert: null });}}
                                                    setAlert={() => this.setState({ alert: alert })}
                                                    onBoxAdded={this.h.onBoxAdded}
                                                    onBoxDropped={this.h.onBoxDropped}
                                                    page={this.props.page}
                                                >
                                                    {container.children.map((idBox, ind) => {
                                                        if (this.props.boxesById[idBox].col === i && this.props.boxesById[idBox].row === j) {
                                                            return (<EditorBox id={idBox}
                                                                key={'box-' + idBox}
                                                                page={this.props.page}
                                                                pageType={this.props.pageType}
                                                                themeColors={this.props.themeColors} />);
                                                        } else if (ind === container.children.length - 1) {
                                                            return (<span key={ind}><br/><br /></span>);
                                                        }

                                                        return null;
                                                    })}
                                                    {container.children.length === 0 ? (<div key={-1} style={{ height: '46px' }} />) : null}
                                                </SortableCell>);
                                            })}
                                        </div>);
                                    }

                                    return null;
                                })}
                            </div>

                            <div className="sortableMenu width100 over_hidden">
                                <div className="iconsOverBar float_left pos_absolute bottom0">
                                    {box.children.length > 1 ? <OverlayTrigger placement="top" overlay={
                                        <Tooltip id="deleteTooltip">{i18n.t('Reorder')}
                                        </Tooltip>}>
                                        <SwapButton className="material-icons drag-handle btnOverBar">swap_vert</SwapButton>
                                    </OverlayTrigger> : null}

                                    <Overlay rootClose
                                        show={this.state.show === idContainer}
                                        placement="top"
                                        container={this}
                                        target={() => ReactDOM.findDOMNode(this.refs['btn-' + idContainer])}
                                        onHide={() => { this.setState({ show: this.state.show === idContainer ? false : this.state.show }); }}>
                                        <Popover id="popov" title={i18n.t("delete_container")}>
                                            <i style={{ color: 'yellow', fontSize: '13px', padding: '0 5px' }} className="material-icons">warning</i>
                                            {i18n.t("messages.delete_container")}
                                            <br />
                                            <br />
                                            <PopoverButton
                                                style={{ float: 'right' }}
                                                onClick={e => {
                                                    this.h.onSortableContainerDeleted(idContainer, box.id);
                                                    e.stopPropagation();
                                                    this.setState({ show: false });
                                                }} >
                                                {i18n.t("Accept")}
                                            </PopoverButton>
                                            <PopoverButton
                                                style={{ float: 'right' }}
                                                onClick={() => { this.setState({ show: false }); }}>
                                                {i18n.t("Cancel")}
                                            </PopoverButton>
                                        </Popover>
                                    </Overlay>
                                    <OverlayTrigger placement="top" container={this} overlay={
                                        <Tooltip id="deleteTooltip">{i18n.t('delete')}
                                        </Tooltip>}>
                                        <DeleteButton
                                            onClick={() => { this.setState({ show: idContainer }); }}
                                            ref={'btn-' + idContainer}
                                            className="material-icons delete-sortable btnOverBar">delete</DeleteButton>
                                    </OverlayTrigger>

                                </div>

                            </div>
                        </EditorBoxSortableContainer>);
                    })}
                </SortableContainerBox>

                <DnDZone data-html2canvas-ignore
                    onClick={e => {
                        this.h.onBoxSelected(-1);
                        e.stopPropagation();
                    }}>{i18n.t("messages.drag_content")}
                </DnDZone>

            </Container>
        );
    }

    componentDidMount() {
        this.configureDropZone(ReactDOM.findDOMNode(this), "newContainer", ".rib");
        let list = jQuery(this.refs.sortableContainer);
        list.sortable({
            handle: '.drag-handle',
            start: () => {
                // Hide EditorShortcuts
                let bar = this.props.containedViewSelected === 0 ?
                    document.getElementById('editorBoxIcons') :
                    document.getElementById('contained_editorBoxIcons');

                if (bar !== null) {
                    bar.classList.add('hidden');
                }
            },
            stop: () => {
                let indexes = [];
                let children = list[0].children;
                for (let i = 0; i < children.length; i++) {
                    indexes.push(children[i].getAttribute("data-id"));
                }
                if (indexes.length !== 0) {
                    this.h.onSortableContainerReordered(indexes, this.props.id);
                }
                list.sortable('cancel');
                // Unhide EditorShortcuts
                let bar = this.props.containedViewSelected === 0 ?
                    document.getElementById('editorBoxIcons') :
                    document.getElementById('contained_editorBoxIcons');
                if (bar !== null) {
                    bar.classList.remove('hidden');
                }
                let ev;
                ev = document.createEvent('Event');
                ev.initEvent('resize', true, true);
                window.dispatchEvent(ev);
            },
        });
    }

    configureResizable(item) {
        interact(item).resizable({
            enabled: this.props.id === this.props.boxSelected && item.style.height !== "auto",
            edges: { left: false, right: false, bottom: true, top: false },
            autoScroll: {
                container: document.getElementById('canvas'),
                margin: 50,
                distance: 0,
                interval: 0,
            },
            onmove: (event) => {
                event.target.style.height = event.rect.height + 'px';
            },
            onend: (event) => {
                this.h.onSortableContainerResized(event.target.getAttribute("data-id"), this.props.id, parseInt(event.target.style.height, 10));
            },
        });
    }

    configureDropZone(node, dropArea, selector, extraParams) {
        interact(node).dropzone({
            accept: selector,
            overlap: 'pointer',
            ondropactivate: function(e) {
                e.target.classList.add('drop-active');
            },
            ondragenter: function(e) {
                e.target.classList.add("drop-target");
            },
            ondragleave: function(e) {
                e.target.classList.remove("drop-target");
            },
            ondrop: function(e) {
                let draggingFromRibbon = e.relatedTarget.className.indexOf("rib") !== -1;
                let clone = document.getElementById('clone');
                if (clone) {
                    clone.parentNode.removeChild(clone);
                }
                let name = e.relatedTarget.getAttribute("name");
                let newInd = extraParams ? getNewIndex(e.dragEvent.clientX, e.dragEvent.clientY, this.props.id, extraParams.idContainer, extraParams.i, extraParams.j, this.props.boxesById) : 0;
                if (isSortableBox(this.props.id) && Ediphy.Plugins.get(e.relatedTarget.getAttribute("name")).getConfig().limitToOneInstance) {
                    if (draggingFromRibbon && instanceExists(e.relatedTarget.getAttribute("name"))) {
                        let alert = (<Alert className="pageModal"
                            show
                            hasHeader
                            backdrop={false}
                            title={<span><i className="material-icons alert-warning" >
                                warning</i>{i18n.t("messages.alert")}</span>}
                            closeButton onClose={() => { this.setState({ alert: null }); }}>
                            <span> {i18n.t('messages.instance_limit')} </span>
                        </Alert>);
                        this.setState({ alert: alert });

                        e.dragEvent.stopPropagation();
                        return;
                    }
                }
                let page = this.props.page;
                let initialParams = {};
                if (dropArea === 'existingContainer') {
                    initialParams = {
                        parent: this.props.id,
                        container: e.target.getAttribute("data-id"),
                        index: newInd,
                        page,

                    };
                } else if (dropArea === 'newContainer') {
                    initialParams = {
                        parent: this.props.id,
                        container: ID_PREFIX_SORTABLE_CONTAINER + Date.now(),
                        index: newInd,
                        page,
                    };
                }
                initialParams.id = (ID_PREFIX_BOX + Date.now());
                initialParams.name = name;
                createBox(initialParams, name, false, this.h.onBoxAdded, this.props.boxesById);
                e.dragEvent.stopPropagation();

            }.bind(this),

            ondropdeactivate: function(e) {
                e.target.classList.remove('drop-active');
                e.target.classList.remove("drop-target");
                e.preventDefault();
            },
        });
    }

    componentWillUnmount() {
        interact(ReactDOM.findDOMNode(this)).unset();
        interact(".editorBoxSortableContainer").unset();
    }
}

function mapStateToProps(state) {
    const { boxesById, boxSelected, boxLevelSelected, containedViewSelected } = state.undoGroup.present;
    return {
        boxesById,
        boxSelected,
        boxLevelSelected,
        containedViewSelected,
        markCreatorVisible: state.reactUI.markCreatorVisible,
    };
}

export default connect(mapStateToProps)(EditorBoxSortable);

EditorBoxSortable.propTypes = {
    /**
     * Box unique identifier
     */
    id: PropTypes.string.isRequired,
    /**
     * Object that holds all the boxes, (identified by its ID)
     */
    boxesById: PropTypes.object.isRequired,
    /**
     *  Box selected. If there is none selected the value is, -1
     */
    boxSelected: PropTypes.any.isRequired,
    /**
     * Selected contained view
     */
    containedViewSelected: PropTypes.any.isRequired,
    /**
     * Page type the box is at
     */
    pageType: PropTypes.string.isRequired,
    /**
     * Current page
     */
    page: PropTypes.any,
    /**
     * Object containing current theme colors
     */
    themeColors: PropTypes.object,
};
