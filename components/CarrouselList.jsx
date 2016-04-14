import React, {Component} from 'react';
import {Button, ButtonGroup} from 'react-bootstrap';
import {ID_PREFIX_SECTION, ID_PREFIX_PAGE} from '../constants';
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
                                        let boxes =  this.findBoxes(found);
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
                                    this.props.onSectionAdded(ID_PREFIX_SECTION + Date.now(), "Section "+this.sections(), 0, [], 1, 'section', this.props.navItemsIds.length);
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
         
            if(this.props.navItemsIds[i][0]=='s'){
                current++;
            }
        }
        return current;

    }


    findBoxes(ids){
       let newids = ids;
       var boxesids = [];
       newids.map(nav=> {

       let boxes = this.props.navItems[nav].boxes
            boxesids = boxesids.concat(boxes);
            boxes.map(box=> {console.log(box); 
                if (box[1]=='s'){
                    let children = this.props.boxes[box]['children']
                   children.map(child=>{
                     boxesids.push('bo-'+child.split("-")[1])
                   });
 
            }});
        });

     
         return boxesids;
       
    }

    componentDidMount(){
        let list = jQuery(this.refs.sortableList);
        let props = this.props;
        list.sortable({ 
           // handle: '.drag-handle' ,
           connectWith: '.connectedSortables',
           stop: (event, ui) => {

                const reorderedIndexesId = list.sortable('toArray', {attribute: 'id'})
                const select = this.props.navItemSelected;
                const navItems = this.props.navItems;

                //$('.connectedSortables').sortable('cancel');
                
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
                            selectedAndChilds.push(previos[i])
                        }
                    }

                    var part1 = previos.slice(0,previos.indexOf(select));
                    var part2 = previos.slice(previos.indexOf(select)+selectedAndChilds.length)
                    var concatA = part1.concat(part2)

                    if(newChildrenInOrder.indexOf(select) >= newChildrenInOrder.length-1 ){ //es el ultimo de los nuevos hijos
                        newIndexesAux = concatA.concat(selectedAndChilds);
                    }else{//si no es el ultimo nuevo hijo
                        var part1b = concatA.slice(0,concatA.indexOf(newChildrenInOrder[newChildrenInOrder.indexOf(select)+1]));
                        var part2b = concatA.slice(concatA.indexOf(newChildrenInOrder[newChildrenInOrder.indexOf(select)+1]));
                        newIndexesAux = part1b.concat(selectedAndChilds, part2b);                    
                    }                

                    console.log("LANZA el caso 0 , desde la sección exterior a si misma");
                    console.log("orden previo de los indices");
                    console.log(previos);
                    console.log("seleccionado", select)
                    console.log("hijos del seleccionado con él mismo");
                    console.log(selectedAndChilds)
                    console.log("nuevo orden de todos los indices");          
                    console.log(newIndexesAux)
                    console.log("nuevo orden de los hijos de .0.")
                    console.log(newChildrenInOrder)
                   this.props.onNavItemReorded(this.props.navItemSelected, 0,0,newIndexesAux,newChildrenInOrder) 
                }else{
                    console.log("carrousel list stop cancelado?")
                }
            },
            receive: function(event, ui) {
                //const reorderedIndexes = list.sortable('toArray', {attribute: 'data-reactid'}) 
                const reorderedIndexesId = list.sortable('toArray', {attribute: 'id'})
                //console.log("REOID",reorderedIndexesId);
                const  parent = this.props.navItems[this.props.navItemSelected].parent;
                //console.log(this)
                const navItems = this.props.navItems;
                const navItemsIds = this.props.navItemsIds;
                //console.log(navItemsIds);
                //var newChildrenInOrder = [];
                var auxInd = "0";
               
               list.sortable('cancel'); 
                $('.connectedSortables').sortable('cancel');
               


                /*for(var i = 0; i < reorderedIndexes.length; i++){
                    if(reorderedIndexes[i].split('$').length> 2){
                        auxInd = i;
                        break;
                    }
                }
                */
                auxInd = reorderedIndexesId.indexOf(this.props.navItemSelected);

               // var reactIdElem = reorderedIndexes[auxInd].split('$');

                var predecessor;
                var nextItemAux;
                var parentAux;
                var auxIdEl;
                for(var i=navItems[this.props.navItemSelected].level; i>0; i--){

                    if(i==navItems[this.props.navItemSelected].level){
                        parentAux = this.props.navItemSelected;
                        predecessor = navItems[parent];
                    }else{
                        parentAux = predecessor.id;
                        predecessor = navItems[navItems[parentAux].parent];
                    }

                    if(predecessor.children.length-1 == predecessor.children.indexOf(parentAux)){
                    }else{
                        //auxIdEl = parseInt(reactIdElem[i].split('.')[0]);
                        auxIdEl = predecessor.children.indexOf(parentAux);
                        nextItemAux = predecessor.children[auxIdEl+1];
                        break;
                    }
                }
                /*for(var i=reactIdElem.length-1; i>0; i--){

                    if(i==reactIdElem.length-1){
                        parentAux = this.props.navItemSelected;
                        predecessor = navItems[parent];
                    }else{
                        parentAux = predecessor.id;
                        predecessor = navItems[navItems[parentAux].parent];
                    }

                    if(predecessor.children.length-1 == reactIdElem[i].split('.')[0]){
                    }else{
                        auxIdEl = parseInt(reactIdElem[i].split('.')[0]);
                        nextItemAux = predecessor.children[auxIdEl+1]
                        break;
                    }
                }*/

                //HASTA AQUI DEBE SOBRAR PERO HACE UNA COMPROBACIONM


                var part1;
                var part2;
                var medio;
                var newIndexesAux = navItemsIds ;

                if(nextItemAux == undefined){
                    part1 = newIndexesAux.slice(0,newIndexesAux.indexOf(this.props.navItemSelected));
                    medio =  newIndexesAux.slice(newIndexesAux.indexOf(this.props.navItemSelected));
                }else{
                    part1 = newIndexesAux.slice(0,newIndexesAux.indexOf(this.props.navItemSelected));
                    part2 = newIndexesAux.slice(newIndexesAux.indexOf(nextItemAux));
                    medio = newIndexesAux.slice(newIndexesAux.indexOf(this.props.navItemSelected),newIndexesAux.indexOf(nextItemAux));
                    part1 = part1.concat(part2);
                }

                var newIndexes = [];

                if(auxInd >= navItems[0].children.length){
                    newIndexes = part1.concat(medio);
                    //newChildrenInOrder = this.props.navItems[0].children;
                    //newChildrenInOrder.push(this.props.navItemSelected)
                }else{
                    newIndexes = part1.slice(0,part1.indexOf(navItems[0].children[auxInd])).concat(medio,part1.slice(part1.indexOf(navItems[0].children[auxInd])));
                    //newChildrenInOrder = this.props.navItems[0].children;
                    //newChildrenInOrder.splice(auxInd,0,this.props.navItemSelected)
                }
                console.log("LANZA 4")
                //this.props.onNavItemReorded(this.props.navItemSelected, 0,4,newIndexes,newChildrenInOrder)
              this.props.onNavItemReorded(this.props.navItemSelected, 0,4,newIndexes,reorderedIndexesId);
            
            }.bind(this)
        }).bind(this);
    }
}
