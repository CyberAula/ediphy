import React, {Component} from 'react';
import {Modal, Button, ButtonGroup, MenuItem, Dropdown} from 'react-bootstrap';
import {ID_PREFIX_PAGE} from '../../../constants';
import {ID_PREFIX_SORTABLE_BOX, PAGE_TYPES} from '../../../constants';
import i18n from 'i18next';
import {isPage, isSection} from './../../../utils';

export default class PageMenu extends Component {
    render() {
        return (
            /* jshint ignore:start */
            <Dropdown role="menuitem"
                      dropup
                      className="carouselDropup"
                      id="carouselDropUp"
                      style={{
                        visibility: this.props.navItemSelected === 0 ? "hidden" : "visible"
                      }}>
                <Dropdown.Toggle noCaret rootClose className="carrouselButton">
                    <i className="material-icons">note_add</i>
                </Dropdown.Toggle>
                <Dropdown.Menu className="pageMenu" id="bottomMenu" onSelect={() => null}>

                    <MenuItem eventKey="1" onClick={e =>{
                           var newId = ID_PREFIX_PAGE + Date.now();
                           this.props.onNavItemAdded(
                                newId,
                                i18n.t("page"),
                                this.getParent().id,
                                PAGE_TYPES.DOCUMENT,
                                this.calculatePosition()
                           );
                           this.props.onBoxAdded(
                                {
                                    parent: newId,
                                    container: 0,
                                    id: ID_PREFIX_SORTABLE_BOX + Date.now()
                                },
                                false,
                                false
                           );
                          }}><i className="material-icons">view_day</i> Document</MenuItem>
                    <MenuItem eventKey="2" onClick={e => {
                           this.props.onNavItemAdded(
                                ID_PREFIX_PAGE + Date.now(),
                                i18n.t("slide"),
                                this.getParent().id,
                                PAGE_TYPES.SLIDE,
                                this.calculatePosition()
                           );
                        }}>
                        <i className="material-icons">view_carousel</i> Slide</MenuItem>
                    <MenuItem eventKey="3" disabled><i className="material-icons">dashboard</i> Poster</MenuItem>
                    <MenuItem eventKey="4" disabled><i className="material-icons">web</i> Other</MenuItem>

                </Dropdown.Menu>
            </Dropdown>
            /* jshint ignore:end */
        );
    }

    getParent() {
        // If the selected navItem is not a section, it cannot have children -> we return it's parent
        if (isSection(this.props.navItemSelected)) {
            return this.props.navItems[this.props.navItemSelected];
        }
        return this.props.navItems[this.props.navItems[this.props.navItemSelected].parent];
    }

    calculatePosition(){
        let parent = this.getParent();
        let index = this.props.navItemsIds.indexOf(parent.id);
        return index + parent.children.length + 1;
    }
}
