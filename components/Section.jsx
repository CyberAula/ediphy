    //¿¿¿¿?????         console.log("part2", part2)
import React, {Component} from 'react';
import {Button} from 'react-bootstrap';
import {ID_PREFIX_SECTION, ID_PREFIX_PAGE} from '../constants';

export default class Section extends Component {
    render() {
        let navItem = this.props.navItems[this.props.id];

         let classSelected = this.props.navItemSelected === navItem.id ? 'selected' : 'notSelected';
        return (
            <div id={this.props.id} className="drag-handle" onMouseDown={e => {
                this.props.onNavItemSelected(navItem.id);
                e.stopPropagation();
            }}>
            <div >
                <button   className="expandir" onClick={e => {
                    this.props.onNavItemExpanded(navItem.id, !navItem.isExpanded)
                    e.stopPropagation();
                }}><i onClick={e => {
                    this.props.onNavItemExpanded(navItem.id, !navItem.isExpanded)
                    e.stopPropagation();}} className={navItem.isExpanded ? "fa fa-chevron-down" : "fa fa-chevron-right"}></i></button>

                <h3 className={classSelected} style={{ display: 'inline'}}>{navItem.name}</h3>
            </div>
            <div style={{display: (navItem.isExpanded ? 'block' : 'none'), borderLeft: '1px dotted black'}}>
                
                <div style={{marginLeft: 20}}>
                    <div ref="sortableListS" style={{paddingTop: 5}} className="sectionList connectedSortables">
                        {
                            navItem.children.map((id, index) => {
                                if (id.indexOf(ID_PREFIX_SECTION) !== -1) {
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
                                } else if (id.indexOf(ID_PREFIX_PAGE) !== -1) {
                                   // let classSelected = this.props.navItemSelected === id ? 'selected' : 'notSelected';
                                    let classSelected = this.props.navItemSelected === id ? 'selected dragS' : 'notSelected dragS';
                                    
                                    let color = this.props.navItemSelected === id ? '#f87060' : '#555';
                                    return <h4 key={index} id={id} className={classSelected} onMouseDown={e => {
                                        this.props.onNavItemSelected(id);
                                        e.stopPropagation();
                                    }}>{this.props.navItems[id].name}</h4>;
                                }
                            })}
                     </div>
                  </div>
                <div style={{marginTop: 10, marginLeft: 20}}>

                    <Button onClick={e => {
                       
                        this.props.onSectionAdded(ID_PREFIX_SECTION + Date.now(), navItem.name + "." +this.calculateName(navItem), navItem.id, [], navItem.level + 1, 'section', this.calculatePosition());
                        e.stopPropagation();
                    }}><i className="fa fa-folder-o"></i></Button>
                    <Button onClick={e => {
                        this.props.onPageAdded(navItem.id, true)
                        e.stopPropagation();
                    }}><i className="fa fa-file-o"></i></Button>
                </div>
                </div>
            </div>
        );
    }

    calculatePosition(){

        let navItem = this.props.navItems[this.props.id];
        //let position = Math.max(this.props.navItemsIds.indexOf(navItem.children[navItem.children.length - 1]), 0) + 1;
        var cuenta = 0
        var exit= 0;
        this.props.navItemsIds.map(i=>{
        
            if(exit==0 && this.props.navItems[i].position > navItem.position) {
                if( this.props.navItems[i].level > navItem.level ){
                    cuenta++; return;
                }else{
                    exit==1; return;
                }
            }
        });

        return navItem.position +cuenta + 1;
    }

    calculateName(navItem){

        let siblings = navItem.children
        var sections = 1
        for (let i in siblings){
            if(siblings[i][0] == 's') sections++
        }

        return sections


    }

