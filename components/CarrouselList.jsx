import React, {Component} from 'react';
import {Button, ButtonGroup, Col, OverlayTrigger, Popover} from 'react-bootstrap';
import {ID_PREFIX_SECTION, ID_PREFIX_PAGE, ID_PREFIX_SORTABLE_BOX, BOX_TYPES} from '../constants';
import Section from '../components/Section';
import PageMenu from '../components/PageMenu';
import DaliIndexTitle from '../components/DaliIndexTitle';

export default class CarrouselList extends Component {
    render() {
        return (
            /* jshint ignore:start */
            <div style={{height: 'calc(100% - 25px)'}}>
                <div ref="sortableList" className="carList connectedSortables">
                    {
                        this.props.navItems[0].children.map((id, index) => {
                            if (id.indexOf(ID_PREFIX_SECTION) !== -1) {
                                return <Section id={id}
                                                key={index}
                                                navItemsIds={this.props.navItemsIds}
                                                navItems={this.props.navItems}
                                                navItemSelected={this.props.navItemSelected}
                                                onPageAdded={this.props.onPageAdded}
                                                onTitleChange={this.props.onTitleChange}
                                                onSectionAdded={this.props.onSectionAdded}
                                                onBoxAdded={this.props.onBoxAdded}
                                                onNavItemSelected={this.props.onNavItemSelected}
                                                onNavItemExpanded={this.props.onNavItemExpanded}
                                                onNavItemReorded={this.props.onNavItemReorded}/>;
                            } else if (id.indexOf(ID_PREFIX_PAGE) !== -1) {
                                let classSelected = (this.props.navItemSelected === id) ? 'selected drag-handle' : 'notSelected drag-handle';
                                return <h4 key={index}
                                           id={id}
                                           className={'navItemBlock ' +classSelected}
                                           onMouseDown={e => {
                                                    this.props.onNavItemSelected(id);
                                                    e.stopPropagation();
                                               }}>
                                        <span style={{marginLeft: 20*(this.props.navItems[id].level-1)}}>
                                            <i className="material-icons fileIcon">insert_drive_file</i>   <DaliIndexTitle
                                            id={id} title={this.props.navItems[id].name}
                                            onTitleChange={this.props.onTitleChange}/></span>
                                </h4>


                            }
                        })}
                </div>
                <div style={{width: '100%', borderTop: '1px solid grey', marginTop: '0px'}}>
                    <Button className="carrouselButton" onClick={e => {
                                    let idnuevo = ID_PREFIX_SECTION + Date.now();
                                    this.props.onSectionAdded(idnuevo, "Section "+this.sections(), 0, [], 1, 'section', this.props.navItemsIds.length+1, 'expanded');
                                    this.props.onBoxAdded({parent: idnuevo, container: 0, id: ID_PREFIX_SORTABLE_BOX + Date.now()}, BOX_TYPES.SORTABLE, false, false);
                                    e.stopPropagation();
                                }}>
                        <i className="material-icons">create_new_folder</i>
                    </Button>

                    <PageMenu caller={0}
                              navItems={this.props.navItems}
                              navItemSelected={this.props.navItemSelected}
                              navItemsIds={this.props.navItemsIds}
                              onBoxAdded={this.props.onBoxAdded}
                              onPageAdded={this.props.onSectionAdded}/>

                    <OverlayTrigger trigger={["click", "focus"]} placement="top" overlay={
                        <Popover id="popov" title="Eliminar página">
                            <i style={{color: 'yellow', fontSize: '13px'}} className="material-icons">warning</i> Esta acción borrará todo el contenido de la página.<br/>
                                <Button className="popoverButton" 
                                    disabled={this.props.navItemSelected === 0}
                                    style={{float: 'right'}}
                                    onClick={(e) => {
                                                let ids = [this.props.navItemSelected];
                                                let found = this.findChildren(ids);
                                                let boxes = this.findBoxes(found);
                                                this.props.onNavItemRemoved(ids, this.props.navItems[this.props.navItemSelected].parent, boxes );
                                            }
                                        }>
                                    Aceptar
                                </Button>
                                <Button className="popoverButton" 
                                    disabled={this.props.navItemSelected === 0}
                                    style={{float: 'right'}}  >
                                    Cancelar
                                </Button>          

                         </Popover>}>


                        <Button className="carrouselButton"
                                disabled={this.props.navItemSelected === 0}
                                style={{float: 'right'}}>
                            <i className="material-icons">delete</i>
                        </Button>

                    </OverlayTrigger>
                </div>
            </div>
            /* jshint ignore:end */
        );
    }

    findChildren(ids) {
        //We want to get all the items whose level is higher than the selected starting after it
        let level = this.props.navItems[ids[0]].level;
        let startingIndex = this.props.navItemsIds.indexOf(ids[0]) + 1;
        for (var i = startingIndex; i < this.props.navItemsIds.length; i++) {
            if (this.props.navItems[this.props.navItemsIds[i]].level > level) {
                ids.push(this.props.navItemsIds[i]);
            } else {
                break;
            }
        }
        return ids;

    }

    sections() {
        var current = 1;
        for (let i in this.props.navItemsIds) {

            if (this.props.navItemsIds[i].indexOf(ID_PREFIX_SECTION) !== -1) {
                current++;
            }
        }
        return current;
    }


