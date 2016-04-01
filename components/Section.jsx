import React, {Component} from 'react';
import {Button} from 'react-bootstrap';
import {ID_PREFIX_SECTION, ID_PREFIX_PAGE} from '../constants';

export default class Section extends Component {
    render() {
        let navItem = this.props.navItems[this.props.id];

         let classSelected = this.props.navItemSelected === navItem.id ? 'selected' : 'notSelected';
        return (
            <div  className="drag-handle" onMouseDown={e => {
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
                    <div ref="sortableListS" className="sectionList connectedSortables">
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
                                    return <h4 key={index} className={classSelected} onMouseDown={e => {
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
                console.log("mueve desde Seccion");

                const reorderedIndexes = list.sortable('toArray', {attribute: 'data-reactid'}) // Obtiene la nueva disposición de los elementos
                const indexes = reorderedIndexes.map(el => el.split('$').pop() )
                console.log(indexes);

                var oldChilds = this.props.navItems[this.props.id].children;
                var newChilds = [];

                indexes.forEach(index => {
                    newChilds.push(oldChilds[indexes]);

                });
                console.log(oldChilds);
                console.log(newChilds);

                if( newChilds.indexOf(this.props.navItemSelected) > 0){
                    console.log("indexOF",newChilds.indexOf(this.props.navItemSelected) )
                    console.log("id", this.props.id);
                    console.log("parent", this.props.navItems[this.props.navItemSelected].parent);
                    console.log("selec", this.props.navItemSelected)
                    
                    console.log("desde una seccion a si misma: caso 3; hace cosas");
      
                    this.props.onNavItemReorded(indexes, this.props.navItems[this.props.navItemSelected].parent,3,1) // Cambia el estado pasando como parámetro el id del sortable y el nuevo orden de los elementos. Ahora el orden también se puede UNDO y REDO
                  }else{
                    console.log("desde SecA a SecB: caso 2; desde sec a exterior: caso 4; por lo que no hace nada");
                }       
        }.bind(this),
        receive: function(event, ui) {
             list.sortable('cancel');
             /*console.log(this.props.navItems);
            console.log("receive S, llegan a una sección");
            console.log(this); 
            console.log("id",this.props.id);
            console.log( "parent-id",this.props.navItems[this.props.navItemSelected].parent);*/

            const id = this.props.id;
            const selec = this.props.navItemSelected;
            const parent = this.props.navItems[this.props.navItemSelected].parent;
            const reorderedIndexesR = list.sortable('toArray', {attribute: 'data-reactid'}) // Obtiene la nueva disposición de los elementos
            const indexesR = reorderedIndexesR.map(el => el.split('$').pop() )
            console.log(reorderedIndexesR);
            console.log(indexesR);

            console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$44");
            console.log("id", id);
            console.log("hijitos", this.props.navItems[id].children);

                        /////Falta hacer un array de childres del seleccionado para concatenarlo!!!
                        ///Y calcularlo en su contexto respecto al padre de todos y meterlo(el calculado segmentado) ahi!!!
                        // de todos meter en el indice del id de este this el array de hijos nuevos calculados elminando el numero de hijos previos.
                        //Inserccion con eliminacion vale splice
                        //Tmbien debemos ocmprobar si el id tiene un padre que no es 0 e iterar....


            console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$44");

            var index = 0;
            var newIndexesIds = [];
            if(parent !== id){
                console.log("viene de fuera o de otra seccion");
                if(parent == 0){
                    console.log("viene del exterior: caso1, hago cosas");
                    /*reorderedIndexesR.forEach(i =>   {
                        console.log("tam", i.split('$').length);
                        if(i.split('$').length == 2){
                            console.log("indice",i);
                            console.log(index);
                        }
                    });*/
                    newIndexesIds = this.props.navItems[id].children;
                   reorderedIndexesR.forEach(function (el,indx,newIds){
                        if(el.split('$').length == 2){
                            index = indx;
                            newIndexesIds.splice(indx,0,selec);
                               console.log(newIndexesIds);
                        }
                    });
                   console.log("%%%%%%%%%%%%%%5")
                   console.log("New indices",newIndexesIds);
                   console.log("idNewPArent", this.props.id);
                   console.log("elSelectet", this.props.navItemSelected)
                   console.log("previos", this.props.navItemsIds)
                   const previos = this.props.navItemsIds;
                   console.log("index",previos.indexOf(this.props.id));
                    console.log("indexQuitar",previos.indexOf(this.props.navItemSelected));
                    var auxPre = previos;
                    auxPre.splice(auxPre.indexOf(this.props.navItemSelected),1);
                    console.log("auxPRE",auxPre);
                    console.log("previos",previos);
                    var part2 = auxPre.slice(auxPre.indexOf(this.props.id)+newIndexesIds.length);
                    var part1 = auxPre.slice(0,auxPre.indexOf(this.props.id)+1);
                    console.log("part2", part2)
                    console.log("part1", part1)
                    var newIdsT = part1.concat(newIndexesIds,part2);
                    console.log(newIdsT);
                    this.props.onNavItemReorded(indexesR, this.props.navItems[selec].parent,1,newIdsT);
                }else{
                    console.log("viene de otra seccion: caso2, hago cosas");

                    console.log("idNewPArent", this.props.id);
                    console.log("elSelectet", this.props.navItemSelected)
                    console.log("previos", this.props.navItemsIds)
                    console.log("parent", this.props.navItems[this.props.navItemSelected].parent)
                    console.log("ELbuenIndex0", this.props.navItems[this.props.navItems[this.props.id].parent].children.indexOf(this.props.id));


                    ///Buscar el padre del elemento el indice

                    //si el primer elemento del penultimo del slice de la data-react-id es el indice
                    // de this.id dentro de los child de su parent entonces esque ya estaban si no es que vienen desde fuera

                //Hay un caso que colisiona
                    /*
                    sec1
                        pag1
                    sec2
                        sec2.1
                            pag2
                            */

                //lo hacmeos iterando desde el final si es diferente sabemos que lo cumple si es igual vamos al siguiente nivel hasta que lleguemos al padre o sea diferente
                    const navIdemsA = this.props.navItems;
                    newIndexesIds = this.props.navItems[id].children;
                    const levelrec = this.props.navItems[id].level;
                    console.log("LEVEL PARENTE", levelrec);
                    var auxTerSplit = []
                    var indN = "0";
                   // const parentReactId = sortable.('toString', {attribute: 'data-reactid'}) 
                   // console.log("ReactIdPArent", parentReactId);
                    //console.log(this._rea);

               /*     reorderedIndexesR.forEach(function (el,indx,newIds){
                        console.log(el);
                        auxTerSplit = el.split('$');
                        console.log(auxTerSplit);
                        if(auxTerSplit.length !== levelrec+2 ){
                            console.log("es el de fijo");
                            indN = indx;
                        }else{
                            console.log("con mirar el penultimo deberia valer");
                            auxTerSplit.pop();
                            var auxPop = auxTerSplit;

                          /*  console.log(auxTerSplit);
                            auxTerSplit.pop();
                            var auxPop = auxTerSplit;
                            for(var t = auxPop.length-1; t > 0; t--){
                                console.log("camino",t,"a ver", auxPop[t].split('.')[0]);
                                console.log(auxPop);
                            }*/
                     //   }
                       
                       
                       /* console.log("Indiceop",auxTerSplit[auxTerSplit.length-1].split('.')[0]);
                        //auxTerSplit = 
                        console.log("poperado", auxTerSplit);
                        if(el.split('$').length == 2){
                            console.log("EL",el);
                            index = indx;
                            newIndexesIds.splice(indx,0,selec);
                               console.log(newIndexesIds);
                        }*/
                  //  });*/
                    
                    var tryLater = [];
                    var flagFind = 0;
                    var elemFinded = "";
                    var elemFindedIndx = 0;
                    for(var t = 0; t < reorderedIndexesR.length; t++){
                        console.log(reorderedIndexesR[t]);
                        auxTerSplit = reorderedIndexesR[t].split('$');
                        console.log(auxTerSplit);

                         if(auxTerSplit.length !== levelrec+2 ){
                            console.log("es el de fijo");
                            indN = t;
                            elemFindedIndx  = t;
                            elemFinded = this.props.navItemSelected;
                            flagFind = 1;
                            break;
                        }else{
                            console.log("con mirar el penultimo deberia valer");

                            tryLater.push(auxTerSplit);
                           // auxTerSplit.pop();
                           // var auxPop = auxTerSplit;
                        }
                    }
                    var auxArray = [];
                    if(flagFind > 0){
                        console.log("ya se encontro no hace falta seguir iterando");
                    }else{
                        console.log("es una pena pero debemos seguir iterando")
                        //console.log(tryLater);
                       

                        for(var t = 0; t < tryLater.length; t++){
                            auxArray = navIdemsA[0];//.children;
                           // console.log(navIdemsA);
                            flagFind = 0;
                            for(var j = 1; j < tryLater[t].length-1; j++){
                              //  console.log( tryLater[t][j]);

                              //  console.log( tryLater[t][j].split('.')[0])
                              //  console.log("estamos",auxArray.children[tryLater[t][j].split('.')[0]]);
                                auxArray = navIdemsA[auxArray.children[tryLater[t][j].split('.')[0]]];

                                if(auxArray.id == id){
                                    console.log("Ha encontrado el padre")
                                    flagFind  = 1;
                                }
                                //auxArray = navIdemsA[auxArray.children[tryLater[t][j].split('.')[0]]];
                               // console.log("auxArray",auxArray);
                               // auxArray = auxArray[ tryLater[t][j].split('.')[0]];
                               // console.log("auxArray",auxArray);
                               // console.log(navIdemsA[auxArray]);
                            }
                            if(flagFind < 1){
                                console.log("este es el que buscamos")
                                console.log(auxArray);
                                console.log(tryLater[t][tryLater[t].length]);
                                console.log(auxArray.children[tryLater[t][tryLater[t].length-1]])
                                elemFindedIndx = t;
                                elemFinded = auxArray.children[tryLater[t][tryLater[t].length-1]]
                                break;
                            }
                          //  if(flagFind < 1){

                            //}

                            /*console.log(tryLater[t]);
                            if(t == 0){
                                auxArray = navIdemsA
                            }*/
                        }




                    }


                        console.log("buscadoIndex",elemFindedIndx);
                        console.log("Buscado",elemFinded);

                        console.log("vamos a sacar todos los elementos hijos");
                       
                       /* reorderedIndexesR.forEach( function(ele,index, ){
                            console.log("tam", i.split('$').length);
                            if(i.split('$').length == 2){
                                console.log("indice",i);
                                console.log(index);
                            }
                        });*/

                        /*reorderedIndexesR.forEach(function (el,indx,newIds){
                          console.log(indx)
                          if(indx == elemFindedIndx){
                            console.log("index del elemento buscado");
                          }else{
                            console.log("no es el index");
                          }
                        });*/
                        console.log(navIdemsA[id].children);
                        auxArray = navIdemsA[id].children;
                        auxArray.splice(elemFindedIndx,0,elemFinded);
                        console.log("metemos", elemFinded)
                        console.log(auxArray);

                        //Ahora cogemos del array de childs viejos y
                        console.log("====================")
                        newIndexesIds = this.props.navItemsIds;
                        newIndexesIds.splice(newIndexesIds.indexOf(elemFinded),1);
                        var part2 = newIndexesIds.slice(newIndexesIds.indexOf(this.props.id)+auxArray.length)
                        var part1 = newIndexesIds.slice(0, newIndexesIds.indexOf(this.props.id)+1)
                           console.log("part2", part2)
                    console.log("part1", part1)
                    var newIndexesIds = part1.concat(auxArray,part2);
//*/
                    //No se debe usar forEach porque debemos romper
                  /*     
                     auxPre.splice(auxPre.indexOf(this.props.navItemSelected),1);
                    console.log("auxPRE",auxPre);
                    console.log("previos",previos); 
                    var part2 = auxPre.slice(auxPre.indexOf(this.props.id)+newIndexesIds.length);
                    var part1 = auxPre.slice(0,auxPre.indexOf(this.props.id)+1);
                    console.log("part2", part2)
                    console.log("part1", part1)
                    var newIdsT = part1.concat(newIndexesIds,part2);
*/
                
                    console.log("New indices",newIndexesIds);
                    this.props.onNavItemReorded(indexesR, this.props.navItems[selec].parent,2,newIndexesIds);


                }
            }else{
                console.log("viene de si misma: caso3 no hacemos nada");
            }
            
          event.stopImmediatePropagation();
        }.bind(this)
    }).bind(this);


}

}
