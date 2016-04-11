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
                const reorderedIndexes = list.sortable('toArray', {attribute: 'data-reactid'}) // Obtiene la nueva disposición de los elementos
                const reorderedIndexesId = list.sortable('toArray', {attribute: 'id'})
                console.log(reorderedIndexesId);
                const indexes = reorderedIndexes.map(el => el.split('$').pop() )
            
                var oldChilds = this.props.navItems[this.props.id].children;
                var newChilds = [];

                indexes.forEach(index => {
                    newChilds.push(oldChilds[index]);
                });

                if( newChilds.indexOf(this.props.navItemSelected) > 0){
                     $('.connectedSortables').sortable('cancel');
                list.sortable('cancel');
                    var navItemsIdsAux = this.props.navItemsIds;
                    var parent = this.props.navItems[this.props.navItemSelected].parent;
                    var newIndexesIds = navItemsIdsAux;
                    var part1 = newIndexesIds.slice(0,navItemsIdsAux.indexOf(parent)+1);
                    var part2 = newIndexesIds.slice(navItemsIdsAux.indexOf(parent)+newChilds.length+1);
                    newIndexesIds = part1.concat(newChilds,part2);
                    console.log("desde una seccion a si misma: caso 3; hace cosas");
                    
                    this.props.onNavItemReorded(this.props.navItemSelected, this.props.id,3,newIndexesIds,newChilds) // Cambia el estado pasando como parámetro el id del sortable y el nuevo orden de los elementos. Ahora el orden también se puede UNDO y REDO
                }else{
                    console.log("desde SecA a SecB: caso 2; desde sec a exterior: caso 4; por lo que no hace nada");
                }       
            }.bind(this),
            receive: (event, ui) => {
               

                const id = this.props.id;
                const selec = this.props.navItemSelected;
                const parent = this.props.navItems[this.props.navItemSelected].parent;
                const reorderedIndexesR = list.sortable('toArray', {attribute: 'data-reactid'}) // Obtiene la nueva disposición de los elementos
                const reorderedIndexesId = list.sortable('toArray', {attribute: 'id'})
                console.log(reorderedIndexesId);
                const indexesR = reorderedIndexesR.map(el => el.split('$').pop() )
              
               

                var index = 0;
                var newIndexesIds = [];
                var newChildrenInOrder = [];
                if(parent !== id){
                       $('.connectedSortables').sortable('cancel');
                list.sortable('cancel');
                    if(parent == 0){
                        newIndexesIds = this.props.navItems[id].children;
                        reorderedIndexesR.forEach(function (el,indx,newIds){
                            if(el.split('$').length == 2){
                                index = indx;
                                newIndexesIds.splice(indx,0,selec);
                            }
                        });

                    newChildrenInOrder = newIndexesIds;
                    const previos = this.props.navItemsIds;

                    var auxPre = previos;
                    auxPre.splice(auxPre.indexOf(this.props.navItemSelected),1);

                    var part2 = auxPre.slice(auxPre.indexOf(this.props.id)+newIndexesIds.length);
                    var part1 = auxPre.slice(0,auxPre.indexOf(this.props.id)+1);

                    var newIdsT = part1.concat(newIndexesIds,part2);

                    this.props.onNavItemReorded(this.props.navItemSelected, this.props.id,1,newIdsT,newChildrenInOrder);
                }else{
                    const navIdemsA = this.props.navItems;
                    newIndexesIds = this.props.navItems[id].children;
                    const levelrec = this.props.navItems[id].level;
                    var auxTerSplit = []
                    var indN = "0";
                    var newChildrenInOrder = [];

                    var tryLater = [];
                    var flagFind = 0;
                    var elemFinded = "";
                    var elemFindedIndx = 0;
                    for(var t = 0; t < reorderedIndexesR.length; t++){
                        auxTerSplit = reorderedIndexesR[t].split('$');

                        if(auxTerSplit.length !== levelrec+2 ){
                            indN = t;
                            elemFindedIndx  = t;
                            elemFinded = this.props.navItemSelected;
                            flagFind = 1;
                            break;
                        }else{
                            tryLater.push(auxTerSplit);
                        }
                    }
                    var auxArray = [];
                    if(flagFind > 0){
                    }else{
                      
                        for(var t = 0; t < tryLater.length; t++){
                            auxArray = navIdemsA[0];//.children;

                            flagFind = 0;
                            for(var j = 1; j < tryLater[t].length-1; j++){

                                auxArray = navIdemsA[auxArray.children[tryLater[t][j].split('.')[0]]];

                                if(auxArray.id == id){
                                    console.log("Ha encontrado el padre")
                                    flagFind  = 1;
                                }

                            }
                            if(flagFind < 1){

                                elemFindedIndx = t;
                                elemFinded = auxArray.children[tryLater[t][tryLater[t].length-1]]
                                break;
                            }
                            
                        }

                    }

                    auxArray = navIdemsA[id].children;
                    auxArray.splice(elemFindedIndx,0,elemFinded);
                    newChildrenInOrder = auxArray;

                    newIndexesIds = this.props.navItemsIds;
                    newIndexesIds.splice(newIndexesIds.indexOf(elemFinded),1);
                    var part2 = newIndexesIds.slice(newIndexesIds.indexOf(this.props.id)+auxArray.length)
                    var part1 = newIndexesIds.slice(0, newIndexesIds.indexOf(this.props.id)+1)

                    var newIndexesIds = part1.concat(auxArray,part2);

                    this.props.onNavItemReorded(this.props.navItemSelected, this.props.id,2,newIndexesIds,newChildrenInOrder);
                }
            }else{
            }
            
            event.stopImmediatePropagation();
        }.bind(this)
    }).bind(this);


}

}
