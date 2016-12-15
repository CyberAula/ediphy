import React, {Component} from 'react';
import {Tooltip, Button, ButtonGroup, Col, OverlayTrigger, Popover} from 'react-bootstrap';

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
                                            onNavItemNameChanged={this.props.onNavItemNameChanged}
                                            onNavItemAdded={this.props.onNavItemAdded}
                                            onBoxAdded={this.props.onBoxAdded}
                                            onNavItemSelected={this.props.onNavItemSelected}
                                            onNavItemExpanded={this.props.onNavItemExpanded}
                                            onNavItemReordered={this.props.onNavItemReordered}
                                            onNavItemToggled={this.props.onNavItemToggled}/>
                        } else if (isPage(id)) {
                            let classSelected = (this.props.navItemSelected === id) ? 'selected' : 'notSelected';
                            return  <h4 key={index}
                                        id={id}
                                        className={'navItemBlock' + classSelected}
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
                                                    onNameChanged={this.props.onNavItemNameChanged}
                                                    onNavItemToggled={this.props.onNavItemToggled}/>
                                        </span>
                                    </h4>
                            }
                        })}
                </div>
                <div className="bottomLine"></div>
                <div className="bottomGroup">
                    <OverlayTrigger placement="top" overlay={
                        <Tooltip>{i18n.t('create new folder')}
                        </Tooltip>}>
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
                                }}><i className="material-icons">create_new_folder</i>
                            </Button>
                    </OverlayTrigger>
                        
                    <OverlayTrigger placement="top" overlay={
                        <Tooltip>{i18n.t('create new document')}
                        </Tooltip>}>
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
                    </OverlayTrigger>
                        
                    <OverlayTrigger placement="top" overlay={
                        <Tooltip>{i18n.t('create new slide')}
                        </Tooltip>}>
                            <Button className="carrouselButton"
                                    onClick={e => {
                                    this.props.onNavItemAdded(
                                        ID_PREFIX_PAGE + Date.now(),
                                        i18n.t("slide"),
                                        this.getParent().id,
                                        PAGE_TYPES.SLIDE,
                                        this.calculatePosition()
                                    );
                                }}><i className="material-icons">slideshow</i>
                            </Button>
                    </OverlayTrigger>

                    <OverlayTrigger placement="top" overlay={
                        <Tooltip>{i18n.t('display')}
                        </Tooltip>}>
                            <Button className="carrouselButton">
                                <i className="material-icons"
                                   onClick={e => {
                                        this.props.onNavItemToggled(this.props.navItemSelected);
                                   }}>{this.props.navItems[this.props.navItemSelected].hidden ? "visibility_off" : "visibility"}</i>
                            </Button>
                    </OverlayTrigger>

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
                                    onClick={(e) => this.props.onNavItemDeleted()}>
                                {i18n.t("Accept")}
                            </Button>
                            <Button className="popoverButton"
                                    disabled={this.props.navItemSelected === 0}
                                    style={{float: 'right'}}  >
                                {i18n.t("Cancel")}
                            </Button>
                        </Popover>}>
                            <OverlayTrigger placement="top" overlay={
                                <Tooltip>{i18n.t('delete')}
                                </Tooltip>}>
                                    <Button className="carrouselButton"
                                            disabled={this.props.navItemSelected === 0}
                                            style={{float: 'right'}}>
                                        <i className="material-icons">delete</i>
                                    </Button>
                            </OverlayTrigger>
                        </OverlayTrigger>
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
            },
            receive: (event, ui) => {
                // This is called when an item is dragged from another item's children to this element's children
                let newChildren = list.sortable('toArray', {attribute: 'id'});

                // If action is done very quickly, jQuery may not notice the update and not detect that a new child was dragged
                if(newChildren.indexOf(this.props.navItemSelected) === -1){
                    newChildren.push(this.props.navItemSelected);
                }

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
            }
        });
    }

    componentWillUnmount(){
        jQuery(this.refs.sortableList).sortable("destroy");
    }
}
