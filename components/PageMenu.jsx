import React, {Component} from 'react';
import {Modal, Button, ButtonGroup, MenuItem, Dropdown} from 'react-bootstrap';
import {ID_PREFIX_PAGE} from '../constants';
import {ID_PREFIX_SORTABLE_BOX} from '../constants';
import i18n from 'i18next';

export default class PageMenu extends Component {
    render() {

        return (
            /* jshint ignore:start */
            <Dropdown role="menuitem"
                      dropup
                      className="carouselDropup"
                      id="carouselDropUp" >
                <Dropdown.Toggle noCaret   className="carrouselButton">
                    <i className="material-icons">note_add</i>
                </Dropdown.Toggle>
                <Dropdown.Menu className="pageMenu" id="bottomMenu" onSelect={() => null}>

                    <MenuItem eventKey="1" onClick={e =>{
                           var idnuevo = ID_PREFIX_PAGE + Date.now();
                           this.props.onNavItemAdded(idnuevo,  i18n.t("page"), this.calculateParent().id , [], this.calculateParent().level + 1, 'document', this.calculateNewPosition(), 'expanded')
                           this.props.onBoxAdded({parent: idnuevo, container: 0, id: ID_PREFIX_SORTABLE_BOX + Date.now()}, false, false);
                          }}><i className="material-icons">view_day</i> Document</MenuItem>

                    <MenuItem eventKey="2" onClick={e => {
                           this.props.onNavItemAdded(ID_PREFIX_PAGE + Date.now(),  i18n.t("slide"), this.calculateParent().id , [], this.calculateParent().level + 1,  'slide', this.calculatePosition(), 'hidden')
                        }}>
                        <i className="material-icons">view_carousel</i> Slide</MenuItem>
                    <MenuItem eventKey="3" disabled><i className="material-icons">dashboard</i> Poster</MenuItem>
                    <MenuItem eventKey="4" disabled><i className="material-icons">web</i> Other</MenuItem>

                </Dropdown.Menu>
            </Dropdown>
            /* jshint ignore:end */
        );
    }

    calculateParent() {
        if(this.props.navItemSelected === 0){
            return this.props.navItems[0];
        }
        var navItem;
        if (this.props.navItems[this.props.navItemSelected].type === "section") {
            navItem = this.props.navItems[this.props.navItemSelected];
        } else {
            navItem = this.props.navItems[this.props.navItems[this.props.navItemSelected].parent];
        }
        return navItem;
    }

    calculateNewPosition() {
        var navItem, nextPosition;
        if (this.props.navItems[this.props.navItemSelected].type === "section") {
            navItem = this.props.navItems[this.props.navItemSelected];
            if (this.props.navItems[navItem.id].children.length > 0) {
                nextPosition = this.props.navItems[this.props.navItems[navItem.id].children[this.props.navItems[navItem.id].children.length - 1]].position;
            } else {
                nextPosition = navItem.position;
            }
        } else {
            navItem = this.props.navItems[this.props.navItems[this.props.navItemSelected].parent];
            nextPosition = this.props.navItems[this.props.navItemSelected].position;
        }
        nextPosition++;

        return nextPosition;
    }

    calculatePosition() {
        if (this.props.caller === 0) {
            return this.props.navItemsIds.length;
        }

        let navItem = this.props.navItems[this.props.caller];
        var cuenta = 0;
        var exit = 0;
        this.props.navItemsIds.map(i=> {

            if (exit === 0 && this.props.navItems[i].position > navItem.position/* && prev > navItem.level*/) {
                if (this.props.navItems[i].level > navItem.level) {
                    cuenta++;
                    return;
                }
                else {
                    exit = 1;
                    return;
                }
            }
        });
        return navItem.position + cuenta + 1;
    }

    calculateName() {
        let siblings = this.props.navItemsIds;
        var num = 1;
        for (let i in siblings) {
            if (siblings[i].indexOf(ID_PREFIX_PAGE) !== -1) {
                num++;
            }
        }
        return num;
    }


}
