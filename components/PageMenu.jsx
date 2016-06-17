import React, {Component} from 'react';
import {Modal, Button, ButtonGroup, MenuItem, Dropdown} from 'react-bootstrap';
import {ID_PREFIX_PAGE} from '../constants';
import {ID_PREFIX_SORTABLE_BOX} from '../constants';
import {BOX_TYPES} from '../constants';
export default class PageMenu extends Component {
    render() {
        let navItem = this.props.navItems[this.props.caller];
        let proposedName = "Page " +  this.calculateName();
        return (
              <Dropdown role="menuitem" dropup id="dropdown-custom-2" >
                 <Dropdown.Toggle noCaret rootClose className="carrouselButton" style={{float: 'none'}}>
                   <i className="fa fa-file-o"></i>
                 </Dropdown.Toggle>
                 <Dropdown.Menu className="pageMenu"  onSelect={() => null}>
       
                        <MenuItem eventKey="1" onClick={e =>{
                           var idnuevo = ID_PREFIX_PAGE + Date.now();
                           this.props.onPageAdded(idnuevo, proposedName, this.props.caller, [], navItem.level + 1, 'document', this.calculatePosition(), 'expanded')
                           this.props.onBoxAdded({parent: idnuevo, container: 0, id: ID_PREFIX_SORTABLE_BOX + Date.now()}, BOX_TYPES.SORTABLE, false, false);
                          }}>Document</MenuItem>

                        <MenuItem eventKey="2"onClick={e => this.props.onPageAdded(ID_PREFIX_PAGE + Date.now(), proposedName, this.props.caller, [], navItem.level + 1, 'slide', this.calculatePosition(), 'hidden')}>Slide</MenuItem>
                        <MenuItem eventKey="3" disabled>Poster</MenuItem>
                        <MenuItem eventKey="4" disabled>Others</MenuItem>
 
             </Dropdown.Menu>
        </Dropdown>
        );
    }

    calculatePosition(){
        if(this.props.caller == 0) {
            return this.props.navItemsIds.length;
        }

        let navItem = this.props.navItems[this.props.caller];
        var cuenta = 0
        var exit= 0;
        this.props.navItemsIds.map(i=>{

            if(exit == 0 & this.props.navItems[i].position > navItem.position/* && prev > navItem.level*/) {
                if( this.props.navItems[i].level > navItem.level ){
                    cuenta++; return;
                } 
                else{   
                    exit =1; return;
                }
            }
        });
           return navItem.position +cuenta + 1;
    }

    calculateName(){
        let siblings = this.props.navItemsIds
        var num = 1
        for (let i in siblings){
            if(siblings[i].indexOf(ID_PREFIX_PAGE) !== -1){
                num++
            }
        }
        return num;
    }


}