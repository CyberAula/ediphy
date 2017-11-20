import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tooltip, Button, OverlayTrigger, Popover } from 'react-bootstrap';
import { ID_PREFIX_PAGE, ID_PREFIX_SECTION, ID_PREFIX_SORTABLE_BOX, PAGE_TYPES } from '../../../../common/constants';
import Section from './../section/Section';
import EditorIndexTitle from '../editor_index_title/EditorIndexTitle';
import { isPage, isSection, isSlide, isContainedView, calculateNewIdOrder } from '../../../../common/utils';
import i18n from 'i18next';
import Ediphy from '../../../../core/editor/main';
import './_carrouselList.scss';

/**
 * Ediphy CarrouselList Component
 * List of all the course's views and contained views
 */
export default class CarrouselList extends Component {
    /**
     * Constructor
     * @param props
     */
    constructor(props) {
        super(props);
        /**
         * Component's initial state
         * @type {{showSortableItems: boolean, showContainedViews: boolean}}
         */
        this.state = {
            showSortableItems: true,
            showContainedViews: true,
        };
    }

    /**
     * Calculates how much height is available for the view list, depending on the expanded sections
     * @returns {*}
     */
    getContentHeight() {
        if(!this.state.showSortableItems && !this.state.showContainedViews) {
            return("50px");
        } else if(this.state.showSortableItems && !this.state.showContainedViews) {
            return "calc(100% - 118px)";
        } else if(this.state.showSortableItems && this.state.showContainedViews) {
            return "calc(50%)";
        }
        return "calc(100% - 118px)";

    }

