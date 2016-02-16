import React, {Component} from 'react';
import {Button} from 'react-bootstrap';
import {ID_PREFIX_SECTION, ID_PREFIX_PAGE} from '../constants';

export default class Section extends Component {
    render() {
        let navItem = this.props.navItems[this.props.id];

        let classSelected = this.props.navItemSelected === id ? 'selected' : 'notSelected';
        return (
            <div onClick={e => {
                this.props.onNavItemSelected(navItem.id);
                e.stopPropagation();
            }}>
            <div>
                <button   className="expandir" onClick={e => {
                    this.props.onNavItemExpanded(navItem.id, !navItem.isExpanded)
                    e.stopPropagation();
                }}><i className={navItem.isExpanded ? "fa fa-chevron-down" : "fa fa-chevron-right"}></i></button>

                <h3 className={classSelected}style={{ display: 'inline'}}>{navItem.name}</h3>
            </div>
            <div style={{display: (navItem.isExpanded ? 'block' : 'none'), borderLeft: '1px dotted black'}}>
                <div style={{marginLeft: 20}}>
                    {
                        navItem.children.map((id, index) => {
                            if (id.indexOf(ID_PREFIX_SECTION) !== -1) {
                                return <Section id={id}
                                                key={index}
                                                navItemsIds={this.props.navItemsIds}
                                                navItems={this.props.navItems}
                                                navItemSelected={this.props.navItemSelected}
                                                onPageAdded={this.props.onPageAdded}
                                                onSectionAdded={this.props.onSectionAdded}
                                                onNavItemSelected={this.props.onNavItemSelected}
                                                onNavItemExpanded={this.props.onNavItemExpanded}/>;
                            } else if (id.indexOf(ID_PREFIX_PAGE) !== -1) {
                                let classSelected = this.props.navItemSelected === id ? 'selected' : 'notSelected';
                                
                                let color = this.props.navItemSelected === id ? '#f87060' : '#555';
                                return <h4 key={index} className={classSelected} onClick={e => {
                                    this.props.onNavItemSelected(id);
                                    e.stopPropagation();
                                }}>{this.props.navItems[id].name}</h4>;
                            }
                        })}
                </div>
                <div style={{marginTop: 10, marginLeft: 20}}>

                    <Button onClick={e => {
                       
                        this.props.onSectionAdded(ID_PREFIX_SECTION + Date.now(), navItem.name + "." +this.calculateName(navItem), navItem.id, [], navItem.level + 1, 'section', this.calculatePosition());
                        e.stopPropagation();
                    }}><i className="fa fa-folder-o"></i></Button>
                    <Button onClick={e => {
                        this.props.onPageAdded(navItem.id, true)
                        e.stopPropagation();
                    }}><i className="fa fa-file-o"></i></Button>
                </div>
                </div>
            </div>
        );
    }

    calculatePosition(){

        let navItem = this.props.navItems[this.props.id];
        //let position = Math.max(this.props.navItemsIds.indexOf(navItem.children[navItem.children.length - 1]), 0) + 1;
        var cuenta = 0
        var exit= 0;
        this.props.navItemsIds.map(i=>{
        
            if(exit==0 && this.props.navItems[i].position > navItem.position) {
                if( this.props.navItems[i].level > navItem.level ){
                    cuenta++; return;
                }else{
                    exit==1; return;
                }
            }
        });

        return navItem.position +cuenta + 1;
    }

    calculateName(navItem){

        let siblings = navItem.children
        var sections = 1
        for (let i in siblings){
            if(siblings[i][0] == 's') sections++
        }

        return sections


    }
}
