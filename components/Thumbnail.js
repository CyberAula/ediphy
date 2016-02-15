import React, {Component} from 'react';
import {Button, ButtonGroup} from 'react-bootstrap';

export default class Thumbnail extends Component{
    render(){
        let border = (this.props.isSelected) ? "2px solid #f87060" : "";
        return(
            <div style={{backgroundColor: 'white', width: '100%', height: '12.5%', minHeight: '120px', marginTop: '3%', border: border, boxSizing: 'border-box', position: 'relative'}}
                 onClick={(e) => this.props.onNavItemSelected(this.props.id)}>
                
                <ButtonGroup vertical style={{visibility: (this.props.isSelected ? 'visible' : 'hidden'), position: 'absolute', top: 0}}>
                    <Button  onClick={e => {
                                        let ids = [this.props.id];
                                        let found = this.findChildren(ids);
                                        let boxes =  this.findBoxes(found)
                            
                                        this.props.onNavItemRemoved(ids, this.props.navItems[this.props.id].parent, boxes );
                                          e.stopPropagation();
                                    }
                                }><i className="fa fa-trash-o"></i></Button>
                    <Button><i className="fa fa-files-o"></i></Button>
                </ButtonGroup>
                <p  className="thumb">{this.props.navItems[this.props.id].name}</p>
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

    sections(){

        var current = 1;
        for (let i in this.props.navItemsIds){
         
            if(this.props.navItemsIds[i][0]=='s'){
                current++;
            }
        }
        return current;

    }

    findBoxes(ids){
       let newids = ids;
       var boxesids = [];
             console.log(this.props.boxes)
       newids.map(nav=> {
              console.log(nav)
            Object.keys(this.props.boxes).map(box=> 
               { console.log('box')
                console.log(box)
                if(this.props.boxes[box]['page'] == nav){
                    console.log(box)
                boxesids.push(this.props.boxes[box]['id'])
            }})
        });

       console.log(boxesids)

         return boxesids;
       
    }
}