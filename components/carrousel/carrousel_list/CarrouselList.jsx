import React, {Component} from 'react';
import {Button, ButtonGroup, Col, OverlayTrigger, Popover} from 'react-bootstrap';

import {ID_PREFIX_PAGE, ID_PREFIX_SECTION, ID_PREFIX_SORTABLE_BOX, PAGE_TYPES} from './../../../constants';
import Section from './../section/Section';
import PageMenu from './../page_menu/PageMenu';
import DaliIndexTitle from './../dali_index_title/DaliIndexTitle';
import {isPage, isSection, isSlide, calculateNewIdOrder} from './../../../utils';
import i18n from 'i18next';
import Dali from './../../../core/main';

require('./_carrouselList.scss');

export default class CarrouselList extends Component {
    render() {
        return (
            /* jshint ignore:start */
            <div style={{height: 'calc(100% - 25px)'}}>
                <div ref="sortableList"
                     className="carList connectedSortables"
                     style={{paddingTop: 5}}
                     onClick={e => {
                        this.props.onNavItemSelected(this.props.id);
                        e.stopPropagation();
                     }}>
                    {this.props.navItems[this.props.id].children.map((id, index) => {
                        if (isSection(id)) {
                            return <Section id={id}
                                            key={index}
                                            navItemsIds={this.props.navItemsIds}
                                            navItems={this.props.navItems}
                                            navItemSelected={this.props.navItemSelected}
                                            onTitleChange={this.props.onTitleChange}
                                            onNavItemAdded={this.props.onNavItemAdded}
                                            onBoxAdded={this.props.onBoxAdded}
                                            onNavItemSelected={this.props.onNavItemSelected}
                                            onNavItemExpanded={this.props.onNavItemExpanded}
                                            onNavItemReordered={this.props.onNavItemReordered}
                                            onNavItemToggled={this.props.onNavItemToggled}/>
                        } else if (isPage(id)) {
                            let classSelected = (this.props.navItemSelected === id) ? 'selected' : 'notSelected';
                            return <h4 key={index}
                                       id={id}
                                       className={'navItemBlock ' + classSelected}
                                       onMouseDown={e => {
                                            this.props.onNavItemSelected(id);
                                            e.stopPropagation();
                                       }}
                                       onClick={e => {
                                            this.props.onNavItemSelected(id);
                                            e.stopPropagation();
                                       }}>
                                    <span style={{marginLeft: 20 * (this.props.navItems[id].level-1)}}>
                                        <i className="material-icons fileIcon">
                                            {isSlide(this.props.navItems[id].type) ? "slideshow" : "insert_drive_file"}
                                        </i>
                                    <DaliIndexTitle
                                        id={id}
                                        title={this.props.navItems[id].name}
                                        index={this.props.navItems[this.props.navItems[id].parent].children.indexOf(id) + 1 + '.'}
                                        hidden={this.props.navItems[id].hidden}
                                        onTitleChange={this.props.onTitleChange}
                                        onNavItemToggled={this.props.onNavItemToggled}/></span>
                            </h4>
                        }
                    })}
                </div>
                <div className="bottomLine"></div>
                <div className="bottomGroup">
                    <div>
                        <Button className="carrouselButton"
                                disabled={!isSection(this.props.navItemSelected) && this.props.navItemSelected !== 0}
                                onClick={e => {
                                let idnuevo = ID_PREFIX_SECTION + Date.now();
                                this.props.onNavItemAdded(
                                    idnuevo,
                                    i18n.t("section"),
                                    this.getParent().id,
                                    "",
                                    this.calculatePosition()
                                );
                                if(Dali.Config.sections_have_content){
                                    this.props.onBoxAdded({
                                        parent: idnuevo,
                                        container: 0,
                                        id: ID_PREFIX_SORTABLE_BOX + Date.now()},
                                        false,
                                        false
                                    );
                                }
                                e.stopPropagation();
                            }}>
                            <i className="material-icons">create_new_folder</i>
                        </Button>

                    <Button className="carrouselButton"
                            onClick={e =>{
                               var newId = ID_PREFIX_PAGE + Date.now();
                               this.props.onNavItemAdded(
                                    newId,
                                    i18n.t("page"),
                                    this.getParent().id,
                                    PAGE_TYPES.DOCUMENT,
                                    this.calculatePosition()
                                );
                                this.props.onBoxAdded(
                                    {parent: newId, container: 0, id: ID_PREFIX_SORTABLE_BOX + Date.now()},
                                    false,
                                    false
                                );
                            }}><i className="material-icons">insert_drive_file</i></Button>

                    <Button className="carrouselButton"
                            onClick={e => {
                                this.props.onNavItemAdded(
                                    ID_PREFIX_PAGE + Date.now(),
                                    i18n.t("slide"),
                                    this.getParent().id,
                                    PAGE_TYPES.SLIDE,
                                    this.calculatePosition()
                                );
                            }}><i className="material-icons">slideshow</i></Button>

                    <Button className="carrouselButton">
                    <i className="material-icons"
                       onClick={e => {
                            this.props.onNavItemToggled(this.props.navItemSelected);
                       }}>{this.props.navItems[this.props.navItemSelected].hidden ? "visibility_off" : "visibility"}</i></Button>

                    <OverlayTrigger trigger={["focus"]} placement="top" overlay={
                        <Popover id="popov" title={isSection(this.props.navItemSelected) ? i18n.t("delete_section") : i18n.t("delete_page")}>
                            <i style={{color: 'yellow', fontSize: '13px'}} className="material-icons">warning</i>
                            {isSection(this.props.navItemSelected) ?
                                i18n.t("messages.delete_section") :
                                i18n.t("messages.delete_page")
                            }
                            <br/>
                            <Button className="popoverButton"
                                    disabled={this.props.navItemSelected === 0}
                                    style={{float: 'right'}}
                                    onClick={(e) => this.props.onNavItemRemoved()}>
                                {i18n.t("Accept")}
                            </Button>
                            <Button className="popoverButton"
                                    disabled={this.props.navItemSelected === 0}
                                    style={{float: 'right'}}  >
                                {i18n.t("Cancel")}
                            </Button>
                         </Popover>}>
                            <Button className="carrouselButton"
                                    disabled={this.props.navItemSelected === 0}
                                    style={{float: 'right'}}>
                                <i className="material-icons">delete</i>
                            </Button>
                        </OverlayTrigger>
                    </div>
                </div>
            </div>
            /* jshint ignore:end */
        );
    }

