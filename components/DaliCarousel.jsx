import React, {Component} from 'react';
import {Grid, Col, Row, Button, ButtonGroup} from 'react-bootstrap';
import {ID_PREFIX_SECTION, ID_PREFIX_PAGE} from '../constants';
import SlideThumbnail from '../components/SlideThumbnail';
import Section from '../components/Section';

export default class DaliCarousel extends Component{
    render(){
        let displayModeClassName = "";
        if(this.props.displayMode === "thumbnail")
            displayModeClassName = "fa fa-th-large";
        else if (this.props.displayMode === "list")
            displayModeClassName = "fa fa-th-list";

        return(
            <div style={{backgroundColor: '#CCC', height: '100%', padding: '20% 10px 10px 10px'}}>
                <ButtonGroup style={{width: '100%'}}>
                    <Button style={{minWidth: 40, width: '50%'}}
                            disabled={this.props.navItemSelected === 0}
                            onClick={e => {
                                    let ids = [this.props.navItemSelected];
                                    this.findChildren(ids);
                                    this.props.onNavItemRemoved(ids, this.props.navItems[this.props.navItemSelected].parent);
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
                        if(id.indexOf(ID_PREFIX_SECTION) !== -1){
                            return <Section id={id}
                                            key={index}
                                            navItemsIds={this.props.navItemsIds}
                                            navItems={this.props.navItems}
                                            navItemSelected={this.props.navItemSelected}
                                            onPageAdded={this.props.onPageAdded}
                                            onSectionAdded={this.props.onSectionAdded}
                                            onNavItemSelected={this.props.onNavItemSelected}
                                            onNavItemExpanded={this.props.onNavItemExpanded} />;
                        }else if(id.indexOf(ID_PREFIX_PAGE) !== -1){
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
                        this.props.onSectionAdded(ID_PREFIX_SECTION + Date.now(), "Section 1", 0, [], 1, '', this.props.navItemsIds.length);
                        e.stopPropagation();
                    }}><i className="fa fa-folder-o"></i></Button>
                    <Button onClick={e => {
                        this.props.onPageAdded(0, true);
                        e.stopPropagation();
                    }}><i className="fa fa-file-o"></i></Button>
                </ButtonGroup>
                <Button style={{position: 'absolute', right: 0, bottom: 0}} onClick={e => {
                    let newMode = "list";
                    switch(this.props.displayMode){
                        case "list":
                            newMode = "thumbnail";
                            break;
                        case "thumbnail":
                            newMode = "list";
                            break;
                    }
                    this.props.onDisplayModeChanged(newMode);
                    e.stopPropagation();
                }}>
                    <i className={displayModeClassName}></i>
                </Button>
            </div>
        );
    }

    findChildren(ids){
        //We want to get all the items whose level is higher than the selected starting after it
        let level = this.props.navItems[ids[0]].level;
        let startingIndex = this.props.navItemsIds.indexOf(ids[0]) + 1;
        for(var i = startingIndex; i < this.props.navItemsIds.length; i++){
            if(this.props.navItems[this.props.navItemsIds[i]].level > level) {
                ids.push(this.props.navItemsIds[i]);
            } else {
                break;
            }
        }
        return ids;
    }
}