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

                const reorderedIndexes = list.sortable('toArray', {attribute: 'data-reactid'}) // Obtiene la nueva disposición de los elementos
                 const reorderedIndexesId = list.sortable('toArray', {attribute: 'id'})
                 console.log("CASO 0 order", reorderedIndexesId)
                 console.log(reorderedIndexesId);
                const indexes = reorderedIndexes.map(el => el.split('$').pop()) //Coge solo la parte que indica el orden
               //$('.connectedSortables').sortable('cancel');
                    list.sortable('cancel');
                const select = this.props.navItemSelected;
                const navItems = this.props.navItems;
                const childs = navItems[this.props.navItems[this.props.navItemSelected].parent].children;

                var newIndexesAux = [] ;
                //var newIndexes = [] ;

                //var child = "";

             //   var newChilds = [];

                /*indexes.forEach(index => {
                    newChilds.push(childs[index]);
                });
                */
               // newChilds = reorderedIndexesId;

               //console.log(reorderedIndexesId);
               //console.log(select)
                if( reorderedIndexesId.indexOf(select) >= 0){
            
                    console.log("de exterior a exterior: caso0, hace cosas");

                    var newChildrenInOrder = reorderedIndexesId;
                    var selectedAndChilds = [select];
                   // var nextIndex;
    
                    const previos = this.props.navItemsIds;

                    console.log("previos:", previos)                  
                    for(var i = previos.indexOf(select)+1; i< previos.length; i++){
                        if(navItems[previos[i]].level <= navItems[select].level){
                           // nextIndex = i;
                            break;
                        }else{
                            selectedAndChilds.push(previos[i])
                        }
                    }
                    console.log("selectedAndChilds:",selectedAndChilds)

                    var part1 = previos.slice(0,previos.indexOf(select));
                    var part2 = previos.slice(previos.indexOf(select)+selectedAndChilds.length)
                    console.log("part1",part1)
                    console.log("part2",part2)
                    var concatA = part1.concat(part2)

                    console.log("newChilds")
                    console.log(newChildrenInOrder)      
                    console.log(newChildrenInOrder.indexOf(select)) 

                    //ESTO DA PROBLEMAS!!!
                    if(newChildrenInOrder.indexOf(select) >= newChildrenInOrder.length-1 ){
                        console.log("ultimo elemento")
                        console.log(concatA.indexOf(newChildrenInOrder[newChildrenInOrder.indexOf(select)+1]))
                        part1 = concatA.slice(0, concatA.indexOf(newChildrenInOrder[newChildrenInOrder.indexOf(select)+1]));
                        console.log(part1)
                        console.log(concatA.indexOf(newChildrenInOrder[newChildrenInOrder.indexOf(select)+1])) 
                        if(concatA.indexOf(newChildrenInOrder[newChildrenInOrder.indexOf(select)+1]) > 0){
                            //hay que sacar la segunda parte del array
                          part2 = concatA.slice( concatA.indexOf(newChildrenInOrder[newChildrenInOrder.indexOf(select)+1]));
                      }else{
                        part2 = concatA.slice( concatA.indexOf(newChildrenInOrder[newChildrenInOrder.indexOf(select)-1]));
                      }
                        console.log("YEYE")
                          console.log(part2)
                        newIndexesAux = part1.concat(selectedAndChilds,part2);
                        console.log("a ver si essta bien newIndexesAux")
                        console.log(newIndexesAux)
                    }else{
                        part1 = concatA.slice(0, concatA.indexOf(newChildrenInOrder[newChildrenInOrder.indexOf(select)+1]));
                        part2 = concatA.slice( concatA.indexOf(newChildrenInOrder[newChildrenInOrder.indexOf(select)+1]));
                        newIndexesAux = part1.concat(selectedAndChilds,part2);
                        console.log("a ver si essta bien newIndexesAux")
                        console.log(newIndexesAux)
                      
                    }                

                   /* if(nextIndex){
                        console.log(nextIndex)
                        //newIndexesAux =
                        console.log("nextIem", previos[nextIndex])

                    }else{
                        console.log("movio desde el final")

                    }*/
                   

/***************************************************************************************************/
                    var childLooper = "";
                    var childAuxOldLooper = [];
                    var concater = [];
                    var childsLoopers = [];
                    var iteratorsLifoStack = [];
                    var flag = 0;
                     var child = "";


                 /*   indexes.forEach(i => {
                        child = childs[i];
                        newIndexesAux.push(child);
                        
                        childLooper = child;

                        do{
                            childsLoopers = navItems[childLooper].children;

                            for ( var k = 0; k < childsLoopers.length; k++){

                                if( flag == 2 ){
                                    k = iteratorsLifoStack.pop();
                                    flag = 0;
                                    if( k == childsLoopers.length -1){
                                        if(childAuxOldLooper > 0 ){
                                            childLooper = childAuxOldLooper.pop()
                                            flag = 0;
                                        }else{
                                            flag = 3;
                                        }
                                    }

                                }else{
                                    if(navItems[childsLoopers[k]].children.length > 0){
                                        concater.push(childsLoopers[k]);
                                        newIndexesAux.push(childsLoopers[k]);
                                        childAuxOldLooper.push(childLooper);
                                        iteratorsLifoStack.push(k);
                                        childLooper = childsLoopers[k];
                                        k = childsLoopers.length;
                                    }else{
                                        concater.push(childsLoopers[k]);
                                        newIndexesAux.push(childsLoopers[k]);
                                        if(k == childsLoopers.length-1){
                                            childLooper = childsLoopers[k];
                                            flag = 1;
                                        }
                                    }
                                }
                            }

                            if(flag == 1){
                                if(childAuxOldLooper.length > 0){
                                 childLooper = childAuxOldLooper.pop();
                             }
                             flag = 2;
                         }

                     }while(navItems[childLooper].children.length > 0 && flag != 3)
                 });*/

/***************************************************************************************************/

                    console.log(newIndexesAux)
                    //console.log(newIndexes);
                      /*                  newIndexesAux.forEach(ind => {
                        newIndexes.push(this.props.navItemsIds.indexOf(ind));
                    });*/
                    //console.log(newIndexesAux)
                    //console.log(newIndexes);
                    console.log("LANZA 0")
                    console.log(newIndexesAux)
                    console.log(newChildrenInOrder)
                   this.props.onNavItemReorded(this.props.navItemSelected, 0,0,newIndexesAux,newChildrenInOrder) // Cambia el estado pasando como parámetro el id del sortable y el nuevo orden de los elementos. Ahora el orden también se puede UNDO y REDO
                }else{
                    console.log("carrousel list stop cancelado?")
                }
            } ,
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