    componentDidMount(){
        let list = jQuery(this.refs.sortableListS);

//console.log(list);
list.sortable({ 
            //handle: '.dragS',
            connectWith: '.connectedSortables',
            stop: (event, ui) => {
              //  const reorderedIndexes = list.sortable('toArray', {attribute: 'data-reactid'}) //Obtiene los elemntos por data-reactid
                const reorderedIndexesId = list.sortable('toArray', {attribute: 'id'}); //Obtiene la nueva disposición de elementos por id esta es la válida.
                console.log(reorderedIndexesId); //Saca el nuevo orden por Ids
               // const indexes = reorderedIndexes.map(el => el.split('$').pop() ) //Saca los index de los elementos por la reactId, habria que quitar esto puesto que es inutil y dará error en el futuro
            
                var oldChilds = this.props.navItems[this.props.id].children; //Saca los hijos del pasado del elemento seleccionado
              //  var newChilds = []; //Crea un arra de hijos nuevos donde colocaremos l anueva disposición

             /*   indexes.forEach(index => { //Recorreomos todas las ids para reasignar el orden nuevo en los newChilds
                    newChilds.push(oldChilds[index]);
                });*/
                //--3 porque no quiero usar la R.id

                var newChilds = reorderedIndexesId;
                console.log("seleccionado", this.props.navItemSelected)
                console.log("id", this.props.id)
                console.log( this.props.navItems[this.props.id].children)
                console.log("parent", this.props.navItems[this.props.navItemSelected].parent)

                if( newChilds.indexOf(this.props.navItemSelected) >= 0 && oldChilds.indexOf(this.props.seleccionado) >= 0){
                     $('.connectedSortables').sortable('cancel');
                    list.sortable('cancel');
                    var navItemsIdsAux = this.props.navItemsIds;
                    var parent = this.props.navItems[this.props.navItemSelected].parent;
                    var newIndexesIds = navItemsIdsAux;
                    var part1 = newIndexesIds.slice(0,navItemsIdsAux.indexOf(parent)+1);
                    var part2 = newIndexesIds.slice(navItemsIdsAux.indexOf(parent)+newChilds.length+1);
                    newIndexesIds = part1.concat(newChilds,part2);
                    console.log("desde una seccion a si misma: caso 3; hace cosas");
                    console.log("LANZA 3")
                    this.props.onNavItemReorded(this.props.navItemSelected, this.props.id,3,newIndexesIds,newChilds); 
                }else{
                    console.log("desde SecA a SecB: caso 2; desde sec a exterior: caso 4; por lo que no hace nada");
                }       
            }.bind(this),
            receive: (event, ui) => {
               
                //con esto sacamos la id de la sección que recibe
                const id = this.props.id;
                //Id del elemento seleccionado
                const selec = this.props.navItemSelected;
                //Id del padre del elemento seleccionado para saber de que seccion viene o del carrouselList
                const parent = this.props.navItems[this.props.navItemSelected].parent;
                //Nuevo orden de la sección con la react-id y la id
                const reorderedIndexesR = list.sortable('toArray', {attribute: 'data-reactid'});
                const reorderedIndexesId = list.sortable('toArray', {attribute: 'id'})
                const previos = this.props.navItemsIds;
                
                $('.connectedSortables').sortable('cancel');
                //list.sortable('cancel');

                //console.log(reorderedIndexesId);
                const indexesR = reorderedIndexesR.map(el => el.split('$').pop() ) //******* Saca el ultimo indice de la REac ID
              
                console.log("************Variables**************Receive Section")
                console.log("id de la seccion que recibe", this.props.id);
                console.log("id del elemento seleccionado", this.props.navItemSelected);
                console.log("id del padre del elemento seleccioando", this.props.navItems[this.props.navItemSelected].parent);
                console.log("Nuevos hisjos de la seccion que recibe", reorderedIndexesId);
                console.log("Antiguos hijos de la seccion que recibe",  this.props.navItems[this.props.id].children)
                console.log("Antiguos hijos de la antigua seccion padre ", this.props.navItems[this.props.navItems[this.props.navItemSelected].parent].children)
                console.log("Todos los antiguos",previos)
                console.log("**************************************************")
               
                var index = 0;
                  var newIndexesIds = [];             
              //  var newChildrenInOrder = reorderedIndexesId;
                if(parent !== id){
                    if(parent == 0){ //Con esto compruebo si viene de fuera
                       
                        var newIndexesIds = [];             
                        var newChildrenInOrder = reorderedIndexesId;
                        var selectedAndChildren = [selec];
                        var levelSelected = this.props.navItems[selec].level;
                        var positionSelected = this.props.navItems[selec].position;

                        //Con este bucle cogemos el seleccionado y a todos los que cuelgan de el
                        for(var i = positionSelected+1; i< previos.length; i++){
                            if( this.props.navItems[previos[i]].level <= levelSelected){
                                break;
                              }else{
                                selectedAndChildren.push(previos[i]);
                            }
                        }
                          console.log("selectedAndChildren",selectedAndChildren)

                        //Voy a concatenar los indexes, quitando la parte del seleccionado con sus hijos
                        var part1 = previos.slice(0,previos.indexOf(selec));
                        var part2 = previos.slice(previos.indexOf(selec)+selectedAndChildren.length);
                        var concatA = part1.concat(part2);
                        console.log("concatA",concatA);

                        if(newChildrenInOrder.length > 1){//tiene nuevos hermanos
                            if(newChildrenInOrder.indexOf(selec) >= newChildrenInOrder.length -1){ //Es el ultimo de los nuevos hijos
                                console.log("es el último de los nuevos hijos")
                                var auxNextElementIndex;
                                //Level del padre hasta el siguiente ocn ese level dentro de los concatA si no existe.... significa que es el ultimo y concatenamos al final
                                for(var j = concatA.indexOf(parent)+1; j<concatA.length; j++){
                                    if(this.props.navItems[concatA[j]].level <= this.props.navItems[parent].level){
                                        auxNextElementIndex = j;
                                        break;
                                      }else{
                                    }
                                }

                                if(auxNextElementIndex){
                                    console.log("Es el ultimo de los nuevos hijos pero el padre tiene hermanos");
                                    var part1b = concatA.slice(0, auxNextElementIndex);
                                    var part2b = concatA.slice(auxNextElementIndex);
                                    newIndexesIds = part1b.concat(selectedAndChildren,part2b);
                                  }else{
                                    console.log("Es el ultimo ultimo");
                                    newIndexesIds = concatA.concat(selectedAndChildren);
                                }  
                              }else{//significa que tiene más hermanos y no es el único [*,0] [*,0,0] [0,*,0]
                                //cogiendo y colocandolo siempre delante del siguiente debería de valer
                                var part1b = concatA.slice(0, concatA.indexOf(newChildrenInOrder[newChildrenInOrder.indexOf(selec)+1]));
                                var part2b = concatA.slice(concatA.indexOf(newChildrenInOrder[newChildrenInOrder.indexOf(selec)+1]));
                                newIndexesIds = part1b.concat(selectedAndChildren,part2b);
                            }
                          }else{//es el único nuevo hijo no tiene nuevos hermanos
                            var part1b = concatA.slice(0, concatA.indexOf(id));
                            var part2b = concatA.slice(concatA.indexOf(id));
                            newIndexesIds = part1b.concat(selectedAndChildren,part2b);
                            //Lo colocamos inmediatamente después del nuevo padre
                        }

                        console.log("newIndexesIds",newIndexesIds)
                        this.props.onNavItemReorded(this.props.navItemSelected, this.props.id,1,newIndexesIds,reorderedIndexesId);

                }else{//Viene de otra seccion
                    const navIdemsA = this.props.navItems;
                    newIndexesIds = this.props.navItems[id].children; //*******
                    const levelrec = this.props.navItems[id].level;
                    var auxTerSplit = []
                    var indN = "0";
                    var newChildrenInOrder = []; //*******

                    var tryLater = [];
                    var flagFind = 0;
                    var elemFinded = "";
                    var elemFindedIndx = 0;

                    for(var t = 0; t < reorderedIndexesR.length; t++){ //*******
                        auxTerSplit = reorderedIndexesR[t].split('$'); //*******

                        if(auxTerSplit.length !== levelrec+2 ){ //*******
                            indN = t;
                            elemFindedIndx  = t;
                            elemFinded = this.props.navItemSelected;
                            flagFind = 1;
                            break;
                        }else{
                            tryLater.push(auxTerSplit); //*******
                        }
                    }

                    var auxArray = [];
                    if(flagFind > 0){
                    }else{
                      
                        for(var t = 0; t < tryLater.length; t++){ //*******
                            auxArray = navIdemsA[0];//.children;

                            flagFind = 0;
                            for(var j = 1; j < tryLater[t].length-1; j++){ //*******

                                auxArray = navIdemsA[auxArray.children[tryLater[t][j].split('.')[0]]]; //*******

                                if(auxArray.id == id){
                                    console.log("Ha encontrado el padre")
                                    flagFind  = 1;
                                }

                            }
                            if(flagFind < 1){

                                elemFindedIndx = t;
                                elemFinded = auxArray.children[tryLater[t][tryLater[t].length-1]] //*******
                                break;
                            }
                            
                        }

                    }

                    auxArray = navIdemsA[id].children;
                    auxArray.splice(elemFindedIndx,0,elemFinded); //*******
                    newChildrenInOrder = auxArray;

                    newIndexesIds = this.props.navItemsIds;
                    newIndexesIds.splice(newIndexesIds.indexOf(elemFinded),1); //*******
                    var part2 = newIndexesIds.slice(newIndexesIds.indexOf(this.props.id)+auxArray.length) //*******
                    var part1 = newIndexesIds.slice(0, newIndexesIds.indexOf(this.props.id)+1) //*******

                    var newIndexesIds = part1.concat(auxArray,part2); //*******
                    console.log("LANZA 2")
                    this.props.onNavItemReorded(this.props.navItemSelected, this.props.id,2,newIndexesIds,newChildrenInOrder); //*******
                }
            }else{
            }
            
            //event.stopImmediatePropagation();
        }.bind(this)
    }).bind(this);


}

}
