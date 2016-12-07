import React, {Component} from 'react';
import {Button} from 'react-bootstrap';
import {ID_PREFIX_PAGE, ID_PREFIX_SECTION} from '../../../constants';
import DaliIndexTitle from '../dali_index_title/DaliIndexTitle';
import {isPage, isSection, isSlide, calculateNewIdOrder} from './../../../utils';

export default class Section extends Component {
    render() {
        let navItem = this.props.navItems[this.props.id];
        let classSelected = this.props.navItemSelected === navItem.id ? 'selected' : 'notSelected';
        return (
            /* jshint ignore:start */
            <div id={this.props.id}
                 onMouseDown={e => {
                    this.props.onNavItemSelected(navItem.id);
                    e.stopPropagation();
                 }}
                 onClick={e => {
                    this.props.onNavItemSelected(navItem.id);
                    e.stopPropagation();
                 }}>
                <div className={"navItemBlock " + classSelected}>
                    <span style={{marginLeft: 20 * (this.props.navItems[this.props.id].level - 1)}}>
                        <button className="expandir" onClick={e => {
                            this.props.onNavItemExpanded(navItem.id, !navItem.isExpanded);
                            e.stopPropagation();
                        }}>
                            <i onClick={e => {
                                    this.props.onNavItemExpanded(navItem.id, !navItem.isExpanded);
                                    e.stopPropagation();
                               }}
                               className={classSelected + '  material-icons'}>
                                {navItem.isExpanded ? "keyboard_arrow_down" : "keyboard_arrow_right"}
                            </i>
                        </button>
                        <span className={classSelected} style={{display: 'inline'}}>
                            <DaliIndexTitle id={this.props.id}
                                            title={navItem.name}
                                            index={navItem.level === 1 ?
                                                navItem.unitNumber + ". " :
                                                this.props.navItems[navItem.parent].children.indexOf(this.props.id) + 1 + '. '}
                                            hidden={navItem.hidden}
                                            onTitleChange={this.props.onTitleChange}
                                            onNavItemToggled={this.props.onNavItemToggled}/>
                        </span>
                    </span>
                </div>
                <div ref="sortableList"
                     style={{
                        paddingTop: 5,
                        display: (navItem.isExpanded ? 'block' : 'none')
                     }}
                     className="sectionList connectedSortables">
                    {navItem.children.map((id, index) => {
                        if (isSection(id)) {
                            return <Section id={id}
                                            key={index}
                                            navItemsIds={this.props.navItemsIds}
                                            navItems={this.props.navItems}
                                            navItemSelected={this.props.navItemSelected}
                                            onBoxAdded={this.props.onBoxAdded}
                                            onNavItemAdded={this.props.onNavItemAdded}
                                            onTitleChange={this.props.onTitleChange}
                                            onNavItemSelected={this.props.onNavItemSelected}
                                            onNavItemExpanded={this.props.onNavItemExpanded}
                                            onNavItemReordered={this.props.onNavItemReordered}
                                            onNavItemToggled={this.props.onNavItemToggled}/>;
                        } else if (isPage(id)) {
                            let classSelected = this.props.navItemSelected === id ? 'selected dragS' : 'notSelected dragS';
                            return (
                                <h4 key={index}
                                    id={id}
                                    className={'navItemBlock ' + classSelected}
                                    onMouseDown={e => {
                                        this.props.onNavItemSelected(id);
                                        e.stopPropagation();
                                    }}
                                    onClick={e => {
                                        this.props.onNavItemSelected(id);
                                        e.stopPropagation();
                                    }}>
                                        <span style={{marginLeft: 25 * (this.props.navItems[id].level - 1)}}>
                                            <i className="material-icons fileIcon">
                                                {isSlide(this.props.navItems[id].type) ? "slideshow" : "insert_drive_file"}
                                            </i>
                                            <DaliIndexTitle id={id}
                                                            index={this.props.navItems[this.props.navItems[id].parent].children.indexOf(id)+1+'.'}
                                                            title={this.props.navItems[id].name}
                                                            hidden={this.props.navItems[id].hidden}
                                                            onTitleChange={this.props.onTitleChange}
                                                            onNavItemToggled={this.props.onNavItemToggled}/>
                                        </span>
                                </h4>
                            );
                        }
                    })}
                </div>
            </div>
            /* jshint ignore:end */
        );
    }

    componentDidMount() {
        let list = jQuery(this.refs.sortableList);
        list.sortable({
            connectWith: '.connectedSortables',
            containment: '.carList',
            scroll: true,
            over: (event, ui) => {
                $(".carList").css("border-left", "none");
                $(".sectionList").removeClass("dragIntoHelper");
                $(event.target).addClass("dragIntoHelper");
            },
            out: (event, ui) => {
                $(".carList").css("border-left", "none");
                $(".sectionList").removeClass("dragIntoHelper");
            },
            start: (event, ui) => {
                $("#" + this.props.navItemSelected).css("opacity", "0.5");
            },
            stop: (event, ui) => {
                // This is called when:
                // - An item is dragged from this items's children to another item
                // - A direct child changes it position at the same level

                // If this item was dragged to another item, its sortable instance has been destroyed already
                if(!list.sortable('instance')){
                    return;
                }
                const newChildren = list.sortable('toArray', {attribute: 'id'});

                // If item moved is still in this element's children (wasn't moved away) -> update
                if (newChildren.indexOf(this.props.navItemSelected) !== -1) {

                    // This is necessary in order to avoid that JQuery touches the DOM
                    // It has to be BEFORE action is dispatched and React tries to repaint
                    list.sortable('cancel');

                    this.props.onNavItemReordered(
                        this.props.navItemSelected, // item moved
                        this.props.id, // new parent
                        this.props.navItems[this.props.navItemSelected].parent, // old parent
                        calculateNewIdOrder(this.props.navItemsIds, newChildren, this.props.id, this.props.navItemSelected, this.props.navItems),
                        newChildren
                    );
                }

                // Restore opacity of moving item
                $("#" + this.props.navItemSelected).css("opacity", "1");
            },
            receive: (event, ui) => {
                // This is called when an item is dragged from another item's children to this element's children
                let newChildren = list.sortable('toArray', {attribute: 'id'});

                // This is necessary in order to avoid that JQuery touches the DOM
                // It has to be BEFORE action is dispatched and React tries to repaint
                $(ui.sender).sortable('cancel');

                this.props.onNavItemReordered(
                    this.props.navItemSelected, // item moved
                    this.props.id, // new parent
                    this.props.navItems[this.props.navItemSelected].parent, // old parent
                    calculateNewIdOrder(this.props.navItemsIds, newChildren, this.props.id, this.props.navItemSelected, this.props.navItems),
                    newChildren
                );

                // Restore opacity of moving item
                $("#" + this.props.navItemSelected).css("opacity", "1");
            }
        });
    }

    componentWillUnmount(){
        console.log("unmounting " + this.props.id);
        jQuery(this.refs.sortableList).sortable("destroy");
    }
}