    /**
     * Renders React Component
     * @returns {code}
     */
    render() {
        let containedViewsIncluded = Object.keys(this.props.containedViews).length > 0;

        return (
            <div style={{ height: "100%" }}>
                <div style={{ height: "20px", backgroundColor: "black", marginBottom: "2px", paddingLeft: "10px", cursor: 'pointer' }} onClick={()=> {
                    this.setState({ showSortableItems: !this.state.showSortableItems });
                }}>
                    {(this.state.showSortableItems) ?
                        <i className="material-icons" style={{ color: "gray", fontSize: "22px" }}>{"arrow_drop_down" }</i> :
                        <i className="material-icons" style={{ color: "gray", fontSize: "15px", marginLeft: "2px", marginRight: "2px" }}>{"play_arrow" }</i>
                    }
                    <span style={{ color: "white", fontSize: "13px" }}>{i18n.t("COURSE")}</span>
                </div>
                <div ref="sortableList"
                    className="carList connectedSortables"
                    style={{ height: (this.state.showSortableItems) ? this.getContentHeight() : '0px', display: 'inherit' }}
                    onClick={e => {
                        this.props.onIndexSelected(this.props.id);
                        e.stopPropagation();
                    }}>
                    {this.props.navItems[this.props.id].children.map((id, index) => {
                        if (isSection(id)) {
                            return <Section id={id}
                                key={index}
                                indexSelected={this.props.indexSelected}
                                navItemsIds={this.props.navItemsIds}
                                navItems={this.props.navItems}
                                navItemSelected={this.props.navItemSelected}
                                onNavItemNameChanged={this.props.onNavItemNameChanged}
                                onNavItemAdded={this.props.onNavItemAdded}
                                onBoxAdded={this.props.onBoxAdded}
                                onIndexSelected={this.props.onIndexSelected}
                                onNavItemSelected={this.props.onNavItemSelected}
                                onNavItemExpanded={this.props.onNavItemExpanded}
                                onNavItemReordered={this.props.onNavItemReordered}/>;
                        } else if (isPage(id)) {
                            let classSelected = (this.props.navItemSelected === id) ? 'selected' : 'notSelected';
                            let classIndexSelected = this.props.indexSelected === id ? ' classIndexSelected' : '';
                            return <div key={index}
                                id={id}
                                className={'navItemBlock ' + classSelected + classIndexSelected}
                                onMouseDown={e => {
                                    this.props.onIndexSelected(id);
                                    e.stopPropagation();
                                }}
                                onClick={e => {
                                    this.props.onIndexSelected(id);
                                    e.stopPropagation();
                                }}
                                onDoubleClick={e => {
                                    this.props.onNavItemSelected(id);
                                    e.stopPropagation();
                                }}>
                                <span style={{ marginLeft: 20 * (this.props.navItems[id].level - 1) }}>
                                    <i className="material-icons fileIcon">
                                        {isSlide(this.props.navItems[id].type) ? "slideshow" : "insert_drive_file"}
                                    </i>
                                    <EditorIndexTitle
                                        id={id}
                                        title={this.props.navItems[id].name}
                                        index={this.props.navItems[this.props.navItems[id].parent].children.indexOf(id) + 1 + '.'}
                                        hidden={this.props.navItems[id].hidden}
                                        onNameChanged={this.props.onNavItemNameChanged}/>
                                </span>
                            </div>;
                        }
                        return null;
                    })}
                </div>

                <div style={{ height: "20px", backgroundColor: "black", marginBottom: "2px", paddingLeft: "10px", cursor: 'pointer' }} onClick={()=> {
                    this.setState({ showContainedViews: !this.state.showContainedViews });
                }}>
                    {(this.state.showContainedViews) ?
                        <i className="material-icons" style={{ color: "gray", fontSize: "22px" }}>{"arrow_drop_down" }</i> :
                        <i className="material-icons" style={{ color: "gray", fontSize: "15px", marginLeft: "2px", marginRight: "2px" }}>{"play_arrow" }</i>
                    }
                    <span style={{ color: "white", fontSize: "13px" }}>{i18n.t("CONTAINED_VIEWS")}</span>
                </div>

                <div className="containedViewsList" style={{ height: (this.state.showContainedViews) ? ((this.state.showSortableItems) ? "calc(50% - 122px)" : "calc(100% - 122px)") : "0px",
                    display: 'block', overflowY: 'auto', overflowX: 'hidden' }}>
                    <div className="empty-info" style={{ display: (containedViewsIncluded) ? "none" : "block" }}>{i18n.t("empty.cv_empty")}</div>

                    {
                        Object.keys(this.props.containedViews).map((id, key)=>{

                            return (<div key={id}
                                className={id === this.props.indexSelected ? 'navItemBlock classIndexSelected' : 'navItemBlock'}
                                style={{
                                    width: "100%",
                                    height: "20px",
                                    paddingTop: "10px",
                                    paddingLeft: "10px",
                                    paddingBottom: "25px",
                                    color: (this.props.containedViewSelected === id) ? "white" : "#9A9A9A",
                                    backgroundColor: (this.props.containedViewSelected === id) ? "#222" : "transparent",
                                }}
                                onDoubleClick={e => {
                                    this.props.onContainedViewSelected(id);
                                    e.stopPropagation();

                                }}
                                onClick={e => {
                                    this.props.onIndexSelected(id);
                                    e.stopPropagation();
                                }}>

                                <span className="" style={{ marginLeft: '10px' }}>

                                    <i style={{ marginRight: '10px' }} className="material-icons">{isSlide(this.props.containedViews[id].type) ? "slideshow" : "insert_drive_file"}</i>
                                    <EditorIndexTitle
                                        id={id}
                                        title={this.props.containedViews[id].name}
                                        index={1}
                                        hidden={false}
                                        onNameChanged={this.props.onContainedViewNameChanged} />
                                </span>
                            </div>);
                        })
                    }

                </div>
                <div className="bottomGroup">
                    <div className="bottomLine" />
                    <OverlayTrigger placement="top" overlay={(<Tooltip id="newFolderTooltip">{i18n.t('create new folder')}</Tooltip>)}>
                        <Button className="carrouselButton"
                            disabled={ isContainedView(this.props.indexSelected) || this.props.navItems[this.props.indexSelected].level >= 10}
                            onClick={e => {

                                let idnuevo = ID_PREFIX_SECTION + Date.now();
                                this.props.onNavItemAdded(
                                    idnuevo,
                                    i18n.t("section"),
                                    this.getParent().id,
                                    PAGE_TYPES.SECTION,
                                    this.calculatePosition()
                                );
                                if(Ediphy.Config.sections_have_content) {
                                    this.props.onBoxAdded({
                                        parent: idnuevo,
                                        container: 0,
                                        id: ID_PREFIX_SORTABLE_BOX + Date.now() },
                                    false,
                                    false
                                    );
                                }

                                e.stopPropagation();

                            }}><i className="material-icons">create_new_folder</i>
                        </Button>
                    </OverlayTrigger>

                    <OverlayTrigger placement="top" overlay={
                        <Tooltip id="newDocumentTooltip">{i18n.t('create new document')}
                        </Tooltip>}>
                        <Button className="carrouselButton"
                            disabled={isContainedView(this.props.indexSelected)}
                            onClick={e =>{
                                let newId = ID_PREFIX_PAGE + Date.now();
                                this.props.onNavItemAdded(
                                    newId,
                                    i18n.t("page"),
                                    this.getParent().id,
                                    PAGE_TYPES.DOCUMENT,
                                    this.calculatePosition()
                                );
                                this.props.onBoxAdded(
                                    { parent: newId, container: 0, id: ID_PREFIX_SORTABLE_BOX + Date.now() },
                                    false,
                                    false
                                );
                            }}><i className="material-icons">insert_drive_file</i></Button>
                    </OverlayTrigger>

                    <OverlayTrigger placement="top" overlay={
                        <Tooltip id="newSlideTooltip">{i18n.t('create new slide')}
                        </Tooltip>}>
                        <Button className="carrouselButton"
                            disabled={isContainedView(this.props.indexSelected)}
                            onClick={e => {
                                let newId = ID_PREFIX_PAGE + Date.now();
                                this.props.onNavItemAdded(
                                    newId,
                                    i18n.t("slide"),
                                    this.getParent().id,
                                    PAGE_TYPES.SLIDE,
                                    this.calculatePosition()
                                );
                                this.props.onIndexSelected(newId);
                            }}><i className="material-icons">slideshow</i>
                        </Button>
                    </OverlayTrigger>
                    {/*
                     <OverlayTrigger placement="top" overlay={
                     <Tooltip  id="hideNavItemTooltip">{i18n.t('display')}
                     </Tooltip>}>
                     <Button className="carrouselButton">
                     <i className="material-icons"
                     onClick={e => {
                     this.props.onNavItemToggled(this.props.navItemSelected);
                     }}>{this.props.navItems[this.props.navItemSelected].hidden ? "visibility_off" : "visibility"}</i>
                     </Button>
                     </OverlayTrigger>
                     */}
                    <OverlayTrigger trigger={["focus"]} placement="top" overlay={
                        <Popover id="popov" title={
                            isSection(this.props.indexSelected) ? i18n.t("delete_section") :
                                isContainedView(this.props.indexSelected) ? i18n.t('delete_contained_canvas') :
                                    i18n.t("delete_page")}>
                            <i style={{ color: 'yellow', fontSize: '13px', padding: '0 5px' }} className="material-icons">warning</i>
                            {isSection(this.props.indexSelected) ? i18n.t("messages.delete_section") :
                                (isContainedView(this.props.indexSelected) && !this.canDeleteContainedView(this.props.indexSelected)) ? i18n.t("messages.delete_busy_cv") : i18n.t("messages.delete_page")}
                            <br/>
                            <br/>
                            <Button className="popoverButton"
                                disabled={this.props.indexSelected === 0}
                                style={{ float: 'right' }} >
                                {i18n.t("Cancel")}
                            </Button>
                            <Button className="popoverButton"
                                disabled={/* (isContainedView(this.props.indexSelected) && !this.canDeleteContainedView(this.props.indexSelected)) || */this.props.indexSelected === 0}
                                style={{ float: 'right' }}
                                onClick={(e) =>
                                {
                                    if(this.props.indexSelected !== 0) {
                                        if (isContainedView(this.props.indexSelected) /* && this.canDeleteContainedView(this.props.indexSelected)*/) {
                                            this.props.onContainedViewDeleted(this.props.indexSelected);
                                        } else {
                                            this.props.onNavItemDeleted(this.props.indexSelected);
                                        }
                                    }

                                    this.props.onIndexSelected(0);
                                }
                                }>
                                {i18n.t("Accept")}
                            </Button>

                        </Popover>}>
                        <OverlayTrigger placement="top" overlay={
                            <Tooltip id="deleteTooltip">{i18n.t('delete')}
                            </Tooltip>}>
                            <Button className="carrouselButton"
                                disabled={this.props.indexSelected === 0}
                                style={{ float: 'right' }}>
                                <i className="material-icons">delete</i>
                            </Button>
                        </OverlayTrigger>
                    </OverlayTrigger>
                </div>
            </div>
        );
    }

