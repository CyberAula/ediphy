import React, {Component} from 'react';
import {Button, ButtonGroup, Col} from 'react-bootstrap';
import {ID_PREFIX_SECTION, ID_PREFIX_PAGE, ID_PREFIX_SORTABLE_BOX, BOX_TYPES} from '../constants';
import Section from '../components/Section';

export default class CarrouselList extends Component{
    render(){
        return(
            <div style={{height: '100%'}}>
                <ButtonGroup style={{width: '100%'}}>
                    <Button className="carrouselButton" 
                            disabled={this.props.navItemSelected === 0}
                            onClick={e => {
                                        let ids = [this.props.navItemSelected];
                                        let found = this.findChildren(ids);
                                        let boxes = this.findBoxes(found);
                                        this.props.onNavItemRemoved(ids, this.props.navItems[this.props.navItemSelected].parent, boxes );
                                    }
                                }><i className="fa fa-trash-o"></i></Button>
                    <Button className="carrouselButton" 
                            disabled={this.props.navItemSelected === 0}
                            onClick={e => {
                                        //this.props.onSectionDuplicated(this.props.sectionSelected);
                                    }
                                }><i className="fa fa-files-o"></i></Button>

                    <Button className="carrouselButton"  onClick={e => {
                                    let idnuevo = ID_PREFIX_SECTION + Date.now();
                                    this.props.onSectionAdded(idnuevo, "Section "+this.sections(), 0, [], 1, 'section', this.props.navItemsIds.length, 'expanded');
                                    this.props.onBoxAdded({parent: idnuevo, container: 0, id: ID_PREFIX_SORTABLE_BOX + Date.now()}, BOX_TYPES.SORTABLE, false, false);
                                    e.stopPropagation();
                                }}><i className="fa fa-folder-o"></i></Button>
                    <Button className="carrouselButton"  onClick={e => {
                                    this.props.onPageAdded(0, true);
                                    e.stopPropagation();
                                }}><i className="fa fa-file-o"></i></Button>
                </ButtonGroup>
                <div  ref="sortableList" className="carList connectedSortables">
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
                                            onBoxAdded={this.props.onBoxAdded}
                                            onNavItemSelected={this.props.onNavItemSelected}
                                            onNavItemExpanded={this.props.onNavItemExpanded} 
                                            onNavItemReorded={this.props.onNavItemReorded}/>;
                        }else if(id.indexOf(ID_PREFIX_PAGE) !== -1){
                            let classSelected = this.props.navItemSelected === id ? 'selected drag-handle' : 'notSelected drag-handle';
                            return <h4 key={index}
                                        id={id} 
                                        className={classSelected}
                                         onMouseDown={e => {
                                                    this.props.onNavItemSelected(id);
                                                    e.stopPropagation();
                                               }}>{this.props.navItems[id].name}</h4>
                                            
                        }
                    })}
                </div>
            </div>
        )
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
         
            if(this.props.navItemsIds[i].indexOf(ID_PREFIX_SECTION) !== -1){
                current++;
            }
        }
        return current;
    }


    findBoxes(ids){
       let boxesIds = [];
       ids.map(nav => {
           let boxes = this.props.navItems[nav].boxes;
           boxesIds = boxesIds.concat(boxes);
           boxes.map(box => {
               boxesIds = boxesIds.concat(this.getBoxDescendants(this.props.boxes[box]));
           });
        });
        return boxesIds;
    }

    getBoxDescendants(box){
        let selected = [];

        if(box.children) {
            for (let i = 0; i < box.children.length; i++) {
                for (let j = 0; j < box.sortableContainers[box.children[i]].children.length; j++) {
                    selected.push(box.sortableContainers[box.children[i]].children[j]);
                    selected = selected.concat(this.getBoxDescendants(this.props.boxes[box.sortableContainers[box.children[i]].children[j]]));
                }
            }
        }
        return selected;
    }

    componentDidMount(){
        let list = jQuery(this.refs.sortableList);
        let props = this.props;
        list.sortable({ 
           // handle: '.drag-handle' ,
            tolerance: 'intersect',
            connectWith: '.connectedSortables',
            //helper: "clone",
            stop: (event, ui) => {
                const reorderedIndexesId = list.sortable('toArray', {attribute: 'id'})
                const select = this.props.navItemSelected;
                const navItems = this.props.navItems;

                if( reorderedIndexesId.indexOf(select) >= 0){
                    list.sortable('cancel');

                    var newIndexesAux = [] ;
                    var newChildrenInOrder = reorderedIndexesId;
                    var selectedAndChilds = [select];

                    const previos = this.props.navItemsIds;
                
                    for(var i = previos.indexOf(select)+1; i< previos.length; i++){
                        if(navItems[previos[i]].level <= navItems[select].level){
                            break;
                        }else{
                            selectedAndChilds.push(previos[i]);
                        }
                    }

                    var part1 = previos.slice(0,previos.indexOf(select));
                    var part2 = previos.slice(previos.indexOf(select)+selectedAndChilds.length);
                    var concatA = part1.concat(part2);

                    if(newChildrenInOrder.indexOf(select) >= newChildrenInOrder.length-1 ){ //es el ultimo de los nuevos hijos
                        newIndexesAux = concatA.concat(selectedAndChilds);
                    }else{//si no es el ultimo nuevo hijo
                        var part1b = concatA.slice(0,concatA.indexOf(newChildrenInOrder[newChildrenInOrder.indexOf(select)+1]));
                        var part2b = concatA.slice(concatA.indexOf(newChildrenInOrder[newChildrenInOrder.indexOf(select)+1]));
                        newIndexesAux = part1b.concat(selectedAndChilds, part2b);                    
                    }                

                    this.props.onNavItemReorded(this.props.navItemSelected, 0,0,newIndexesAux,reorderedIndexesId);
                }else{
                }
            },
            receive: function(event, ui) {
                const reorderedIndexesId = list.sortable('toArray', {attribute: 'id'})
                const parent = this.props.navItems[this.props.navItemSelected].parent;
                const navItems = this.props.navItems;
                const navItemsIds = this.props.navItemsIds;
                const select = this.props.navItemSelected;
                var auxInd = "0";

                $(ui.sender).sortable('cancel');

                auxInd = reorderedIndexesId.indexOf(this.props.navItemSelected);

                var newIndexesAux = [] ;
                var newChildrenInOrder = reorderedIndexesId;
                var selectedAndChilds = [select];

                const previos = this.props.navItemsIds;
                
                for(var i = previos.indexOf(select)+1; i< previos.length; i++){
                    if(navItems[previos[i]].level <= navItems[select].level){
                        break;
                    }else{
                        selectedAndChilds.push(previos[i]);
                    }
                }

                var part1 = previos.slice(0,previos.indexOf(select));
                var part2 = previos.slice(previos.indexOf(select)+selectedAndChilds.length);
                var concatA = part1.concat(part2);

                if(newChildrenInOrder.indexOf(select) >= newChildrenInOrder.length-1 ){ //es el ultimo de los nuevos hijos
                    newIndexesAux = concatA.concat(selectedAndChilds);
                  }else{//si no es el ultimo nuevo hijo
                    var part1b = concatA.slice(0,concatA.indexOf(newChildrenInOrder[newChildrenInOrder.indexOf(select)+1]));
                    var part2b = concatA.slice(concatA.indexOf(newChildrenInOrder[newChildrenInOrder.indexOf(select)+1]));
                    newIndexesAux = part1b.concat(selectedAndChilds, part2b);                    
                }         

                this.props.onNavItemReorded(this.props.navItemSelected, 0,4,newIndexesAux,reorderedIndexesId);
            
            }.bind(this)
        }).bind(this);
    }
}
