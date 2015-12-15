import React, {Component} from 'react';
import {Grid, Col, Row, Button} from 'react-bootstrap';
import SlideThumbnail from '../components/SlideThumbnail';
import Section from '../components/Section';

export default class DaliCarousel extends Component{
    render(){
        return(
            <div style={{backgroundColor: '#CCC', height: '100%', padding: '20% 10px 10px 10px'}}>
                <div>
                    <Button style={{minWidth: 40}}
                            disabled={this.props.sectionSelected === -1 ||
                            this.props.sections[this.props.sectionSelected].parent === 0}>&lt;</Button>
                    <Button style={{minWidth: 40}}
                            disabled={this.props.sectionSelected === -1}
                            onClick={e => {
                                    let ids = [this.props.sectionSelected];
                                    this.findChildren(ids);
                                    this.props.onSectionRemoved(ids);
                                }
                            }><i className="fa fa-trash-o"></i></Button>
                    <Button style={{minWidth: 40}}
                            disabled={this.props.sectionSelected === -1}
                            onClick={e => {
                                    this.props.onSectionDuplicated(this.props.sectionSelected);
                                }
                            }><i className="fa fa-files-o"></i></Button>
                    <Button style={{minWidth: 40}}
                            disabled={this.props.sectionSelected === -1 ||
                            this.props.sections[this.props.sectionSelected].parent === 0}>&gt;</Button>
                </div>
                {/*this.props.ids.map((id, index) =>{
                    let isSelected = (this.props.pageSelected === id);
                    return <SlideThumbnail key={index} id={id} page={this.props.pages[id]} isSelected={isSelected} onPageSelected={this.props.onPageSelected} />;
                })*/}
                {
                    this.props.navIds.map((id, index) => {
                        if(this.props.sections[id]){
                            if(this.props.sections[id].parent === 0)
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
                        }else if(this.props.pages[id]){
                            let color = this.props.navItemSelected === id ? 'red' : 'black';
                            if(this.props.pages[id].parent === 0)
                                return <h4 key={index} style={{color: color}} onClick={e => {
                                    this.props.onPageSelected(id);
                                    e.stopPropagation();
                                    }}>Page {this.props.pages[id].name}</h4>;
                        }
                    })
                }
                <Button onClick={e =>
                            this.props.onSectionAdded(Date.now(), 0, ++(this.props.sections[0].childrenNumber), 0, 1)
                        }><i className="fa fa-folder-o"></i></Button>
                <Button onClick={e => this.props.onPageAdded(0, true)}><i className="fa fa-file-o"></i></Button>
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