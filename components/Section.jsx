import React, {Component} from 'react';
import {Button} from 'react-bootstrap';

export default class Section extends Component {
    render() {
        let navItem = this.props.navItems[this.props.id];
        let color = (this.props.navItemSelected === navItem.id) ? 'red' : 'black';

        return (
            <div onClick={e => {
                this.props.onNavItemSelected(navItem.id);
                e.stopPropagation();
            }}>
                <div>
                    <Button onClick={e => {
                        this.props.onNavItemExpanded(navItem.id, !navItem.isExpanded)
                        e.stopPropagation();
                    }}><i className={navItem.isExpanded ? "fa fa-minus-square-o" : "fa fa-plus-square-o"}></i></Button>
                    <h3 style={{color: color, display: 'inline'}}>{navItem.name}</h3>
                </div>
                <div style={{display: (navItem.isExpanded ? 'block' : 'none'), borderLeft: '1px dotted black'}}>
                    <div style={{marginLeft: 20}}>
                        {
                            navItem.children.map((id, index) => {
                                if(id.indexOf("se") !== -1) {
                                    return <Section id={id}
                                                    key={index}
                                                    navItemsIds={this.props.navItems[id].children}
                                                    navItems={this.props.navItems}
                                                    navItemSelected={this.props.navItemSelected}
                                                    onPageAdded={this.props.onPageAdded}
                                                    onSectionAdded={this.props.onSectionAdded}
                                                    onNavItemSelected={this.props.onNavItemSelected}
                                                    onNavItemExpanded={this.props.onNavItemExpanded} />;
                                }else if(id.indexOf("pa") !== -1) {
                                    let color = this.props.navItemSelected === id ? 'red' : 'black';
                                    return <h4 key={index} style={{color: color}} onClick={e => {
                                        this.props.onNavItemSelected(id);
                                        e.stopPropagation();
                                    }}>{this.props.navItems[id].name}</h4>;
                                }
                        })}
                    </div>
                    <div style={{marginTop: 10, marginLeft: 20}}>
                        <Button onClick={e => {
                            this.props.onSectionAdded("se-" + Date.now(), navItem.name + ".1", navItem.id, [], navItem.level + 1, '');
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
}
