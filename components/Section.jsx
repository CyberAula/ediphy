import React, {Component} from 'react';
import {Button} from 'react-bootstrap';
import {ID_PREFIX_SECTION, ID_PREFIX_PAGE} from '../constants';

export default class Section extends Component {
    render() {
        let navItem = this.props.navItems[this.props.id];
        let color = (this.props.navItemSelected === navItem.id) ? '#eca400' : 'black';

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

                <h3 style={{color: color, display: 'inline'}}>{navItem.name}</h3>
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
                                let color = this.props.navItemSelected === id ? '#eca400' : 'black';
                                return <h4 key={index} style={{color: color}} onClick={e => {
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
        let position = Math.max(this.props.navItemsIds.indexOf(navItem.children[navItem.children.length - 1]), 0) + 1;
        return position;
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
