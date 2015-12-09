import React, {Component} from 'react';
import SlideThumbnail from '../components/SlideThumbnail';
import Section from '../components/Section';

export default class DaliCarousel extends Component{
    render(){
        return(
            <div style={{display: 'table-cell', width: '15%', height: '100%', padding: '1%'}}>
                <div>
                    <button style={{width: '20%', minWidth: 40, display: 'inline-block'}}
                            disabled={this.props.sectionSelected === -1 ||
                            this.props.sections[this.props.sectionSelected].parent === 0}>&lt;</button>
                    <button style={{width: '20%', minWidth: 40, display: 'inline-block'}}
                            disabled={this.props.sectionSelected === -1}
                            onClick={e => {
                                    let ids = [this.props.sectionSelected];
                                    this.findChildren(ids);
                                    this.props.onSectionRemoved(ids);
                                }
                            }><i className="fa fa-trash-o"></i></button>
                    <button style={{width: '20%', minWidth: 40, display: 'inline-block'}}
                            disabled={this.props.sectionSelected === -1}
                            onClick={e => {
                                    this.props.onSectionDuplicated(this.props.sectionSelected);
                                }
                            }><i className="fa fa-files-o"></i></button>
                    <button style={{width: '20%', minWidth: 40, display: 'inline-block'}}
                            disabled={this.props.sectionSelected === -1 ||
                            this.props.sections[this.props.sectionSelected].parent === 0}>&gt;</button>
                </div>
                {/*this.props.ids.map((id, index) =>{
                    let isSelected = (this.props.pageSelected === id);
                    return <SlideThumbnail key={index} id={id} page={this.props.pages[id]} isSelected={isSelected} onPageSelected={this.props.onPageSelected} />;
                })*/}
                {this.props.sectionsIds.map((id, index) =>{
                    if(this.props.sections[id].parent === 0)
                        return <Section id={id}
                                        key={index}
                                        sectionsIds={this.props.sectionsIds}
                                        sections={this.props.sections}
                                        sectionSelected={this.props.sectionSelected}
                                        pagesIds={this.props.pagesIds}
                                        pages={this.props.pages}
                                        pageSelected={this.props.pageSelected}
                                        onPageAdded={this.props.onPageAdded}
                                        onPageSelected={this.props.onPageSelected}
                                        onSectionAdded={this.props.onSectionAdded}
                                        onSectionSelected={this.props.onSectionSelected}
                                        onSectionExpanded={this.props.onSectionExpanded}
                            />;
                })}
                {this.props.pagesIds.map((id, index) => {
                    let color = (this.props.pageSelected === id) ? 'green' : 'black';
                    if(this.props.pages[id].parent === 0)
                        return <div style={{marginLeft: 20, color: color}} onClick={e => this.props.onPageSelected(id)}>Page {this.props.pages[id].name}</div>;
                })}
                <button onClick={e =>
                            this.props.onSectionAdded(Date.now(), 0, ++(this.props.sections[0].childrenNumber), 0)
                        }><i className="fa fa-folder-o"></i></button>
                <button onClick={e => this.props.onPageAdded(Date.now(), (this.props.pagesIds.length + 1), 0)}><i className="fa fa-file-o"></i></button>
            </div>
        );
    }

    findChildren(ids){
        //@ index 0 is global section, never should be removed
        for(var i = 1; i < this.props.sectionsIds.length; i++){
            if(ids.indexOf(this.props.sections[this.props.sectionsIds[i]].parent) !== -1){
                if(ids.indexOf(this.props.sections[this.props.sectionsIds[i]].id) === -1){
                    //in case we find a child, we need to restart to check new possible subchildren
                    ids.push(this.props.sections[this.props.sectionsIds[i]].id);
                    i = 1;
                }
            }
        }
        return ids;
    }
}