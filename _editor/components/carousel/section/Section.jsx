import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EditorIndexTitle from '../editorIndexTitle/EditorIndexTitle';
import { isPage, isSection, isSlide, calculateNewIdOrder } from '../../../../common/utils';
import Ediphy from '../../../../core/editor/main';
import iconPDF from './../../../../dist/images/file-pdf.svg';

/**
 * Section element in index
 */
export default class Section extends Component {
    /**
     * Render React Component
     * @returns {code}
     */
    render() {

        let navItem = this.props.navItems[this.props.id];
        let classSelected = this.props.navItemSelected === navItem.id ? 'selected' : 'notSelected';
        let classIndexSelected = this.props.indexSelected === navItem.id ? ' classIndexSelected' : '';
        return (
            <div id={this.props.id}
                onMouseDown={e => {
                    this.props.onIndexSelected(navItem.id);
                    e.stopPropagation();
                }}
                onClick={e => {

                    this.props.onNavItemExpanded(navItem.id, !navItem.isExpanded);
                    this.props.onIndexSelected(navItem.id);
                    e.stopPropagation();
                }}
                onDoubleClick={e => {
                    if (Ediphy.Config.sections_have_content) {
                        this.props.onNavItemSelected(navItem.id);
                        this.props.onNavItemExpanded(navItem.id, !navItem.isExpanded);
                    }
                    this.props.onIndexSelected(navItem.id);
                    e.stopPropagation();

                }}>
                <div className={"navItemBlock " + classSelected + classIndexSelected}>
                    <span style={{ marginLeft: 20 * (this.props.navItems[this.props.id].level - 1) }}>
                        <button className="expandir"
                            onClick={e => {
                                this.props.onNavItemExpanded(navItem.id, !navItem.isExpanded);
                                this.props.onIndexSelected(navItem.id);
                                e.stopPropagation();
                            }}>
                            <i onClick={e => {
                                this.props.onIndexSelected(navItem.id); // Confirmar
                                this.props.onNavItemExpanded(navItem.id, !navItem.isExpanded);
                                e.stopPropagation();
                            }}
                            className={classSelected + '  material-icons'}>
                                {navItem.isExpanded ? "keyboard_arrow_down" : "keyboard_arrow_right"}
                            </i>
                        </button>
                        <span className={classSelected + classIndexSelected} style={{ display: 'inline' }}>
                            <EditorIndexTitle id={this.props.id}
                                title={this.props.viewToolbars[this.props.id].viewName}
                                index={navItem.level === 1 ?
                                    navItem.unitNumber + ". " :
                                    this.props.navItems[navItem.parent].children.indexOf(this.props.id) + 1 + '. '}
                                hidden={navItem.hidden}
                                onNameChanged={this.props.onNavItemNameChanged}/>
                        </span>
                    </span>
                </div>
                <div ref="sortableList"
                    style={{
                        paddingTop: 0,
                        display: (navItem.isExpanded ? 'block' : 'none'),
                    }}
                    className="sectionList connectedSortables">
                    {navItem.children.map(id => {
                        if (isSection(id)) {
                            return <Section id={id}
                                key={id}
                                indexSelected={this.props.indexSelected}
                                navItemsIds={this.props.navItemsIds}
                                navItems={this.props.navItems}
                                navItemSelected={this.props.navItemSelected}
                                onBoxAdded={this.props.onBoxAdded}
                                onIndexSelected={this.props.onIndexSelected}
                                onNavItemAdded={this.props.onNavItemAdded}
                                onNavItemNameChanged={this.props.onNavItemNameChanged}
                                onNavItemSelected={this.props.onNavItemSelected}
                                onNavItemExpanded={this.props.onNavItemExpanded}
                                onNavItemReordered={this.props.onNavItemReordered}
                                viewToolbars={this.props.viewToolbars}
                            />;
                        } else if (isPage(id)) {
                            let classSelectedD = this.props.navItemSelected === id ? 'selected dragS' : 'notSelected dragS';
                            let classIndexSelectedD = this.props.indexSelected === id ? ' classIndexSelected' : '';
                            return (
                                <div key={id}
                                    id={id}
                                    className={'navItemBlock ' + classSelectedD + classIndexSelectedD}
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
                                        <EditorIndexTitle id={id}
                                            index={this.props.navItems[this.props.navItems[id].parent].children.indexOf(id) + 1 + '.'}
                                            title={this.props.viewToolbars[id].viewName}
                                            hidden={this.props.navItems[id].hidden}
                                            onNameChanged={this.props.onNavItemNameChanged} />
                                    </span>
                                </div>
                            );
                        }
                        return null;
                    })}
                </div>
            </div>
        );
    }

    /**
     * After component mounts
     * Set sortable functions
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
                $(".carList").css("border-left", "none");
                $(".sectionList").removeClass("dragIntoHelper");
                $(event.target).addClass("dragIntoHelper");
            },
            out: (event, ui) => {
                $(".carList").css("border-left", "none");
                $(".sectionList").removeClass("dragIntoHelper");
            },
            stop: (event, ui) => {
                // This is called when:
                // - An item is dragged from this items's children to another item
                // - A direct child changes it position at the same level

                // If this item was dragged to another item, its sortable instance has been destroyed already
                if(!list.sortable('instance')) {
                    return;
                }
                let newChildren = list.sortable('toArray', { attribute: 'id' });

                // If item moved is still in this element's children (wasn't moved away) -> update
                if (newChildren.indexOf(this.props.indexSelected) !== -1) {

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
     * Before component unmounts
     * Unset sortable functions
     */
    componentWillUnmount() {
        jQuery(this.refs.sortableList).sortable("destroy");
    }
}

Section.propTypes = {
    /**
     * Unique Section identifier
     */
    id: PropTypes.string.isRequired,
    /**
     * View/Contained view selected at the index
     */
    indexSelected: PropTypes.any.isRequired,
    /**
     * Objects Array that contains all created views (identified by its *id*)
     */
    navItemsIds: PropTypes.array.isRequired,
    /**
     * Object containing all views (by id)
     */
    navItems: PropTypes.object.isRequired,
    /**
     * Current selected view (by ID)
     */
    navItemSelected: PropTypes.any,
    /**
     * Callback for renaming view
     */
    onNavItemNameChanged: PropTypes.func.isRequired,
    /**
     * Function for adding a new view
     */
    onNavItemAdded: PropTypes.func.isRequired,
    /**
     * Callback for adding a box
     */
    onBoxAdded: PropTypes.func.isRequired,
    /**
     * Selects a view/contained view in the index's context
     */
    onIndexSelected: PropTypes.func.isRequired,
    /**
     * Selects view
     */
    onNavItemSelected: PropTypes.func.isRequired,
    /**
     * Expands navItem (only for sections)
     */
    onNavItemExpanded: PropTypes.func.isRequired,
    /**
     * Callback for reordering navItems
     */
    onNavItemReordered: PropTypes.func.isRequired,
    /**
     * Object containing all the pages' toolbars
     */
    viewToolbars: PropTypes.object,
};
