import React, {Component} from 'react';
import {Modal, Button, ButtonGroup} from 'react-bootstrap';
import {ID_PREFIX_PAGE} from '../constants';
import {ID_PREFIX_SORTABLE_BOX} from '../constants';
import {BOX_TYPES} from '../constants';
import i18n from 'i18next';

export default class PageModal extends Component {
    render() {
        let navItem = this.props.navItems[this.props.caller];
        let proposedName = i18n.t("page");
        return (
            /* jshint ignore:start */
            <Modal show={this.props.visibility} backdrop={true} bsSize="large"
                   onHide={e => this.props.onVisibilityToggled(0, false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Create new page</Modal.Title>
                </Modal.Header>

                <Modal.Body >
                    <ButtonGroup vertical={true} block={true}>
                        <Button bsStyle="primary" onClick={e =>{
                        var idnuevo = ID_PREFIX_PAGE + Date.now();
                        this.props.onPageAdded(idnuevo, proposedName, this.props.caller, [], navItem.level + 1, 'document', this.calculatePosition(), 'expanded')
                        this.props.onBoxAdded({parent: idnuevo, container: 0, id: ID_PREFIX_SORTABLE_BOX + Date.now()}, BOX_TYPES.SORTABLE, false, false);

                    
                    }}>Document</Button>
                        <Button bsStyle="primary"
                                onClick={e => this.props.onPageAdded(ID_PREFIX_PAGE + Date.now(), proposedName, this.props.caller, [], navItem.level + 1, 'slide', this.calculatePosition(), 'hidden')}>Slide</Button>
                        <Button bsStyle="primary" disabled>Poster</Button>
                        <Button bsStyle="primary" disabled>Others</Button>
                    </ButtonGroup>
                </Modal.Body>
            </Modal>
            /* jshint ignore:end */
        );
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
