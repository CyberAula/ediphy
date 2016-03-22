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

                <h3 className={classSelected} style={{ display: 'inline'}}><span className="fa fa-bars drag-handle"></span>{navItem.name}</h3>
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
                                    }}><span className="fa fa-bars drag-handle dragS"></span>{this.props.navItems[id].name}</h4>;
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
            update: (event, ui) => {
                console.log("atra");
           //console.log(this.refs.sortableListS.attributes[1])
           //console.log("Section")
           //console.log(ui);
           //console.log("Section")
           //console.log(event);
            const reorderedIndexes = list.sortable('toArray', {attribute: 'data-reactid'}) // Obtiene la nueva disposición de los elementos
            //console.log(reorderedIndexes);
            const indexes = reorderedIndexes.map(el => el.split('$').pop() )
            /*var indexesA = reorderedIndexes.map(el => el.split('$'))

            indexesA = indexesA[0];
            indexesA.pop()
            console.log("del que parte")
            console.log(indexesA.pop())*/
            //console.log(event)
                //el.split('$')[2]) //Coge solo la parte que indica el orden
            //list.sortable('cancel') //Evita que se reordenen para que gestione la llamada Redux
            //console.log(this.props.navItems)
            //console.log(reorderedIndexes)
            //console.log(indexes)
            //console.log("items")
            //console.log(this.props.navItems[this.props.navItemSelected].parent)
            
            this.props.onNavItemReorded(indexes, this.props.navItems[this.props.navItemSelected].parent) // Cambia el estado pasando como parámetro el id del sortable y el nuevo orden de los elementos. Ahora el orden también se puede UNDO y REDO
        },
        receive: function(event, ui) {
            console.log("receive")
            //console.log(event)
            const reorderedIndexes = list.sortable('toArray', {attribute: 'data-reactid'}) 
            console.log(reorderedIndexes)
        }
    });


}

}
