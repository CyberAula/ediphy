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
               

                const id = this.props.id; //Id del elemento que recibe
                const selec = this.props.navItemSelected; //Id del elemento seleccionado
                const parent = this.props.navItems[this.props.navItemSelected].parent; //id del padre del elemento seleccionado
                const reorderedIndexesR = list.sortable('toArray', {attribute: 'data-reactid'}); //******* Obtiene la nueva disposición de los elementos por R.id
                const reorderedIndexesId = list.sortable('toArray', {attribute: 'id'}) // Obtiene la nueva disposición por id
                $('.connectedSortables').sortable('cancel');
                list.sortable('cancel');

                console.log(reorderedIndexesId);
                const indexesR = reorderedIndexesR.map(el => el.split('$').pop() ) //******* Saca el ultimo indice de la REac ID
              
                console.log("************Variables**************Receive Section")
                console.log("id", this.props.id);
                console.log("selected", this.props.navItemSelected);
                console.log("parentSelected", this.props.navItems[this.props.navItemSelected].parent);
                console.log("nuevos elementos hijos de ID", reorderedIndexesId);
                console.log("Antiguos hijos de Id",  this.props.navItems[this.props.id].children)
                console.log("antiguos hijos del padre", this.props.navItems[this.props.navItems[this.props.navItemSelected].parent].children)
                console.log("**************************************************")
               

                var index = 0;
                var newIndexesIds = [];
                var newChildrenInOrder = [];
               

                if(parent !== id){
                
                    
                    if(parent == 0){
                        newIndexesIds = this.props.navItems[id].children;
                          console.log("newIndexesIds",newIndexesIds);
                          console.log("newReordedIndexesIds",reorderedIndexesId);
                          console.log("index con OF", reorderedIndexesId.indexOf(selec));
                        //newChildrenInOrder = newIndexesIds; //*******
                        newChildrenInOrder = reorderedIndexesId;
                        const previos = this.props.navItemsIds;
                          console.log("ALL", this.props.navItemsIds);

                        var hijosSelected = [selec];
                        var levelSelected = this.props.navItems[selec].level;
                        var positionSelected = this.props.navItems[selec].position;
                        var nextID;
                        //Con este bucle cogemos el seleccionado y a todos los que cuelgan de el
                        for(var i = positionSelected+1; i< previos.length; i++){
                            if( this.props.navItems[previos[i]].level <= levelSelected){
                                nextID = i;
                                break;
                            }else{
                                hijosSelected.push(previos[i]);
                            }
                        }
                          console.log("hijosSelected",hijosSelected)
                          console.log("nextID",nextID) //El valor de nexId nos da el valor del siguiente elemento 
                        if(nextID){
                            console.log("nexEL",previos[nextID])
                        }else{ //no existe y seria el ultimo
                            console.log("ultimo")
                        }
                        //Ahora tengo que comprobar cual es el sigueitne con un bucle operando igual.
                        //En nuevos hijos ver si es el ultimo o está en medio si esta en medio se coge el siguiente elemento y se ve su posición para oclocarlo en el lugar previo. 
                        //si es el ultimo se ve si es el final o se coge el sigueinte hermano del padre
                          console.log(reorderedIndexesId.indexOf(selec))
                          console.log(reorderedIndexesId.length)


                        console.log("previos", previos)
                        var auxPre = previos;
                        var part1 = auxPre.slice(0, positionSelected);
                        var part2 = auxPre.slice(positionSelected + hijosSelected.length);
                        console.log("part1", part1)

                        auxPre = part1.concat(part2);

                        console.log("auxPre", auxPre);
                        var newIdsT = part1.concat(part2);
                        console.log("Sin hijos selec", newIdsT)

                        var nextElemnIndex = 0;
                        var part1b;
                        var part2b;

                        if(reorderedIndexesId.indexOf(selec) < reorderedIndexesId.length-1){
                            console.log("no es el ultimo nuevo hijo");
                            console.log(reorderedIndexesId)
                            console.log("el elemento",reorderedIndexesId[reorderedIndexesId.indexOf(selec)+1])
                            nextElemnIndex = newIdsT.indexOf(reorderedIndexesId[reorderedIndexesId.indexOf(selec)+1]);
                            part1b = newIdsT.slice(0, nextElemnIndex);
                            part2b = newIdsT.slice(nextElemnIndex);
                            console.log("antes",newIdsT);
                            newIdsT = part1b.concat(hijosSelected, part2b);
                            console.log("despues",newIdsT);



                        }else{
                            console.log("es el ultimo nuevo hijo");
                            if(reorderedIndexesId.length == 1){
                                console.log("es el unico")
                                console.log("el elemto", this.props.navItems[this.props.navItemSelected].parent)
                            }else{
                                console.log("es el ultimo de varios")
                                //Falta hacer este caso
                            }
                        }

                        // con estos de aqui arriba del elemento sabemos donde tenemos que meterlo dentro del concat auxPre de abajo


                        //coger hasta el previo al seleccionado
                        //coger desde el ultimo hijo al siguiente
                        //quitar los hijos
                     


                      //  auxPre.splice(auxPre.indexOf(this.props.navItemSelected),1); //**
                      //  console.log("auxPre", auxPre) //**

                        //var 
                      //  part2 = auxPre.slice(auxPre.indexOf(this.props.id)+newIndexesIds.length); //**
                        //var
                       //  part1 = auxPre.slice(0,auxPre.indexOf(this.props.id)+1+reorderedIndexesId.indexOf(selec)); //**
                       // console.log("part2", part2) //**
                       // console.log("part1", part1) //**

                       //  console.log("newIndexesIds", newIndexesIds)

    //¿¿¿¿?????         var newIdsT = part1.concat(selec,part2); //**
                      //  console.log("newIdsT", newIdsT) //**

                       // console.log("LANZA 1")
                        //this.props.onNavItemReorded(this.props.navItemSelected, this.props.id,1,newIdsT,newChildrenInOrder); //*******
                        this.props.onNavItemReorded(this.props.navItemSelected, this.props.id,1,newIdsT,reorderedIndexesId); //*******

                }else{
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
            
            event.stopImmediatePropagation();
        }.bind(this)
    }).bind(this);


}

}