    /**
     * Checks if contained view leaves orphan marks
     * @param id Contained view id
     * @returns {*}
     */
    canDeleteContainedView(id) {
        if (id !== 0 && isContainedView(id)) {
            let thisPage = this.props.containedViews[id];
            let boxes = this.props.boxes;
            let parent = thisPage.parent;
            let boxDoesntExistAnyMore = parent && !boxes[parent];
            let deletedMark = parent && boxes[parent] && boxes[parent].containedViews && boxes[parent].containedViews.indexOf(id) === -1;
            return boxDoesntExistAnyMore || deletedMark;

        }

        return false;
    }

    /** *
     * Get navItem's parent
     * @returns {*}
     */
    getParent() {
        // If the selected navItem is not a section, it cannot have children -> we return it's parent
        if (isSection(this.props.indexSelected)) {
            return this.props.navItems[this.props.indexSelected];
        }
        return this.props.navItems[this.props.navItems[this.props.indexSelected].parent] || this.props.navItems[0];
    }

    /**
     * Calculate navItem's position on index
     * @returns {*}
     */
    calculatePosition() {
        let parent = this.getParent();
        let ids = this.props.navItemsIds;
        // If we are at top level, the new navItem it's always going to be in last position
        if(parent.id === 0) {
            return ids.length;
        }

        // Starting after item's parent, if level is the same or lower -> we found the place we want
        for(let i = ids.indexOf(parent.id) + 1; i < ids.length; i++) {
            if(ids[i]) {
                if(this.props.navItems[ids[i]].level <= parent.level) {
                    return i;
                }
            }
        }

        // If we arrive here it means we were adding a new child to the last navItem
        return ids.length;
    }

