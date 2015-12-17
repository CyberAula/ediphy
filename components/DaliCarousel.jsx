import React, {Component} from 'react';
import {Grid, Col, Row, Button, ButtonGroup} from 'react-bootstrap';
import SlideThumbnail from '../components/SlideThumbnail';
import Section from '../components/Section';

export default class DaliCarousel extends Component{
    render(){
        return(
            <div style={{backgroundColor: '#CCC', height: '100%', padding: '20% 10px 10px 10px'}}>
                <ButtonGroup style={{width: '100%'}}>
                    <Button style={{minWidth: 40, width: '50%'}}
                            disabled={this.props.navItemSelected === 0}
                            onClick={e => {
                                    //let ids = [this.props.sectionSelected];
                                    //this.findChildren(ids);
                                    //this.props.onSectionRemoved(ids);
                                }
                            }><i className="fa fa-trash-o"></i></Button>
                    <Button style={{minWidth: 40, width: '50%'}}
                            disabled={this.props.navItemSelected === 0}
                            onClick={e => {
                                    //this.props.onSectionDuplicated(this.props.sectionSelected);
                                }
                            }><i className="fa fa-files-o"></i></Button>
                </ButtonGroup>
                {/*this.props.ids.map((id, index) =>{
                    let isSelected = (this.props.pageSelected === id);
                    return <SlideThumbnail key={index} id={id} page={this.props.pages[id]} isSelected={isSelected} onPageSelected={this.props.onPageSelected} />;
                })*/}
                {
                    this.props.navItems[0].children.map((id, index) => {
                        if(id.indexOf("se") !== -1){
                            return <Section id={id}
                                            key={index}
                                            navItemsIds={this.props.navItems[id].children}
                                            navItems={this.props.navItems}
                                            navItemSelected={this.props.navItemSelected}
                                            onPageAdded={this.props.onPageAdded}
                                            onSectionAdded={this.props.onSectionAdded}
                                            onNavItemSelected={this.props.onNavItemSelected}
                                            onNavItemExpanded={this.props.onNavItemExpanded} />;
                        }else if(id.indexOf("pa") !== -1){
                            let color = this.props.navItemSelected === id ? 'red' : 'black';
                            return <h4 key={index}
                                       style={{color: color}}
                                       onClick={e => {
                                            this.props.onNavItemSelected(id);
                                            e.stopPropagation();
                                       }}>{this.props.navItems[id].name}</h4>;
                        }
                    })
                }
                <ButtonGroup>
                    <Button onClick={e => {
                        this.props.onSectionAdded("se-" + Date.now(), "Section 1", 0, [], 1, '');
                        e.stopPropagation();
                    }}><i className="fa fa-folder-o"></i></Button>
                    <Button onClick={e => {
                        this.props.onPageAdded(0, true);
                        e.stopPropagation();
                    }}><i className="fa fa-file-o"></i></Button>
                </ButtonGroup>
            </div>
        );
    }
/*
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
    }*/
}