    findBoxes(ids) {
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

    getBoxDescendants(box) {
        let selected = [];

        if (box.children) {
            for (let i = 0; i < box.children.length; i++) {
                for (let j = 0; j < box.sortableContainers[box.children[i]].children.length; j++) {
                    selected.push(box.sortableContainers[box.children[i]].children[j]);
                    selected = selected.concat(this.getBoxDescendants(this.props.boxes[box.sortableContainers[box.children[i]].children[j]]));
                }
            }
        }
        return selected;
    }

    componentDidMount() {
        let list = jQuery(this.refs.sortableList);
        let props = this.props;
        list.sortable({
            // handle: '.drag-handle' ,
            tolerance: 'intersect',
            connectWith: '.connectedSortables',
            placeholder: "sortable-placeholder",
            //helper: "clone",
            over: (event, ui) => {
                $(event.target).css("border-left", "3px solid #F47920");
            },
            out: (event, ui) => {
                //$(event.target).css("border-left", "none");
            },
            start: (event, ui) => {
                $("#" + this.props.navItemSelected).css("opacity", "0.5");
                // console.log($(".selected").css("background-color"));
            },
            stop: (event, ui) => {
                //$(".selected").css("background-color", "rgba(84, 84, 84 , 1)");
                $("#" + this.props.navItemSelected).css("opacity", "1");
                const reorderedIndexesId = list.sortable('toArray', {attribute: 'id'});

                const select = this.props.navItemSelected;
                const navItems = this.props.navItems;
                const old = navItems[0].children;

                if ($('.carList').css("border-left") === "3px solid rgb(244, 121, 32)" && (reorderedIndexesId.length !== old.length)) {
                    reorderedIndexesId.push(select);
                }
                $(event.target).css("border-left", "none");

                if (reorderedIndexesId.indexOf(select) >= 0) {
                    list.sortable('cancel');

                    var newIndexesAux = [];
                    var newChildrenInOrder = reorderedIndexesId;
                    var selectedAndChilds = [select];

                    const previos = this.props.navItemsIds;

                    for (var i = previos.indexOf(select) + 1; i < previos.length; i++) {
                        if (navItems[previos[i]].level <= navItems[select].level) {
                            break;
                        } else {
                            selectedAndChilds.push(previos[i]);
                        }
                    }

                    var part1 = previos.slice(0, previos.indexOf(select));
                    var part2 = previos.slice(previos.indexOf(select) + selectedAndChilds.length);
                    var concatA = part1.concat(part2);

                    if (newChildrenInOrder.indexOf(select) >= newChildrenInOrder.length - 1) { //es el ultimo de los nuevos hijos
                        newIndexesAux = concatA.concat(selectedAndChilds);
                    } else {//si no es el ultimo nuevo hijo
                        var part1b = concatA.slice(0, concatA.indexOf(newChildrenInOrder[newChildrenInOrder.indexOf(select) + 1]));
                        var part2b = concatA.slice(concatA.indexOf(newChildrenInOrder[newChildrenInOrder.indexOf(select) + 1]));
                        newIndexesAux = part1b.concat(selectedAndChilds, part2b);
                    }

                    this.props.onNavItemReorded(this.props.navItemSelected, 0, 0, newIndexesAux, reorderedIndexesId);
                } else {

                }
            },
            receive: (event, ui) => {
                //$(".selected").css("background-color", "rgba(84, 84, 84 , 1)");
                const reorderedIndexesId = list.sortable('toArray', {attribute: 'id'});
                const parent = this.props.navItems[this.props.navItemSelected].parent;
                const navItems = this.props.navItems;
                const navItemsIds = this.props.navItemsIds;
                const select = this.props.navItemSelected;
                var auxInd = "0";

                $(ui.sender).sortable('cancel');

                if (navItems[0].children.length === reorderedIndexesId.length) {
                    reorderedIndexesId.push(this.props.navItemSelected);
                }

                auxInd = reorderedIndexesId.indexOf(this.props.navItemSelected);

                var newIndexesAux = [];
                var newChildrenInOrder = reorderedIndexesId;
                var selectedAndChilds = [select];

                const previos = this.props.navItemsIds;

                for (var i = previos.indexOf(select) + 1; i < previos.length; i++) {
                    if (navItems[previos[i]].level <= navItems[select].level) {
                        break;
                    } else {
                        selectedAndChilds.push(previos[i]);
                    }
                }

                var part1 = previos.slice(0, previos.indexOf(select));
                var part2 = previos.slice(previos.indexOf(select) + selectedAndChilds.length);
                var concatA = part1.concat(part2);

                if (newChildrenInOrder.indexOf(select) >= newChildrenInOrder.length - 1) { //es el ultimo de los nuevos hijos
                    newIndexesAux = concatA.concat(selectedAndChilds);
                } else {//si no es el ultimo nuevo hijo
                    var part1b = concatA.slice(0, concatA.indexOf(newChildrenInOrder[newChildrenInOrder.indexOf(select) + 1]));
                    var part2b = concatA.slice(concatA.indexOf(newChildrenInOrder[newChildrenInOrder.indexOf(select) + 1]));
                    newIndexesAux = part1b.concat(selectedAndChilds, part2b);
                }

                this.props.onNavItemReorded(this.props.navItemSelected, 0, 4, newIndexesAux, reorderedIndexesId);
            }
        }).bind(this);
    }
}
