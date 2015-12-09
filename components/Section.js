import React, {Component} from 'react';

export default class Section extends Component {
    render() {
        let section = this.props.sections[this.props.id];
        let color = (this.props.sectionSelected === this.props.id) ? 'red' : 'black';

        return (
            <div onClick={e => {
                this.props.onSectionSelected(this.props.id);
                e.stopPropagation();
            }}>
                <div>
                    <button onClick={e => this.props.onSectionExpanded(this.props.id, !section.isExpanded)}>{section.isExpanded ? "-" : "+"}</button>
                    <h3 style={{color: color, display: 'inline'}}>Section {section.name}</h3>
                </div>
                <div style={{display: (section.isExpanded ? 'block' : 'none'), borderLeft: '1px dotted black'}}>
                    <div style={{marginLeft: 10}}>
                        {
                            this.props.sectionsIds.map((id, index) =>{
                                if(this.props.sections[id].parent === this.props.id)
                                    return <Section  id={id}
                                                     key={index}
                                                     sectionsIds={this.props.sectionsIds}
                                                     sections={this.props.sections}
                                                     sectionSelected={this.props.sectionSelected}
                                                     onPageAdded={this.props.onPageAdded}
                                                     onSectionAdded={this.props.onSectionAdded}
                                                     onSectionSelected={this.props.onSectionSelected}
                                                     onSectionExpanded={this.props.onSectionExpanded}
                                        />;
                            })
                        }
                    </div>
                    <div style={{marginTop: 10, marginLeft: 30}}>
                        <button onClick={e =>
                            this.props.onSectionAdded(Date.now(), this.props.id, (section.name + "." + (++section.childrenNumber)), 0)
                        }><i className="fa fa-folder-o"></i></button>
                        <button onClick={e => this.props.onPageAdded(Date.now())}><i className="fa fa-file-o"></i></button>
                    </div>
                </div>
            </div>
        );
    }
}