    /**
     * After component mounts
     * Sets up jQuery sortable features on the index
     */
    componentDidMount() {
        let list = jQuery(this.refs.sortableList);
        let props = this.props;
        list.sortable({
            connectWith: '.connectedSortables',
            containment: '.carList',
            appendTo: '.carList',
            helper: 'clone',
            scroll: true,
            over: (event, ui) => {
                $(".carList").css("border-left", "3px solid #F47920");
            },
            out: (event, ui) => {
                $(".carList").css("border-left", "none");
            },
            stop: (event, ui) => {
                // This is called when:
                // - An item is dragged from this items's children to another item
                // - A direct child changes it position at the same level
                let newChildren = list.sortable('toArray', { attribute: 'id' });

                // If item moved is still in this element's children (wasn't moved away) -> update
                if (newChildren.indexOf(this.props.navItemSelected) !== -1) {

                    // This is necessary in order to avoid that JQuery touches the DOM
                    // It has to be BEFORE action is dispatched and React tries to repaint
                    list.sortable('cancel');

                    this.props.onNavItemReordered(
                        this.props.indexSelected, // item moved
                        this.props.id, // new parent
                        this.props.navItems[this.props.indexSelected].parent, // old parent
                        calculateNewIdOrder(this.props.navItemsIds, newChildren, this.props.id, this.props.indexSelected, this.props.navItems),
                        newChildren
                    );
                }
            },
            receive: (event, ui) => {
                // This is called when an item is dragged from another item's children to this element's children
                let newChildren = list.sortable('toArray', { attribute: 'id' });

                // If action is done very quickly, jQuery may not notice the update and not detect that a new child was dragged
                if(newChildren.indexOf(this.props.indexSelected) === -1) {
                    newChildren.push(this.props.indexSelected);
                }

                // This is necessary in order to avoid that JQuery touches the DOM
                // It has to be BEFORE action is dispatched and React tries to repaint
                $(ui.sender).sortable('cancel');

                this.props.onNavItemReordered(
                    this.props.indexSelected, // item moved
                    this.props.id, // new parent
                    this.props.navItems[this.props.indexSelected].parent, // old parent
                    calculateNewIdOrder(this.props.navItemsIds, newChildren, this.props.id, this.props.indexSelected, this.props.navItems),
                    newChildren
                );
            },
        });
    }

    /**
     * Before the component unmounts
     * Unset jQuery sortable features
     */
    componentWillUnmount() {
        jQuery(this.refs.sortableList).sortable("destroy");
    }
}

CarrouselList.propTypes = {
    /**
     * Diccionario que contiene todas las vistas contenidas, accesibles por su *id*
     */
    containedViews: PropTypes.object.isRequired,

    /**
     * Vista contenida seleccionada, identificada por su *id*
     */
    containedViewSelected: PropTypes.any,

    /**
     * Diccionario que contiene todas las cajas creadas, accesibles por su *id*
     */
    boxes: PropTypes.object.isRequired,

    /**
     * Array que contiene todas las vistas creadas, identificadas por su *id*
     */
    navItemsIds: PropTypes.array.isRequired,

    /**
     * Diccionario que contiene todas las vistas creadas, accesibles por su *id*
     */
    navItems: PropTypes.object.isRequired,

    /**
     * Vista seleccionada, identificada por su *id*
     */
    navItemSelected: PropTypes.any,

    /**
     * Vista/vista contenida seleccionada en el índice
     */
    indexSelected: PropTypes.any,

    /**
     * Añade caja
     */
    onBoxAdded: PropTypes.func.isRequired,

    /**
     * Borra vista contenida
     */
    onContainedViewDeleted: PropTypes.func.isRequired,

    /**
     * Selecciona vista contenida
     */
    onContainedViewSelected: PropTypes.func.isRequired,

    /**
     * Renombre vista contenida
     */
    onContainedViewNameChanged: PropTypes.func.isRequired,

    /**
     * Renombra vista
     */
    onNavItemNameChanged: PropTypes.func.isRequired,

    /**
     * Añade vista
     */
    onNavItemAdded: PropTypes.func.isRequired,

    /**
     * Selecciona vista
     */
    onNavItemSelected: PropTypes.func.isRequired,

    /**
     * Selecciona vista/vista contenida en el contexto del índice
     */
    onIndexSelected: PropTypes.func.isRequired,

    /**
     * Expande sección
     */
    onNavItemExpanded: PropTypes.func.isRequired,

    /**
     * Elimina vista/vista contenida
     */
    onNavItemDeleted: PropTypes.func.isRequired,
    /**
     * Reordena elementos del índice
     */
    onNavItemReordered: PropTypes.func.isRequired,

};