    getParent() {
        // If the selected navItem is not a section, it cannot have children -> we return it's parent
        if (isSection(this.props.navItemSelected)) {
            return this.props.navItems[this.props.navItemSelected];
        }
        return this.props.navItems[this.props.navItems[this.props.navItemSelected].parent] || this.props.navItems[0];
    }

    calculatePosition() {
        let parent = this.getParent();
        let ids = this.props.navItemsIds;
        // If we are at top level, the new navItem it's always going to be in last position
        if(parent.id === 0){
            return ids.length;
        }

        // Starting after item's parent, if level is the same or lower -> we found the place we want
        for(let i = ids.indexOf(parent.id) + 1; i < ids.length; i++){
            if(ids[i]){
                if(this.props.navItems[ids[i]].level <= parent.level){
                    return i;
                }
            }
        }

        // If we arrive here it means we were adding a new child to the last navItem
        return ids.length;
    }


    findDescendantNavItems(state, element) {
        let family = [element];
        state[element].children.forEach(child => {
            family = family.concat(this.findDescendantNavItems(state, child));
        });
        return family;
    }

    calculateNewIdOrder(oldArray, newChildren, itemMoved) {
        let itemsToChange = this.findDescendantNavItems(this.props.navItems, itemMoved);
        let oldArrayFiltered = oldArray.filter(id => itemsToChange.indexOf(id) === -1);

        // This is the index where we split the array to add the items we're moving
        // We calculate the position of the next child item after itemMoved
        let splitIndex = oldArrayFiltered.indexOf(newChildren[newChildren.indexOf(itemMoved) + 1]);
        let newArray;
        // This means that itemMoved went to last position
        if (splitIndex === -1) {
            newArray = oldArrayFiltered.concat(itemsToChange);
        } else {
            newArray = oldArrayFiltered.slice(0, splitIndex);
            newArray = newArray.concat(itemsToChange);
            newArray = newArray.concat(oldArrayFiltered.slice(splitIndex));
        }
        return newArray;
    }

    componentDidMount() {
        let list = jQuery(this.refs.sortableList);
        let props = this.props;
        list.sortable({
            connectWith: '.connectedSortables',
            containment: '.carList',
            scroll: true,
            over: (event, ui) => {
                $(event.target).css("border-left", "3px solid #F47920");
            },
            out: (event, ui) => {
                $(event.target).css("border-left", "none");
            },
            start: (event, ui) => {
                $("#" + this.props.navItemSelected).css("opacity", "0.5");
            },
            stop: (event, ui) => {
                // This is called when:
                // - An item is dragged from this items's children to another item
                // - A direct child changes it position at the same level
                let newChildren = list.sortable('toArray', {attribute: 'id'});

                // If item moved is still in this element's children (wasn't moved away) -> update
                if (newChildren.indexOf(this.props.navItemSelected) !== -1) {

                    // This is necessary in order to avoid that JQuery touches the DOM
                    // It has to be BEFORE action is dispatched and React tries to repaint
                    list.sortable('cancel');

                    this.props.onNavItemReordered(
                        this.props.navItemSelected, // item moved
                        this.props.id, // new parent
                        this.props.navItems[this.props.navItemSelected].parent, // old parent
                        calculateNewIdOrder(this.props.navItemsIds, newChildren, this.props.id, this.props.navItemSelected, this.props.navItems),
                        newChildren
                    );
                }

                // Restore opacity of moving item
                $("#" + this.props.navItemSelected).css("opacity", "1");
            },
            receive: (event, ui) => {
                // This is called when an item is dragged from another item's children to this element's children
                let newChildren = list.sortable('toArray', {attribute: 'id'});

                // This is necessary in order to avoid that JQuery touches the DOM
                // It has to be BEFORE action is dispatched and React tries to repaint
                $(ui.sender).sortable('cancel');

                this.props.onNavItemReordered(
                    this.props.navItemSelected, // item moved
                    this.props.id, // new parent
                    this.props.navItems[this.props.navItemSelected].parent, // old parent
                    calculateNewIdOrder(this.props.navItemsIds, newChildren, this.props.id, this.props.navItemSelected, this.props.navItems),
                    newChildren
                );

                // Restore opacity of moving item
                $("#" + this.props.navItemSelected).css("opacity", "1");
            }
        });
    }

    componentWillUnmount(){
        jQuery(this.refs.sortableList).sortable("destroy");
    }
}
