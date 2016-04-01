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
                    console.log("viene del exterior: caso1");
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
                   console.log(newIndexesIds);

                    this.props.onNavItemReorded(indexesR, this.props.navItems[selec].parent,1,newIndexesIds);
                }else{
                    console.log("viene de otra seccion: caso2");
                }
            }else{
                console.log("viene de si misma: caso3 no hacemos nada");
            }
            
          event.stopImmediatePropagation();
        }.bind(this)
    }).bind(this);


}

}
