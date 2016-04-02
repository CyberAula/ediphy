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
                //console.log(this)
                console.log("mueve desde el exterior al exterior");
                const reorderedIndexes = list.sortable('toArray', {attribute: 'data-reactid'}) // Obtiene la nueva disposición de los elementos
                const indexes = reorderedIndexes.map(el => el.split('$').pop()) //Coge solo la parte que indica el orden
                list.sortable('cancel') //Evita que se reordenen para que gestione la llamada Redux
               
                console.log('EXterior')

                const navItems = this.props.navItems;
                const childs = navItems[this.props.navItems[this.props.navItemSelected].parent].children;
 
                var newIndexesAux = [] ;
                var newIndexes = [] ;


                /*Object.keys(indexes).map(i =>{
                    console.log(i);
                     newIndexes.push(childs[i]);
                     console.log("NE",newIndexes);
                    if(navItems[childs[i]].children.length > 0 ){
                        console.log(childs[i], "tiene hijos");
                        console.log(navItems[childs[i]].children);
                        newIndexes = newIndexes.concat(navItems[childs[i]].children);
                    }

                });*/

/*
                childs.forEach(child => {
                    newIndexes.push(child);
                    if(navItems[child].children.length > 0 ){
                        console.log(child, "tiene hijos");
                        console.log(navItems[child].children);
                        newIndexes = newIndexes.concat(navItems[child].children);
                    }
                });
*/
                var child = "";
                console.log("childs",childs);

                   var newChilds = [];

                console.log(indexes);
                indexes.forEach(index => {
                    
                    newChilds.push(childs[index]);

                });
                console.log("newChilds", newChilds)

             


                if( newChilds.indexOf(this.props.navItemSelected) > 0){
                    console.log("de exterior a exterior: caso0, hace cosas");

                    var childLooper = "";
                    var childAuxOldLooper = [];
                    var concater = [];
                    var childsLoopers = [];
                    var iteratorsLifoStack = [];
                    var flag = 0;

                    indexes.forEach(i => {
                        child = childs[i];
                        newIndexesAux.push(child);
                        
                        childLooper = child;

                        do{
                            childsLoopers = navItems[childLooper].children;
  
                            for ( var k = 0; k < childsLoopers.length; k++){

                                if( flag == 2 ){
                                    console.log("llegue con flag2");
                                    k = iteratorsLifoStack.pop();
                                    flag = 0;
                                        if( k == childsLoopers.length -1){
                                            console.log("estamos en el borde")
                                            if(childAuxOldLooper > 0 ){
                                                childLooper = childAuxOldLooper.pop()
                                                console.log("NO flag a 3")
                                                flag = 0;
                                            }else{
                                                flag = 3;
                                                console.log("flag a 3")
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

                    });

                    newIndexesAux.forEach(ind => {
                        newIndexes.push(this.props.navItemsIds.indexOf(ind));
                    });

                                    console.log('distintos')
                                    console.log(indexes)
                                    console.log(childs)
                                    console.log("********");
                                    console.log(newIndexesAux);
                                    console.log(newIndexes);

                    this.props.onNavItemReorded(indexes, this.props.navItems[this.props.navItemSelected].parent,0,newIndexesAux) // Cambia el estado pasando como parámetro el id del sortable y el nuevo orden de los elementos. Ahora el orden también se puede UNDO y REDO
                  }else{
                    console.log("de exterior a seccion: caso1, no hago nada");
                }
       } ,
       receive: function(event, ui) {
             list.sortable('cancel')
            console.log("de seccion al exterior: caso 4 , hago cosas.")
            console.log(this);
            console.log(this.props.navItemSelected);
            console.log("parent",this.props.navItems[this.props.navItemSelected].parent);
            const reorderedIndexes = list.sortable('toArray', {attribute: 'data-reactid'}) 
            const  parent = this.props.navItems[this.props.navItemSelected].parent;
             const navItems = this.props.navItems;
             const navItemsIds = this.props.navItemsIds;

             console.log("uncles");
             console.log(navItems[navItems[parent].parent].children)
             console.log(navItems[parent].children)


             /*
                Cogemos y miramos a sus hermanos si es el ultimo subimos de nivel a su padre si el apdre es el ultimo de sus hermanos
                seguimos subiendo si no el siguiente sera el nexItemAux y pararemos, sacamos los dos indexOf y el leghnt donde tenemos que cortar y hacemos el merge con las tres partes

             */
            

            var auxInd = "0";
            for(var i = 0; i < reorderedIndexes.length; i++){
                console.log(reorderedIndexes[i].split('$').length);
                if(reorderedIndexes[i].split('$').length> 2){
                    auxInd = i;
                    break;
                }
            }
            console.log("estaba en el indice", auxInd)
            var reactIdElem = reorderedIndexes[auxInd].split('$');
            console.log("reactId", reactIdElem);
           
            var predecessor;
            var nextItemAux;
            var parentAux;
            var auxIdEl;
            for(var i=reactIdElem.length-1; i>0; i--){
                console.log(reactIdElem[i]);
                if(i==reactIdElem.length-1){
                    parentAux = this.props.navItemSelected;
                    predecessor = navItems[parent];
                }else{
                    parentAux = predecessor.id;
                    predecessor = navItems[navItems[parentAux].parent];
                }
                console.log("I",i,"%%%%","parentAux",parentAux,"predecessor",predecessor)
                console.log("leng-1",predecessor.children.length-1)
                console.log("parentID",reactIdElem[i].split('.')[0])
                if(predecessor.children.length-1 == reactIdElem[i].split('.')[0]){
                    console.log("es el ultimo");
                }else{
                    console.log("no es el ultimo y no seguimos mirando")
                    auxIdEl = parseInt(reactIdElem[i].split('.')[0]);
                    console.log(auxIdEl+1)
                    nextItemAux = predecessor.children[auxIdEl+1]
                    console.log("nextItemAux",nextItemAux)
                    break;
                }
            }

            var part1;
            var part2;
            var medio;
            var newIndexesAux = navItemsIds ;
            var newIndexes = [] ;

            if(nextItemAux == undefined){
                console.log("seguro que era el ultimo elemento")

                part1 = newIndexesAux.slice(0,newIndexesAux.indexOf(this.props.navItemSelected));
                medio =  newIndexesAux.slice(newIndexesAux.indexOf(this.props.navItemSelected));
                console.log("part1",part1)
                console.log("medio",medio)

            }else{
                console.log("tenia algun elemento despues")
                console.log(newIndexesAux.indexOf(this.props.navItemSelected))
                part1 = newIndexesAux.slice(0,newIndexesAux.indexOf(this.props.navItemSelected));
                part2 = newIndexesAux.slice(newIndexesAux.indexOf(nextItemAux));
                medio = newIndexesAux.slice(newIndexesAux.indexOf(this.props.navItemSelected),newIndexesAux.indexOf(nextItemAux));
                console.log("part1",part1)
                console.log("part2",part2)
                console.log("medio",medio)
                part1 = part1.concat(part2)
            }

            //ahora comprobamos si el nuevo hijo de exterior es el ultimo o no
            //si es el ultimo lo metemos al final directamente el medio
            //si no es el ultimo lo metemos justo encima del indice del siguiente(indexof-1)
            if(auxInd >= navItems[0].children.length){
                console.log("esta al final")
                newIndexes = part1.concat(medio)
            }else{
                console.log("no esta al final")
                newIndexes = part1.slice(0,part1.indexOf(navItems[0].children[auxInd])).concat(medio,part1.slice(part1.indexOf(navItems[0].children[auxInd])))

            }

console.log("HHHHHHHHHHHHHHHH");
console.log(newIndexes);
            console.log("HHHHHHHHHHHHHHHHH")

             this.props.onNavItemReorded(indexes, this.props.navItems[this.props.navItemSelected].parent,4,newIndexes)

            /*if(auxInd >= this.props.navItems[0].children.length){
                console.log("es el ultimo")
            }else{
                console.log("no es el ultimo")
            }*/
            //Si 0.children leng < indexaux es el ultimo si no sacamos el siguiente con el indice que ha salido para saber donde tenemos que cortar
        //conocer la posicion del siguiente hermano al seleccionado es util

           //console.log(parent)
            //console.log("PAdre",this.props.navItems[this.props.navItemSelected].parent);
           // console.log(reorderedIndexes)
           // console.log("AAAAAAAAAAAAAAAAAAAAAAAA");
        }.bind(this)
    }).bind(this);


}
}
