import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Section from './../section/Section';
import EditorIndexTitle from '../editor_index_title/EditorIndexTitle';
import { isPage, isSection, isSlide, calculateNewIdOrder } from '../../../../common/utils';
import i18n from 'i18next';
import './_carouselList.scss';
import iconPDF from './../../../../dist/images/file-pdf.svg';

/**
 * Ediphy CarouselList Component
 * List of all the course's views and contained views
 */
export default class CarouselList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showSortableItems: true,
            showContainedViews: true,
        };
    }

    getContentHeight() {
        if(!this.state.showSortableItems && !this.state.showContainedViews) {
            return("50px");
        } else if(this.state.showSortableItems && !this.state.showContainedViews) {
            return "calc(100% - 124px)";
        } else if(this.state.showSortableItems && this.state.showContainedViews) {
            return "calc(50%)";
        }
        return "calc(100% - 124px)";

    }

    render() {

        let containedViewsIncluded = Object.keys(this.props.containedViews).length > 0;

        if (!this.props.carouselShow) { return (<div style={{ height: "100%" }}><br /></div>); }

        return (
            <div id='hello' className={"testttt"} style={{ height: '100%' }}>
                <div id="sortablesCollapse" style={{ height: "20px", backgroundColor: "black", marginBottom: "2px", paddingLeft: "10px", cursor: 'pointer' }} onClick={()=> {
                    this.setState({ showSortableItems: !this.state.showSortableItems });
                }}>
                    {(this.state.showSortableItems) ?
                        <i className="material-icons" style={{ color: "gray", fontSize: "22px" }}>{"arrow_drop_down" }</i> :
                        <i className="material-icons" style={{ color: "gray", fontSize: "15px", marginLeft: "2px", marginRight: "2px" }}>{"play_arrow" }</i>
                    }
                    <span style={{ color: "white", fontSize: "11px" }}>{i18n.t("INDEX")}</span>
                </div>
                <div ref="sortableList"
                    className="carList connectedSortables"
                    style={{ height: (this.state.showSortableItems) ? this.getContentHeight() : '0px', display: 'inherit' }}
                    onClick={e => {
                        this.props.onIndexSelected(this.props.id);
                        e.stopPropagation();
                    }}>
                    {this.props.navItems && this.props.navItems.hasOwnProperty(this.props.id) && this.props.navItems[this.props.id].children.map(id => {
                        if (isSection(id)) {
                            return (
                                <Section id={id}
                                    key={id}
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
                                    viewToolbars={this.props.viewToolbars}
                                    onNavItemReordered={this.props.onNavItemReordered} />
                            );
                        } else if (isPage(id)) {
                            let classSelected = (this.props.navItemSelected === id) ? 'selected' : 'notSelected';
                            let classIndexSelected = this.props.indexSelected === id ? ' classIndexSelected' : '';
                            let widthScroll = Math.max(this.props.viewToolbars[id].viewName.length / 11 * 100, 100);
                            return (
                                <div key={id}
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
                                        {(this.props.navItems[id].customSize === 0) ?
                                            <i className="material-icons fileIcon">{isSlide(this.props.navItems[id].type) ? "slideshow" : "insert_drive_file"}</i>
                                            : <img className="svgIcon" src={iconPDF}/>}
                                        <EditorIndexTitle
                                            id={id}
                                            scrollW={widthScroll}
                                            title={this.props.viewToolbars[id].viewName}
                                            index={this.props.navItems[this.props.navItems[id].parent].children.indexOf(id) + 1 + '.'}
                                            hidden={this.props.navItems[id].hidden}
                                            onNameChanged={this.props.onNavItemNameChanged}/>
                                    </span>
                                </div>
                            );
                        }
                        return null;
                    })}
                </div>

                <div id="scontainedViewsCollapse" style={{ height: "20px", backgroundColor: "black", marginBottom: "2px", paddingLeft: "10px", cursor: 'pointer' }} onClick={()=> {
                    this.setState({ showContainedViews: !this.state.showContainedViews });
                }}>
                    {(this.state.showContainedViews) ?
                        <i className="material-icons" style={{ color: "gray", fontSize: "22px" }}>{"arrow_drop_down" }</i> :
                        <i className="material-icons" style={{ color: "gray", fontSize: "15px", marginLeft: "2px", marginRight: "2px" }}>{"play_arrow" }</i>
                    }
                    <span style={{ color: "white", fontSize: "11px" }}>{i18n.t("CONTAINED_VIEWS")}</span>
                </div>

                <div className="containedViewsList" style={{ height: (this.state.showContainedViews) ? ((this.state.showSortableItems) ? "calc(50% - 126px)" : "calc(100% - 126px)") : "0px",
                    display: 'block', overflowY: 'auto', overflowX: 'hidden' }}>
                    <div className="empty-info" style={{ display: (containedViewsIncluded) ? "none" : "block" }}>{i18n.t("empty.cv_empty")}</div>

                    {
                        Object.keys(this.props.containedViews).map((id, key)=>{
                            let classIndexSelected = id === this.props.indexSelected ? ' classIndexSelected ' : ' ';
                            let containedViewSelected = id === this.props.containedViewSelected ? ' selected ' : ' notSelected ';
                            return (
                                <div key={id}
                                    className={'navItemBlock' + classIndexSelected + containedViewSelected}
                                    style={{
                                        width: "100%",
                                        height: "20px",
                                        paddingTop: "10px",
                                        paddingLeft: "10px",
                                        paddingBottom: "25px",
                                        color: (this.props.indexSelected === id && this.props.containedViewSelected === id) ? "white" : "#9A9A9A",
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
                                            title={this.props.viewToolbars[id].viewName}
                                            index={1}
                                            hidden={false}
                                            onNameChanged={this.props.onContainedViewNameChanged} />
                                    </span>
                                </div>
                            );
                        })
                    }

                </div>
            </div>
        );
    }
    /**
     * After component mounts
     * Sets up jQuery sortable features on the index
     */
    componentDidMount() {
        let list = jQuery(this.refs.sortableList);
        list.sortable({
            connectWith: '.connectedSortables',
            containment: '.carList',
            appendTo: '.carList',
            // helper: 'clone',
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
                //
                // console.log(newChildren);
                // console.log(this.props.indexSelected, // item moved
                //     this.props.id, // new parent
                //     this.props.navItems[this.props.indexSelected].parent, // old parent
                //     calculateNewIdOrder(this.props.navItemsIds, newChildren, this.props.id, this.props.indexSelected, this.props.navItems),
                //     newChildren);

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

    componentWillUnmount() {
        jQuery(this.refs.sortableList).sortable("destroy");
    }
}

CarouselList.propTypes = {
    /**
     * Global parent of navItems (0)
     */
    id: PropTypes.number.isRequired,
    /**
     * Indicates whether the carousel has been expanded or not
     */
    carouselShow: PropTypes.bool,
    /**
     *  Object containing all contained views (identified by its ID)
     */
    containedViews: PropTypes.object.isRequired,
    /**
     * Selected contained view
     */
    containedViewSelected: PropTypes.any,
    /**
     * View/Contained view selected at the index
     */
    indexSelected: PropTypes.any,
    /**
     * Dictionary containing all created views, each one with its *id* as the key
     */
    navItems: PropTypes.object.isRequired,
    /**
     * Current selected view (by ID)
     */
    navItemSelected: PropTypes.any,
    /**
     *  View/Contained view selected at the index
     */
    navItemsIds: PropTypes.array.isRequired,
    /**
     * Callback for adding a new box
     */
    onBoxAdded: PropTypes.func.isRequired,
    /**
     * Callback for selecting contained view
     */
    onContainedViewNameChanged: PropTypes.func.isRequired,
    /**
     * Callback for renaming contained view
     */
    onContainedViewSelected: PropTypes.func.isRequired,
    /**
     * Callback for renaming view
     */
    onIndexSelected: PropTypes.func.isRequired,
    /**
     * Adds a new view
     */
    onNavItemAdded: PropTypes.func.isRequired,
    /**
     * Expands navItem (only for sections)
     */
    onNavItemExpanded: PropTypes.func.isRequired,
    /**
     * Callback for renaming view
     */
    onNavItemNameChanged: PropTypes.func.isRequired,
    /**
     * Callback for reordering navItems
     */
    onNavItemReordered: PropTypes.func.isRequired,
    /**
     * Selects a view
     */
    onNavItemSelected: PropTypes.func.isRequired,
    /**
     * Object containing all the pages' toolbars
     */
    viewToolbars: PropTypes.object.isRequired,
};
