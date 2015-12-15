import React, {Component} from 'react';
import {Button} from 'react-bootstrap';

export default class Section extends Component {
    render() {
        let section = this.props.sections[this.props.id];
        let color = (this.props.navItemSelected === this.props.id) ? 'red' : 'black';

        return (
            <div onClick={e => {
                this.props.onSectionSelected(section.id);
                e.stopPropagation();
            }}>
                <div>
                    <Button onClick={e => this.props.onSectionExpanded(section.id, !section.isExpanded)}><i className={section.isExpanded ? "fa fa-minus-square-o" : "fa fa-plus-square-o"}></i></Button>
                    <h3 style={{color: color, display: 'inline'}}>Section {section.name}</h3>
                </div>
                <div style={{display: (section.isExpanded ? 'block' : 'none'), borderLeft: '1px dotted black'}}>
                    <div style={{marginLeft: 20}}>
                        {
                            this.props.navIds.map((id, index) => {
                                if(this.props.sections[id]) {
                                    if (this.props.sections[id].parent === section.id)
                                        return <Section id={id}
                                                        key={index}
                                                        sectionsIds={this.props.sectionsIds}
                                                        sections={this.props.sections}
                                                        sectionSelected={this.props.sectionSelected}
                                                        pagesIds={this.props.pagesIds}
                                                        pages={this.props.pages}
                                                        pageSelected={this.props.pageSelected}
                                                        navIds={this.props.navIds}
                                                        navItemSelected={this.props.navItemSelected}
                                                        onPageAdded={this.props.onPageAdded}
                                                        onPageSelected={this.props.onPageSelected}
                                                        onSectionAdded={this.props.onSectionAdded}
                                                        onSectionSelected={this.props.onSectionSelected}
                                                        onSectionExpanded={this.props.onSectionExpanded}
                                            />;
                                }else if(this.props.pages[id]) {
                                    let color = this.props.navItemSelected === id ? 'red' : 'black';
                                    if (this.props.pages[id].parent === section.id)
                                        return <h4 key={index} style={{color: color}} onClick={e => {
                                            this.props.onPageSelected(id);
                                            e.stopPropagation();
                                        }}> Page {this.props.pages[id].name}</h4>;
                                }
                        })}
                    </div>
                    <div style={{marginTop: 10, marginLeft: 20}}>
                        <Button onClick={e =>
                            this.props.onSectionAdded(Date.now(), section.id, (section.name + "." + (++section.childrenNumber)), 0, section.level + 1)
                        }><i className="fa fa-folder-o"></i></Button>
                        <Button onClick={e => {
                            this.props.onPageAdded(this.props.id, true)
                            e.stopPropagation();
                        }}><i className="fa fa-file-o"></i></Button>
                    </div>
                </div>
            </div>
        );
    }
}
